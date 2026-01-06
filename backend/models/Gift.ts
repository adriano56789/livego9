import { Document, Schema, model } from 'mongoose';

export interface IGift {
    id?: string;
    name: string;
    price: number;
    icon?: string;
    category?: string;
    triggersAutoFollow?: boolean;
}

export interface IGiftDocument extends Omit<IGift, 'id'>, Document {
    _id: any;
    __v?: number;
}

const GiftSchema = new Schema<IGiftDocument>({
    id: { type: String, unique: true },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    icon: String,
    category: String,
    triggersAutoFollow: { type: Boolean, default: false }
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

export const GiftModel = model<IGiftDocument>('Gift', GiftSchema);