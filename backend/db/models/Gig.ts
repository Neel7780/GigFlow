import mongoose, { Schema, Document } from 'mongoose';

export type GigStatus = 'open' | 'assigned';

export interface IGig extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    budgetMin: number;
    budgetMax: number;
    budgetType: 'fixed' | 'hourly';
    duration?: string;
    skills?: string[];
    ownerId: mongoose.Types.ObjectId;
    categoryId?: mongoose.Types.ObjectId;
    status: GigStatus;
    hiredFreelancerId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const gigSchema = new Schema<IGig>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [5, 'Title must be at least 5 characters'],
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [20, 'Description must be at least 20 characters'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        budgetMin: {
            type: Number,
            required: [true, 'Min budget is required'],
            min: [1, 'Budget must be at least 1'],
        },
        budgetMax: {
            type: Number,
            required: [true, 'Max budget is required'],
            min: [1, 'Budget must be at least 1'],
        },
        budgetType: {
            type: String,
            enum: ['fixed', 'hourly'],
            default: 'fixed',
        },
        duration: {
            type: String,
        },
        skills: {
            type: [String],
            default: [],
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner ID is required'],
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        status: {
            type: String,
            enum: ['open', 'assigned'],
            default: 'open',
        },
        hiredFreelancerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for search and filtering
gigSchema.index({ title: 'text' });
gigSchema.index({ status: 1, createdAt: -1 });
gigSchema.index({ ownerId: 1 });
gigSchema.index({ categoryId: 1 });

export const Gig = mongoose.model<IGig>('Gig', gigSchema);
