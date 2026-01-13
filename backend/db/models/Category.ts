import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    createdAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            minlength: [2, 'Category name must be at least 2 characters'],
            maxlength: [50, 'Category name cannot exceed 50 characters'],
        },
        description: {
            type: String,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
    },
    {
        timestamps: true,
    }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
