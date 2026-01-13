import mongoose, { Schema, Document } from 'mongoose';

export type BidStatus = 'pending' | 'hired' | 'rejected';

export interface IBid extends Document {
    _id: mongoose.Types.ObjectId;
    gigId: mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    message: string;
    price: number;
    status: BidStatus;
    createdAt: Date;
    updatedAt: Date;
}

const bidSchema = new Schema<IBid>(
    {
        gigId: {
            type: Schema.Types.ObjectId,
            ref: 'Gig',
            required: [true, 'Gig ID is required'],
        },
        freelancerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Freelancer ID is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [1, 'Price must be at least 1'],
        },
        status: {
            type: String,
            enum: ['pending', 'hired', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
bidSchema.index({ gigId: 1, createdAt: -1 });
bidSchema.index({ freelancerId: 1 });
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true }); // One bid per freelancer per gig

export const Bid = mongoose.model<IBid>('Bid', bidSchema);
