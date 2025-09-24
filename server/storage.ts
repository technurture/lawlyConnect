// Integration: javascript_database
import { 
  users, 
  lawyerProfiles,
  cases,
  messages,
  payments,
  reviews,
  type User, 
  type InsertUser,
  type LawyerProfile,
  type InsertLawyerProfile,
  type Case,
  type InsertCase,
  type Message,
  type InsertMessage,
  type Payment,
  type InsertPayment,
  type Review,
  type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: string, data: { customerId: string; subscriptionId: string }): Promise<User | undefined>;

  // Lawyer profile methods
  getLawyerProfile(userId: string): Promise<LawyerProfile | undefined>;
  createLawyerProfile(profile: InsertLawyerProfile): Promise<LawyerProfile>;
  updateLawyerProfile(userId: string, updates: Partial<InsertLawyerProfile>): Promise<LawyerProfile | undefined>;
  searchLawyers(filters: { specialization?: string; location?: string; verified?: boolean }): Promise<(LawyerProfile & { user: User })[]>;
  
  // Case methods
  getCase(id: string): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: string, updates: Partial<Case>): Promise<Case | undefined>;
  getCasesByClient(clientId: string): Promise<Case[]>;
  getCasesByLawyer(lawyerId: string): Promise<Case[]>;
  getPendingCases(): Promise<Case[]>;
  
  // Message methods
  getMessagesByCase(caseId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(caseId: string, userId: string): Promise<void>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Payment | undefined>;
  getPaymentsByCase(caseId: string): Promise<Payment[]>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByLawyer(lawyerId: string): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateUserStripeInfo(userId: string, data: { customerId: string; subscriptionId: string }): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: data.customerId, 
        stripeSubscriptionId: data.subscriptionId,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  // Lawyer profile methods
  async getLawyerProfile(userId: string): Promise<LawyerProfile | undefined> {
    const [profile] = await db.select().from(lawyerProfiles).where(eq(lawyerProfiles.userId, userId));
    return profile || undefined;
  }

  async createLawyerProfile(profile: InsertLawyerProfile): Promise<LawyerProfile> {
    const [newProfile] = await db
      .insert(lawyerProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateLawyerProfile(userId: string, updates: Partial<InsertLawyerProfile>): Promise<LawyerProfile | undefined> {
    const [profile] = await db
      .update(lawyerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lawyerProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async searchLawyers(filters: { specialization?: string; location?: string; verified?: boolean }): Promise<(LawyerProfile & { user: User })[]> {
    const results = await db.select()
      .from(lawyerProfiles)
      .innerJoin(users, eq(users.id, lawyerProfiles.userId))
      .where(eq(lawyerProfiles.isAvailable, true));

    // Transform results to match expected type
    return results.map(result => ({
      ...result.lawyer_profiles,
      user: result.users
    }));
  }

  // Case methods
  async getCase(id: string): Promise<Case | undefined> {
    const [caseRecord] = await db.select().from(cases).where(eq(cases.id, id));
    return caseRecord || undefined;
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db
      .insert(cases)
      .values(caseData)
      .returning();
    return newCase;
  }

  async updateCase(id: string, updates: Partial<Case>): Promise<Case | undefined> {
    const [caseRecord] = await db
      .update(cases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return caseRecord || undefined;
  }

  async getCasesByClient(clientId: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.clientId, clientId)).orderBy(desc(cases.createdAt));
  }

  async getCasesByLawyer(lawyerId: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.lawyerId, lawyerId)).orderBy(desc(cases.createdAt));
  }

  async getPendingCases(): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.status, 'pending')).orderBy(desc(cases.createdAt));
  }

  // Message methods
  async getMessagesByCase(caseId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.caseId, caseId)).orderBy(asc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessagesAsRead(caseId: string, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(
        eq(messages.caseId, caseId),
        eq(messages.senderId, userId)
      ));
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async updatePaymentStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Payment | undefined> {
    const updates: any = { status, updatedAt: new Date() };
    if (stripePaymentIntentId) {
      updates.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    const [payment] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  async getPaymentsByCase(caseId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.caseId, caseId)).orderBy(desc(payments.createdAt));
  }

  // Review methods
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    
    // Update lawyer's rating
    const lawyerReviews = await db.select().from(reviews).where(eq(reviews.lawyerId, review.lawyerId));
    const avgRating = lawyerReviews.reduce((sum, r) => sum + r.rating, 0) / lawyerReviews.length;
    
    await db
      .update(lawyerProfiles)
      .set({ rating: avgRating.toFixed(2), updatedAt: new Date() })
      .where(eq(lawyerProfiles.userId, review.lawyerId));
    
    return newReview;
  }

  async getReviewsByLawyer(lawyerId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.lawyerId, lawyerId)).orderBy(desc(reviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
