// Integration: javascript_database
import { 
  User, 
  LawyerProfile, 
  Case, 
  Message, 
  Payment, 
  Review,
  type InsertUser,
  type UpsertUser,
  type InsertLawyerProfile,
  type InsertCase,
  type InsertMessage,
  type InsertPayment,
  type InsertReview,
  type IUser,
  type ILawyerProfile,
  type ICase,
  type IMessage,
  type IPayment,
  type IReview
} from "@shared/schema";
import { connectDB } from "./db";
import { Types } from "mongoose";

export interface IStorage {
  // User methods (including Replit Auth requirements)
  getUser(id: string): Promise<IUser | undefined>;
  getUserByEmail(email: string): Promise<IUser | undefined>;
  createUser(user: InsertUser): Promise<IUser>;
  upsertUser(user: UpsertUser): Promise<IUser>; // Required for Replit Auth
  updateUser(id: string, updates: Partial<InsertUser>): Promise<IUser | undefined>;
  updatePaystackCustomerId(userId: string, customerId: string): Promise<IUser | undefined>;
  updateUserPaystackInfo(userId: string, data: { customerId: string; customerCode: string }): Promise<IUser | undefined>;

  // Lawyer profile methods
  getLawyerProfile(userId: string): Promise<ILawyerProfile | undefined>;
  createLawyerProfile(profile: InsertLawyerProfile): Promise<ILawyerProfile>;
  updateLawyerProfile(userId: string, updates: Partial<InsertLawyerProfile>): Promise<ILawyerProfile | undefined>;
  searchLawyers(filters: { specialization?: string; location?: string; verified?: boolean }): Promise<(ILawyerProfile & { user: IUser })[]>;
  
  // Case methods
  getCase(id: string): Promise<ICase | undefined>;
  createCase(caseData: InsertCase): Promise<ICase>;
  updateCase(id: string, updates: Partial<ICase>): Promise<ICase | undefined>;
  getCasesByClient(clientId: string): Promise<ICase[]>;
  getCasesByLawyer(lawyerId: string): Promise<ICase[]>;
  getPendingCases(): Promise<ICase[]>;
  
  // Message methods
  getMessagesByCase(caseId: string): Promise<IMessage[]>;
  createMessage(message: InsertMessage): Promise<IMessage>;
  markMessagesAsRead(caseId: string, userId: string): Promise<void>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<IPayment>;
  updatePaymentStatus(id: string, status: string, paystackReference?: string): Promise<IPayment | undefined>;
  getPaymentsByCase(caseId: string): Promise<IPayment[]>;
  
  // Review methods
  createReview(review: InsertReview): Promise<IReview>;
  getReviewsByLawyer(lawyerId: string): Promise<IReview[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Ensure database connection is established
    connectDB().catch(console.error);
  }

  // Helper method to validate string ID (since we use Replit user IDs)
  private isValidStringId(id: string): boolean {
    return typeof id === 'string' && id.length > 0;
  }

