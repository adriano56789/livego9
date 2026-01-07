import { Document, Schema, model } from 'mongoose';

export interface ICategory {
    id?: string;
    name: string;
    label: string;
    isActive: boolean;
    order: number;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICategoryDocument extends Omit<ICategory, 'id'>, Document {
    _id: any;
    __v?: number;
}

const CategorySchema = new Schema<ICategoryDocument>({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        lowercase: true
    },
    label: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    order: { 
        type: Number, 
        required: true
    }
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

// Índice para busca otimizada
CategorySchema.index({ name: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ order: 1 });

export const CategoryModel = model<ICategoryDocument>('Category', CategorySchema);
