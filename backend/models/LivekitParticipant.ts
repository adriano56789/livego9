import { Schema, model, Document, Types } from 'mongoose';

export interface ILivekitParticipant extends Document {
  sid: string;
  identity: string;
  name: string;
  state: string;
  metadata?: string;
  joinedAt: Date;
  leftAt?: Date;
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  isPublisher: boolean;
  isModerator: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  lastActiveAt: Date;
  permissions: {
    canPublish: boolean;
    canSubscribe: boolean;
    canPublishData: boolean;
  };
  trackSids: string[];
}

const LivekitParticipantSchema = new Schema<ILivekitParticipant>(
  {
    sid: { type: String, required: true, unique: true },
    identity: { type: String, required: true },
    name: { type: String, required: true },
    state: { 
      type: String, 
      enum: ['connecting', 'connected', 'disconnected', 'reconnecting'],
      default: 'connecting'
    },
    metadata: { type: String },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    roomId: { type: Schema.Types.ObjectId, ref: 'LivekitRoom', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublisher: { type: Boolean, default: false },
    isModerator: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    isCameraOff: { type: Boolean, default: true },
    isScreenSharing: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: Date.now },
    permissions: {
      canPublish: { type: Boolean, default: true },
      canSubscribe: { type: Boolean, default: true },
      canPublishData: { type: Boolean, default: true },
    },
    trackSids: [{ type: String }],
  },
  { timestamps: true }
);

// Índices para melhorar consultas frequentes
LivekitParticipantSchema.index({ roomId: 1, state: 1 });
LivekitParticipantSchema.index({ userId: 1 });
LivekitParticipantSchema.index({ identity: 1 }, { unique: true });
LivekitParticipantSchema.index({ lastActiveAt: 1 });

export const LivekitParticipant = model<ILivekitParticipant>('LivekitParticipant', LivekitParticipantSchema);
