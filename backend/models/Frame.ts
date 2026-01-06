import mongoose, { Document, Schema } from 'mongoose';

export interface IFrame {
  id: string;
  name: string;
  price: number;
  category: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFrameDocument extends Omit<IFrame, 'id'>, Document {}

export interface IFrameResponse extends Omit<IFrame, '_id' | '__v'> {
  id: string;
}

const FrameSchema = new Schema<IFrameDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'avatar' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, { _id, __v, ...rest }) {
      return {
        id: _id,
        ...rest
      };
    }
  }
});

export const FrameModel = mongoose.model<IFrameDocument>('Frame', FrameSchema);
