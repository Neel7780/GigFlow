import mongoose, { Document } from 'mongoose';
export type GigStatus = 'open' | 'assigned';
export interface IGig extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    budget: number;
    ownerId: mongoose.Types.ObjectId;
    categoryId?: mongoose.Types.ObjectId;
    status: GigStatus;
    hiredFreelancerId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Gig: mongoose.Model<IGig, {}, {}, {}, mongoose.Document<unknown, {}, IGig, {}, mongoose.DefaultSchemaOptions> & IGig & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGig>;
//# sourceMappingURL=Gig.d.ts.map