import mongoose, { Document } from 'mongoose';
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
export declare const Bid: mongoose.Model<IBid, {}, {}, {}, mongoose.Document<unknown, {}, IBid, {}, mongoose.DefaultSchemaOptions> & IBid & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBid>;
//# sourceMappingURL=Bid.d.ts.map