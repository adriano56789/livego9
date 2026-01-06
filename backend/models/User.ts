import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { DocumentType, ResponseType } from '../types/mongoose';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export interface IUser {
  id: string;
  identification?: string;
  name: string;
  email: string;
  password: string;
  diamonds: number;
  earnings: number;
  xp: number;
  level: number;
  avatarUrl?: string;
  coverUrl?: string;
  fans: number;
  following: number;
  followingIds: string[];
  isOnline: boolean;
  activeFrameId: string | null;
  ownedFrames: Array<{ frameId: string; expirationDate: string }>;
  billingAddress?: {
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    zip?: string;
  };
  creditCardInfo?: {
    last4?: string;
    brand?: string;
    expiry?: string;
  };
  fcmTokens: string[];
}

export type UserDocument = DocumentType<IUser>;
export type UserResponse = ResponseType<IUser>;

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  identification: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  diamonds: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  avatarUrl: String,
  coverUrl: String,
  fans: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  followingIds: [{ type: String }],
  isOnline: { type: Boolean, default: false },
  activeFrameId: { type: String, default: null },
  ownedFrames: [{ frameId: String, expirationDate: String }],
  billingAddress: {
    street: String,
    number: String,
    district: String,
    city: String,
    zip: String
  },
  creditCardInfo: {
    last4: String,
    brand: String,
    expiry: String
  },
  fcmTokens: { type: [String], default: [] }
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      const { _id, __v, password, ...user } = ret;
      return {
        ...user,
        id: _id.toString()
      };
    }
  } as const
});

UserSchema.index({ email: 1 });
UserSchema.index({ id: 1 });

// Criando o modelo com tipagem estendida
export interface IUserModel extends Model<IUser> {}
export const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);