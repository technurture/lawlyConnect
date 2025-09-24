import mongoose, { Schema, Document, Types } from 'mongoose';
import { z } from 'zod';

// Enums
export const UserType = {
  CLIENT: 'client',
  LAWYER: 'lawyer',
  ADMIN: 'admin'
} as const;

export const CaseStatus = {
  PENDING: 'pending',
  MATCHED: 'matched',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export const VerificationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const MessageType = {
  TEXT: 'text',
  FILE: 'file',
  SYSTEM: 'system'
} as const;

export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

// MongoDB Session Schema (compatible with express-session + MongoDB)
const SessionSchema = new Schema({
  _id: { type: String, required: true },
  expires: { type: Date, required: true },
  session: { type: Schema.Types.Mixed, required: true }
}, {
  collection: 'sessions'
});

export const Session = mongoose.model('Session', SessionSchema);

// User Schema
const UserSchema = new Schema({
  _id: { type: String, required: true }, // Use Replit user ID as string
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  userType: {
    type: String,
    enum: Object.values(UserType),
    default: UserType.CLIENT
  },
  phone: String,
  isVerified: { type: Boolean, default: false },
  // Paystack integration fields
  paystackCustomerId: String,
  paystackCustomerCode: String,
}, {
  timestamps: true,
  _id: false // Disable automatic ObjectId generation
});

export const User = mongoose.model('User', UserSchema);

// Lawyer Profile Schema
const LawyerProfileSchema = new Schema({
  userId: { type: String, ref: 'User', required: true },
  barNumber: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  specializations: [{ type: String, required: true }],
  location: { type: String, required: true },
  bio: String,
  hourlyRate: { type: Number, get: (v: number) => parseFloat(v?.toFixed(2)) },
  consultationFee: { type: Number, get: (v: number) => parseFloat(v?.toFixed(2)) },
  verificationStatus: {
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING
  },
  verificationDocuments: Schema.Types.Mixed, // NBA cert, enrollment cert, etc.
  rating: { type: Number, default: 0.0, get: (v: number) => parseFloat(v?.toFixed(2)) },
  totalCases: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export const LawyerProfile = mongoose.model('LawyerProfile', LawyerProfileSchema);

// Case Schema
const CaseSchema = new Schema({
  clientId: { type: Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // AI categorized
  urgency: { type: String, required: true }, // low, medium, high, urgent
  status: {
    type: String,
    enum: Object.values(CaseStatus),
    default: CaseStatus.PENDING
  },
  budget: { type: Number, get: (v: number) => parseFloat(v?.toFixed(2)) },
  aiSummary: String, // AI-generated case summary
  aiRecommendations: Schema.Types.Mixed, // AI lawyer matching recommendations
  documents: Schema.Types.Mixed, // uploaded documents metadata
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export const Case = mongoose.model('Case', CaseSchema);

// Message Schema
const MessageSchema = new Schema({
  caseId: { type: Types.ObjectId, ref: 'Case', required: true },
  senderId: { type: Types.ObjectId, ref: 'User', required: true },
  messageType: {
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT
  },
  content: String,
  fileUrl: String, // for file messages
  fileName: String, // for file messages
  fileSize: Number, // for file messages
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Message = mongoose.model('Message', MessageSchema);

// Payment Schema
const PaymentSchema = new Schema({
  caseId: { type: Types.ObjectId, ref: 'Case', required: true },
  clientId: { type: Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, get: (v: number) => parseFloat(v?.toFixed(2)) },
  platformFee: { type: Number, required: true, get: (v: number) => parseFloat(v?.toFixed(2)) },
  lawyerAmount: { type: Number, required: true, get: (v: number) => parseFloat(v?.toFixed(2)) },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  paystackReference: String,
  paystackTransactionId: String,
  description: String,
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export const Payment = mongoose.model('Payment', PaymentSchema);

// Review Schema
const ReviewSchema = new Schema({
  caseId: { type: Types.ObjectId, ref: 'Case', required: true },
  clientId: { type: Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', ReviewSchema);

// Zod validation schemas
export const insertUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  userType: z.enum(['client', 'lawyer', 'admin']).default('client'),
  phone: z.string().optional(),
  isVerified: z.boolean().default(false),
});

// UpsertUser schema for authentication
export const upsertUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  userType: z.enum(['client', 'lawyer', 'admin']).default('client'),
});

export const insertLawyerProfileSchema = z.object({
  userId: z.string(),
  barNumber: z.string(),
  yearsOfExperience: z.number().int().positive(),
  specializations: z.array(z.string()).min(1),
  location: z.string(),
  bio: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  consultationFee: z.number().positive().optional(),
  verificationDocuments: z.any().optional(),
  isAvailable: z.boolean().default(true),
});

export const insertCaseSchema = z.object({
  clientId: z.string(),
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.string(),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']),
  budget: z.number().positive().optional(),
  documents: z.any().optional(),
});

export const insertMessageSchema = z.object({
  caseId: z.string(),
  senderId: z.string(),
  messageType: z.enum(['text', 'file', 'system']).default('text'),
  content: z.string().optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().int().positive().optional(),
});

export const insertPaymentSchema = z.object({
  caseId: z.string(),
  clientId: z.string(),
  lawyerId: z.string(),
  amount: z.number().positive(),
  platformFee: z.number().positive(),
  lawyerAmount: z.number().positive(),
  paystackReference: z.string().optional(),
  paystackTransactionId: z.string().optional(),
  description: z.string().optional(),
});

export const insertReviewSchema = z.object({
  caseId: z.string(),
  clientId: z.string(),
  lawyerId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertLawyerProfile = z.infer<typeof insertLawyerProfileSchema>;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Document interfaces
export interface IUser extends Document {
  _id: Types.ObjectId;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  userType: 'client' | 'lawyer' | 'admin';
  phone?: string;
  isVerified: boolean;
  paystackCustomerId?: string;
  paystackCustomerCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILawyerProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  barNumber: string;
  yearsOfExperience: number;
  specializations: string[];
  location: string;
  bio?: string;
  hourlyRate?: number;
  consultationFee?: number;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationDocuments?: any;
  rating: number;
  totalCases: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICase extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  lawyerId?: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: 'pending' | 'matched' | 'in_progress' | 'resolved' | 'closed';
  budget?: number;
  aiSummary?: string;
  aiRecommendations?: any;
  documents?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  caseId: Types.ObjectId;
  senderId: Types.ObjectId;
  messageType: 'text' | 'file' | 'system';
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  caseId: Types.ObjectId;
  clientId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  amount: number;
  platformFee: number;
  lawyerAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paystackReference?: string;
  paystackTransactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: Types.ObjectId;
  caseId: Types.ObjectId;
  clientId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}