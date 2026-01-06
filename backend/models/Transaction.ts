import { Document, Schema, model, Types } from 'mongoose';

export type TransactionType = 'recharge' | 'gift' | 'withdrawal' | 'bonus';

export interface ITransaction {
    id?: string;
    userId: string;
    type: TransactionType;
    amountDiamonds?: number;
    amountBRL?: number;
    status?: string;
    details?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITransactionDocument extends Omit<ITransaction, 'id'>, Document {
    _id: Types.ObjectId;
    __v?: number;
}

const TransactionSchema = new Schema<ITransactionDocument>({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    type: { 
        type: String, 
        required: true,
        enum: ['recharge', 'gift', 'withdrawal', 'bonus'] as TransactionType[]
    },
    amountDiamonds: Number,
    amountBRL: Number,
    status: { type: String, default: 'pending' },
    details: Schema.Types.Mixed
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

export const TransactionModel = model<ITransactionDocument>('Transaction', TransactionSchema);