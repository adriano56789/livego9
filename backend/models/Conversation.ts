import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation {
  participants: string[];
  lastMessage: string;
  unreadCount: Map<string, number>;
  updatedAt: Date;
  createdAt: Date;
}

export interface IConversationDocument extends IConversation, Document {}

export interface IConversationResponse extends Omit<IConversation, '_id' | '__v'> {
  id: string;
}

const ConversationSchema = new Schema<IConversationDocument>({
  participants: [{ type: String, required: true }],
  lastMessage: { type: String, default: '' },
  unreadCount: { type: Map, of: Number, default: new Map() },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      const { _id, __v, ...rest } = ret;
      return {
        id: _id,
        ...rest,
        unreadCount: Object.fromEntries(ret.unreadCount || new Map())
      };
    }
  }
});

export const ConversationModel = mongoose.model<IConversationDocument>('Conversation', ConversationSchema);
