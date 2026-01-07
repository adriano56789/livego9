import { Document, Schema, model, Types } from 'mongoose';
import { IUser } from './User';

export interface IWithdrawalMethod {
  type: 'pix' | 'bank_transfer' | 'email';
  details: {
    email?: string;
    pixKey?: string;
    bankCode?: string;
    agency?: string;
    account?: string;
    accountType?: 'checking' | 'savings';
    document?: string;
    fullName?: string;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWithdrawalRequest {
  userId: Types.ObjectId | IUser;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: IWithdrawalMethod;
  processedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  referenceId?: string; // External payment processor reference
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlatformEarnings {
  userId: Types.ObjectId | IUser;
  totalEarned: number; // Total earned from platform fees
  availableBalance: number; // Available for withdrawal
  totalWithdrawn: number; // Total amount withdrawn
  pendingWithdrawals: number; // Amount in pending withdrawal requests
  lastWithdrawalDate?: Date;
  lastEarningDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schemas
const withdrawalMethodSchema = new Schema<IWithdrawalMethod & Document>(
  {
    type: {
      type: String,
      enum: ['pix', 'bank_transfer', 'email'],
      required: true,
    },
    details: {
      email: { type: String },
      pixKey: { type: String },
      bankCode: { type: String },
      agency: { type: String },
      account: { type: String },
      accountType: { type: String, enum: ['checking', 'savings'] },
      document: { type: String },
      fullName: { type: String },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const withdrawalRequestSchema = new Schema<IWithdrawalRequest & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    method: { type: withdrawalMethodSchema, required: true },
    processedAt: { type: Date },
    completedAt: { type: Date },
    failureReason: { type: String },
    referenceId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const platformEarningsSchema = new Schema<IPlatformEarnings & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalEarned: { type: Number, default: 0, min: 0 },
    availableBalance: { type: Number, default: 0, min: 0 },
    totalWithdrawn: { type: Number, default: 0, min: 0 },
    pendingWithdrawals: { type: Number, default: 0, min: 0 },
    lastWithdrawalDate: { type: Date },
    lastEarningDate: { type: Date },
  },
  { timestamps: true }
);

// Indexes
withdrawalRequestSchema.index({ userId: 1, status: 1 });
withdrawalRequestSchema.index({ status: 1, createdAt: 1 });
platformEarningsSchema.index({ userId: 1 }, { unique: true });

// Models
export const WithdrawalMethod = model<IWithdrawalMethod & Document>('WithdrawalMethod', withdrawalMethodSchema);
export const WithdrawalRequest = model<IWithdrawalRequest & Document>('WithdrawalRequest', withdrawalRequestSchema);
export const PlatformEarnings = model<IPlatformEarnings & Document>('PlatformEarnings', platformEarningsSchema);

// Types for the frontend
export type WithdrawalMethod = IWithdrawalMethod;
export type WithdrawalRequest = IWithdrawalRequest;
export type PlatformEarnings = IPlatformEarnings;
