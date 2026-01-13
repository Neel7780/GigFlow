import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Gig, Bid } from '../../db/models';
import { CreateGigInput } from '../validators/schemas';

// Get all open gigs with pagination and search
export async function getGigs(req: Request, res: Response): Promise<void> {
    const { search, category, page = 1, limit = 10 } = req.query as {
        search?: string;
        category?: string;
        page?: number;
        limit?: number;
    };

    // Build query
    const query: Record<string, unknown> = { status: 'open' };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (category) {
        query.categoryId = category;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [gigs, total] = await Promise.all([
        Gig.find(query)
            .populate('ownerId', 'name avatar')
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Gig.countDocuments(query),
    ]);

    res.json({
        gigs,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
}

// Get single gig by ID
export async function getGig(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const gig = await Gig.findById(id)
        .populate('ownerId', 'name email avatar bio')
        .populate('categoryId', 'name')
        .populate('hiredFreelancerId', 'name avatar');

    if (!gig) {
        res.status(404).json({ error: 'Gig not found' });
        return;
    }

    // Get bid count
    const bidCount = await Bid.countDocuments({ gigId: id });

    res.json({
        gig: {
            ...gig.toObject(),
            bidCount,
        },
    });
}

// Create new gig
export async function createGig(req: Request, res: Response): Promise<void> {
    const userId = req.user!._id;
    // Extract fields from body. Note: validation is already done by middleware
    const {
        title,
        description,
        budgetMin,
        budgetMax,
        budgetType,
        duration,
        skills,
        categoryId,
        category // Frontend might send 'category' instead of 'categoryId'
    } = req.body;

    // Validate categoryId is a valid ObjectId before assigning
    let finalCategoryId: string | undefined = undefined;
    if (categoryId && mongoose.isValidObjectId(categoryId)) {
        finalCategoryId = categoryId;
    } else if (category && mongoose.isValidObjectId(category)) {
        finalCategoryId = category;
    }

    const gig = await Gig.create({
        title,
        description,
        budgetMin,
        budgetMax,
        budgetType: budgetType || 'fixed',
        duration,
        skills,
        categoryId: finalCategoryId,
        ownerId: userId,
    });

    const populatedGig = await Gig.findById(gig._id)
        .populate('ownerId', 'name avatar')
        .populate('categoryId', 'name');

    res.status(201).json({
        message: 'Gig created successfully',
        gig: populatedGig,
    });
}

// Get user's own gigs
export async function getMyGigs(req: Request, res: Response): Promise<void> {
    const userId = req.user!._id;
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };

    const skip = (Number(page) - 1) * Number(limit);

    const [gigs, total] = await Promise.all([
        Gig.find({ ownerId: userId })
            .populate('categoryId', 'name')
            .populate('hiredFreelancerId', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Gig.countDocuments({ ownerId: userId }),
    ]);

    // Get bid counts for each gig
    const gigsWithBids = await Promise.all(
        gigs.map(async (gig) => {
            const bidCount = await Bid.countDocuments({ gigId: gig._id });
            return { ...gig.toObject(), bidCount };
        })
    );

    res.json({
        gigs: gigsWithBids,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
}