  // User methods
  async getUser(id: string): Promise<IUser | undefined> {
    try {
      console.log('Getting user with ID:', id);
      
      if (!this.isValidStringId(id)) {
        console.log('Invalid string ID:', id);
        return undefined;
      }
      
      const user = await User.findById(id);
      console.log('User found:', user ? user._id : 'not found');
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    try {
      const user = await User.findOne({ email });
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    try {
      const user = new User(insertUser);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async upsertUser(userData: UpsertUser): Promise<IUser> {
    try {
      console.log('Upserting user with data:', JSON.stringify(userData, null, 2));
      
      // Use MongoDB's findOneAndUpdate with upsert option
      const user = await User.findOneAndUpdate(
        { 
          $or: [
            { _id: userData.id },
            { email: userData.email }
          ]
        },
        {
          $set: {
            _id: userData.id, // Ensure we set the Replit user ID as our _id
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            userType: userData.userType,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { 
          new: true, 
          upsert: true,
          runValidators: true
        }
      );
      
      console.log('User upserted successfully:', user._id);
      return user;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw new Error('Failed to upsert user');
    }
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<IUser | undefined> {
    try {
      if (!this.isValidObjectId(id)) return undefined;
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      return user || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async updatePaystackCustomerId(userId: string, customerId: string): Promise<IUser | undefined> {
    try {
      if (!this.isValidObjectId(userId)) return undefined;
      const user = await User.findByIdAndUpdate(
        userId, 
        { paystackCustomerId: customerId }, 
        { new: true }
      );
      return user || undefined;
    } catch (error) {
      console.error('Error updating Paystack customer ID:', error);
      return undefined;
    }
  }

  async updateUserPaystackInfo(userId: string, data: { customerId: string; customerCode: string }): Promise<IUser | undefined> {
    try {
      if (!this.isValidObjectId(userId)) return undefined;
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          paystackCustomerId: data.customerId, 
          paystackCustomerCode: data.customerCode
        },
        { new: true }
      );
      return user || undefined;
    } catch (error) {
      console.error('Error updating user Paystack info:', error);
      return undefined;
    }
  }

  // Lawyer profile methods
  async getLawyerProfile(userId: string): Promise<ILawyerProfile | undefined> {
    try {
      if (!this.isValidObjectId(userId)) return undefined;
      const profile = await LawyerProfile.findOne({ userId: new Types.ObjectId(userId) }).populate('userId');
      return profile || undefined;
    } catch (error) {
      console.error('Error getting lawyer profile:', error);
      return undefined;
    }
  }

  async createLawyerProfile(profile: InsertLawyerProfile): Promise<ILawyerProfile> {
    try {
      const newProfile = new LawyerProfile({
        ...profile,
        userId: new Types.ObjectId(profile.userId)
      });
      await newProfile.save();
      return newProfile;
    } catch (error) {
      console.error('Error creating lawyer profile:', error);
      throw new Error('Failed to create lawyer profile');
    }
  }

  async updateLawyerProfile(userId: string, updates: Partial<InsertLawyerProfile>): Promise<ILawyerProfile | undefined> {
    try {
      if (!this.isValidObjectId(userId)) return undefined;
      const profile = await LawyerProfile.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) }, 
        updates, 
        { new: true }
      );
      return profile || undefined;
    } catch (error) {
      console.error('Error updating lawyer profile:', error);
      return undefined;
    }
  }

  async searchLawyers(filters: { specialization?: string; location?: string; verified?: boolean }): Promise<(ILawyerProfile & { user: IUser })[]> {
    try {
      const query: any = { isAvailable: true };
      
      if (filters.verified !== undefined) {
        query.verificationStatus = filters.verified ? 'approved' : { $ne: 'approved' };
      }
      
      if (filters.specialization) {
        query.specializations = { $in: [new RegExp(filters.specialization, 'i')] };
      }
      
      if (filters.location) {
        query.location = new RegExp(filters.location, 'i');
      }

      const profiles = await LawyerProfile.find(query).populate('userId').lean();
      
      return profiles.map(profile => ({
        ...profile,
        user: profile.userId as any
      })) as (ILawyerProfile & { user: IUser })[];
    } catch (error) {
      console.error('Error searching lawyers:', error);
      return [];
    }
  }

  // Case methods
  async getCase(id: string): Promise<ICase | undefined> {
    try {
      if (!this.isValidObjectId(id)) return undefined;
      const caseRecord = await Case.findById(id);
      return caseRecord || undefined;
    } catch (error) {
      console.error('Error getting case:', error);
      return undefined;
    }
  }

  async createCase(caseData: InsertCase): Promise<ICase> {
    try {
      const newCase = new Case({
        ...caseData,
        clientId: new Types.ObjectId(caseData.clientId)
      });
      await newCase.save();
      return newCase;
    } catch (error) {
      console.error('Error creating case:', error);
      throw new Error('Failed to create case');
    }
  }

  async updateCase(id: string, updates: Partial<ICase>): Promise<ICase | undefined> {
    try {
      if (!this.isValidObjectId(id)) return undefined;
      const caseRecord = await Case.findByIdAndUpdate(id, updates, { new: true });
      return caseRecord || undefined;
    } catch (error) {
      console.error('Error updating case:', error);
      return undefined;
    }
  }

  async getCasesByClient(clientId: string): Promise<ICase[]> {
    try {
      if (!this.isValidObjectId(clientId)) return [];
      const cases = await Case.find({ clientId: new Types.ObjectId(clientId) })
        .sort({ createdAt: -1 });
      return cases;
    } catch (error) {
      console.error('Error getting cases by client:', error);
      return [];
    }
  }

  async getCasesByLawyer(lawyerId: string): Promise<ICase[]> {
    try {
      if (!this.isValidObjectId(lawyerId)) return [];
      const cases = await Case.find({ lawyerId: new Types.ObjectId(lawyerId) })
        .sort({ createdAt: -1 });
      return cases;
    } catch (error) {
      console.error('Error getting cases by lawyer:', error);
      return [];
    }
  }

  async getPendingCases(): Promise<ICase[]> {
    try {
      const cases = await Case.find({ status: 'pending' })
        .sort({ createdAt: -1 });
      return cases;
    } catch (error) {
      console.error('Error getting pending cases:', error);
      return [];
    }
  }

  // Message methods
  async getMessagesByCase(caseId: string): Promise<IMessage[]> {
    try {
      if (!this.isValidObjectId(caseId)) return [];
      const messages = await Message.find({ caseId: new Types.ObjectId(caseId) })
        .sort({ createdAt: 1 });
      return messages;
    } catch (error) {
      console.error('Error getting messages by case:', error);
      return [];
    }
  }

  async createMessage(message: InsertMessage): Promise<IMessage> {
    try {
      const newMessage = new Message({
        ...message,
        caseId: new Types.ObjectId(message.caseId),
        senderId: new Types.ObjectId(message.senderId)
      });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to create message');
    }
  }

  async markMessagesAsRead(caseId: string, userId: string): Promise<void> {
    try {
      if (!this.isValidObjectId(caseId) || !this.isValidObjectId(userId)) return;
      await Message.updateMany(
        { 
          caseId: new Types.ObjectId(caseId), 
          senderId: new Types.ObjectId(userId) 
        },
        { isRead: true }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<IPayment> {
    try {
      const newPayment = new Payment({
        ...payment,
        caseId: new Types.ObjectId(payment.caseId),
        clientId: new Types.ObjectId(payment.clientId),
        lawyerId: new Types.ObjectId(payment.lawyerId)
      });
      await newPayment.save();
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  async updatePaymentStatus(id: string, status: string, paystackReference?: string): Promise<IPayment | undefined> {
    try {
      if (!this.isValidObjectId(id)) return undefined;
      const updates: any = { status };
      if (paystackReference) {
        updates.paystackReference = paystackReference;
      }
      
      const payment = await Payment.findByIdAndUpdate(id, updates, { new: true });
      return payment || undefined;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return undefined;
    }
  }

  async getPaymentsByCase(caseId: string): Promise<IPayment[]> {
    try {
      if (!this.isValidObjectId(caseId)) return [];
      const payments = await Payment.find({ caseId: new Types.ObjectId(caseId) })
        .sort({ createdAt: -1 });
      return payments;
    } catch (error) {
      console.error('Error getting payments by case:', error);
      return [];
    }
  }

  // Review methods
  async createReview(review: InsertReview): Promise<IReview> {
    try {
      const newReview = new Review({
        ...review,
        caseId: new Types.ObjectId(review.caseId),
        clientId: new Types.ObjectId(review.clientId),
        lawyerId: new Types.ObjectId(review.lawyerId)
      });
      await newReview.save();
      
      // Update lawyer's rating
      const lawyerReviews = await Review.find({ lawyerId: new Types.ObjectId(review.lawyerId) });
      const avgRating = lawyerReviews.reduce((sum, r) => sum + r.rating, 0) / lawyerReviews.length;
      
      await LawyerProfile.findOneAndUpdate(
        { userId: new Types.ObjectId(review.lawyerId) },
        { rating: parseFloat(avgRating.toFixed(2)) }
      );
      
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error('Failed to create review');
    }
  }

  async getReviewsByLawyer(lawyerId: string): Promise<IReview[]> {
    try {
      if (!this.isValidObjectId(lawyerId)) return [];
      const reviews = await Review.find({ lawyerId: new Types.ObjectId(lawyerId) })
        .sort({ createdAt: -1 });
      return reviews;
    } catch (error) {
      console.error('Error getting reviews by lawyer:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();