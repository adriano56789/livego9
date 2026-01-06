import { Document, Schema, model } from 'mongoose';

export interface IStreamer {
    id?: string;
    streamer_id: string;
    hostId: string;
    name: string;
    avatar?: string;
    thumbnail?: string;
    category?: string;
    viewers?: number;
    location?: string;
    isPrivate?: boolean;
    quality?: string;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IStreamerDocument extends Omit<IStreamer, 'id'>, Document {
    _id: any;
    __v?: number;
}

const StreamerSchema = new Schema<IStreamerDocument>({
    id: { type: String, required: true, unique: true },
    streamer_id: { type: String, required: true, index: true },
    hostId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    avatar: String,
    thumbnail: String,
    category: { type: String, default: 'popular' },
    viewers: { type: Number, default: 0 },
    location: String,
    isPrivate: { type: Boolean, default: false },
    quality: { type: String, default: '720p' },
    tags: [String]
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            const { _id, __v, ...rest } = ret;
            return {
                id: _id.toString(),
                ...rest
            };
        }
    }
});

export const StreamerModel = model<IStreamerDocument>('Streamer', StreamerSchema);
