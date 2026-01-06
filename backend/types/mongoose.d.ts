import { Document, Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
    }
  }
}

export type DocumentType<T> = Document<unknown, {}, T> & T & {
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ResponseType<T> = Omit<T, keyof Document<unknown, {}, T>> & {
  id: string;
  _id?: never;
  __v?: never;
  createdAt?: string;
  updatedAt?: string;
};
