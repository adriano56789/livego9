import { Schema, model, Document, Types } from 'mongoose';

export enum RecordingStatus {
  STARTING = 'starting',
  ACTIVE = 'active',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  FAILED = 'failed',
  COMPLETED = 'completed',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing'
}

export enum RecordingType {
  AUDIO = 'audio',
  VIDEO = 'video',
  AUDIO_VIDEO = 'audio_video',
  DATA = 'data'
}

export interface IRecordingFile extends Document {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  duration: number;
  url?: string;
  storageProvider: string;
  storageKey?: string;
  width?: number;
  height?: number;
  bitrate?: number;
  codec?: string;
  createdAt: Date;
}

export interface ILivekitRecording extends Document {
  sid: string;
  roomId: Types.ObjectId;
  roomName: string;
  status: RecordingStatus;
  type: RecordingType;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  file?: IRecordingFile;
  error?: string;
  createdBy: Types.ObjectId;
  metadata?: Record<string, any>;
  isActive: boolean;
  storageBucket?: string;
  storagePath?: string;
  participantIds: Types.ObjectId[];
  maxViews?: number;
  viewCount: number;
  isPublic: boolean;
  tags: string[];
}

const RecordingFileSchema = new Schema<IRecordingFile>({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  duration: { type: Number, required: true },
  url: { type: String },
  storageProvider: { type: String, default: 'local' },
  storageKey: { type: String },
  width: { type: Number },
  height: { type: Number },
  bitrate: { type: Number },
  codec: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const LivekitRecordingSchema = new Schema<ILivekitRecording>(
  {
    sid: { type: String, required: true, unique: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'LivekitRoom', required: true },
    roomName: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(RecordingStatus),
      default: RecordingStatus.STARTING,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(RecordingType),
      default: RecordingType.AUDIO_VIDEO,
      index: true
    },
    startedAt: { type: Date, default: Date.now, index: true },
    endedAt: { type: Date },
    duration: { type: Number, default: 0 }, // em segundos
    file: { type: RecordingFileSchema },
    error: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    metadata: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true, index: true },
    storageBucket: { type: String },
    storagePath: { type: String },
    participantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxViews: { type: Number },
    viewCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false, index: true },
    tags: [{ type: String, index: true }]
  },
  { timestamps: true }
);

// Índices para melhorar consultas frequentes
LivekitRecordingSchema.index({ roomId: 1, status: 1 });
LivekitRecordingSchema.index({ createdBy: 1 });
LivekitRecordingSchema.index({ 'file.storageProvider': 1 });
LivekitRecordingSchema.index({ isPublic: 1, status: 1 });
LivekitRecordingSchema.index({ tags: 1 });
LivekitRecordingSchema.index({ startedAt: -1 });

export const LivekitRecording = model<ILivekitRecording>('LivekitRecording', LivekitRecordingSchema);
