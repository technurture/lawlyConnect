import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userTypeEnum = pgEnum("user_type", ["client", "lawyer", "admin"]);
export const caseStatusEnum = pgEnum("case_status", ["pending", "matched", "in_progress", "resolved", "closed"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "approved", "rejected"]);
export const messageTypeEnum = pgEnum("message_type", ["text", "file", "system"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: userTypeEnum("user_type").notNull().default("client"),
  phone: text("phone"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // Stripe integration fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

// Lawyer profiles
export const lawyerProfiles = pgTable("lawyer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  barNumber: text("bar_number").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  specializations: text("specializations").array().notNull(),
  location: text("location").notNull(),
  bio: text("bio"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("pending"),
  verificationDocuments: jsonb("verification_documents"), // NBA cert, enrollment cert, etc.
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalCases: integer("total_cases").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Cases
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lawyerId: varchar("lawyer_id").references(() => users.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // AI categorized
  urgency: text("urgency").notNull(), // low, medium, high, urgent
  status: caseStatusEnum("status").notNull().default("pending"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  aiSummary: text("ai_summary"), // AI-generated case summary
  aiRecommendations: jsonb("ai_recommendations"), // AI lawyer matching recommendations
  documents: jsonb("documents"), // uploaded documents metadata
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messageType: messageTypeEnum("message_type").notNull().default("text"),
  content: text("content"),
  fileUrl: text("file_url"), // for file messages
  fileName: text("file_name"), // for file messages
  fileSize: integer("file_size"), // for file messages
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lawyerId: varchar("lawyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  lawyerAmount: decimal("lawyer_amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lawyerId: varchar("lawyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  lawyerProfile: one(lawyerProfiles, {
    fields: [users.id],
    references: [lawyerProfiles.userId],
  }),
  clientCases: many(cases, { relationName: "client_cases" }),
  lawyerCases: many(cases, { relationName: "lawyer_cases" }),
  sentMessages: many(messages),
  clientPayments: many(payments, { relationName: "client_payments" }),
  lawyerPayments: many(payments, { relationName: "lawyer_payments" }),
  clientReviews: many(reviews, { relationName: "client_reviews" }),
  lawyerReviews: many(reviews, { relationName: "lawyer_reviews" }),
}));

export const lawyerProfilesRelations = relations(lawyerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [lawyerProfiles.userId],
    references: [users.id],
  }),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  client: one(users, {
    fields: [cases.clientId],
    references: [users.id],
    relationName: "client_cases",
  }),
  lawyer: one(users, {
    fields: [cases.lawyerId],
    references: [users.id],
    relationName: "lawyer_cases",
  }),
  messages: many(messages),
  payments: many(payments),
  reviews: many(reviews),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  case: one(cases, {
    fields: [messages.caseId],
    references: [cases.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  case: one(cases, {
    fields: [payments.caseId],
    references: [cases.id],
  }),
  client: one(users, {
    fields: [payments.clientId],
    references: [users.id],
    relationName: "client_payments",
  }),
  lawyer: one(users, {
    fields: [payments.lawyerId],
    references: [users.id],
    relationName: "lawyer_payments",
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  case: one(cases, {
    fields: [reviews.caseId],
    references: [cases.id],
  }),
  client: one(users, {
    fields: [reviews.clientId],
    references: [users.id],
    relationName: "client_reviews",
  }),
  lawyer: one(users, {
    fields: [reviews.lawyerId],
    references: [users.id],
    relationName: "lawyer_reviews",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

export const insertLawyerProfileSchema = createInsertSchema(lawyerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  totalCases: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  lawyerId: true,
  status: true,
  aiSummary: true,
  aiRecommendations: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  status: true,
  stripePaymentIntentId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLawyerProfile = z.infer<typeof insertLawyerProfileSchema>;
export type LawyerProfile = typeof lawyerProfiles.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
