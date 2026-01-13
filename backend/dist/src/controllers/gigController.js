"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGigs = getGigs;
exports.getGig = getGig;
exports.createGig = createGig;
exports.getMyGigs = getMyGigs;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../db/models");
// Get all open gigs with pagination and search
async function getGigs(req, res) {
    const { search, category, page = 1, limit = 10 } = req.query;
    // Build query
    const query = { status: 'open' };
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
        models_1.Gig.find(query)
            .populate('ownerId', 'name avatar')
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        models_1.Gig.countDocuments(query),
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
async function getGig(req, res) {
    const { id } = req.params;
    const gig = await models_1.Gig.findById(id)
        .populate('ownerId', 'name email avatar bio')
        .populate('categoryId', 'name')
        .populate('hiredFreelancerId', 'name avatar');
    if (!gig) {
        res.status(404).json({ error: 'Gig not found' });
        return;
    }
    // Get bid count
    const bidCount = await models_1.Bid.countDocuments({ gigId: id });
    res.json({
        gig: {
            ...gig.toObject(),
            bidCount,
        },
    });
}
// Create new gig
async function createGig(req, res) {
    const userId = req.user._id;
    // Extract fields from body. Note: validation is already done by middleware
    const { title, description, budgetMin, budgetMax, budgetType, duration, skills, categoryId, category // Frontend might send 'category' instead of 'categoryId'
     } = req.body;
    // Validate categoryId is a valid ObjectId before assigning
    let finalCategoryId = undefined;
    if (categoryId && mongoose_1.default.isValidObjectId(categoryId)) {
        finalCategoryId = categoryId;
    }
    else if (category && mongoose_1.default.isValidObjectId(category)) {
        finalCategoryId = category;
    }
    const gig = await models_1.Gig.create({
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
    const populatedGig = await models_1.Gig.findById(gig._id)
        .populate('ownerId', 'name avatar')
        .populate('categoryId', 'name');
    res.status(201).json({
        message: 'Gig created successfully',
        gig: populatedGig,
    });
}
// Get user's own gigs
async function getMyGigs(req, res) {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [gigs, total] = await Promise.all([
        models_1.Gig.find({ ownerId: userId })
            .populate('categoryId', 'name')
            .populate('hiredFreelancerId', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        models_1.Gig.countDocuments({ ownerId: userId }),
    ]);
    // Get bid counts for each gig
    const gigsWithBids = await Promise.all(gigs.map(async (gig) => {
        const bidCount = await models_1.Bid.countDocuments({ gigId: gig._id });
        return { ...gig.toObject(), bidCount };
    }));
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
//# sourceMappingURL=gigController.js.map