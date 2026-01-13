"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBid = createBid;
exports.getBidsForGig = getBidsForGig;
exports.hireBid = hireBid;
exports.getMyBids = getMyBids;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../db/models");
// WebSocket server URL for notifications
const WS_SERVER_URL = process.env.WS_SERVER_URL || 'http://localhost:8080';
// Helper to notify WebSocket server
async function notifyHired(freelancerId, gigTitle) {
    try {
        await fetch(`${WS_SERVER_URL}/notify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Secret': process.env.API_SECRET || 'shared-secret',
            },
            body: JSON.stringify({
                userId: freelancerId,
                type: 'HIRED',
                message: `You have been hired for "${gigTitle}"!`,
                gigTitle,
            }),
        });
    }
    catch (error) {
        console.error('Failed to send WebSocket notification:', error);
        // Don't fail the request if notification fails
    }
}
// Submit bid for a gig
async function createBid(req, res) {
    const freelancerId = req.user._id;
    const { gigId, message, price } = req.body;
    // Check if gig exists and is open
    const gig = await models_1.Gig.findById(gigId);
    if (!gig) {
        res.status(404).json({ error: 'Gig not found' });
        return;
    }
    if (gig.status !== 'open') {
        res.status(400).json({ error: 'This gig is no longer accepting bids' });
        return;
    }
    // Can't bid on own gig
    if (gig.ownerId.toString() === freelancerId.toString()) {
        res.status(400).json({ error: 'You cannot bid on your own gig' });
        return;
    }
    // Check for existing bid
    const existingBid = await models_1.Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
        res.status(409).json({ error: 'You have already submitted a bid for this gig' });
        return;
    }
    const bid = await models_1.Bid.create({
        gigId,
        freelancerId,
        message,
        price,
    });
    const populatedBid = await models_1.Bid.findById(bid._id)
        .populate('freelancerId', 'name avatar');
    res.status(201).json({
        message: 'Bid submitted successfully',
        bid: populatedBid,
    });
}
// Get bids for a gig (owner only)
async function getBidsForGig(req, res) {
    const userId = req.user._id;
    const { gigId } = req.params;
    // Check if user owns the gig
    const gig = await models_1.Gig.findById(gigId);
    if (!gig) {
        res.status(404).json({ error: 'Gig not found' });
        return;
    }
    if (gig.ownerId.toString() !== userId.toString()) {
        res.status(403).json({ error: 'Only the gig owner can view bids' });
        return;
    }
    const bids = await models_1.Bid.find({ gigId })
        .populate('freelancerId', 'name email avatar bio skills')
        .sort({ createdAt: -1 });
    res.json({ bids });
}
// Hire a freelancer (CRITICAL - with transaction)
async function hireBid(req, res) {
    const userId = req.user._id;
    const { bidId } = req.params;
    // Start session for transaction
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Find the bid
        const bid = await models_1.Bid.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            res.status(404).json({ error: 'Bid not found' });
            return;
        }
        // Use findOneAndUpdate with conditions for atomic check-and-update
        // This prevents race conditions - only succeeds if gig is still "open"
        const gig = await models_1.Gig.findOneAndUpdate({
            _id: bid.gigId,
            ownerId: userId,
            status: 'open' // Critical: only if still open
        }, {
            status: 'assigned',
            hiredFreelancerId: bid.freelancerId
        }, { session, new: true });
        if (!gig) {
            await session.abortTransaction();
            // Check why it failed
            const existingGig = await models_1.Gig.findById(bid.gigId);
            if (!existingGig) {
                res.status(404).json({ error: 'Gig not found' });
                return;
            }
            if (existingGig.ownerId.toString() !== userId.toString()) {
                res.status(403).json({ error: 'Only the gig owner can hire' });
                return;
            }
            if (existingGig.status === 'assigned') {
                res.status(400).json({ error: 'A freelancer has already been hired for this gig' });
                return;
            }
            res.status(400).json({ error: 'Unable to hire for this gig' });
            return;
        }
        // Update the winning bid to "hired"
        await models_1.Bid.updateOne({ _id: bidId }, { status: 'hired' }, { session });
        // Reject all other bids for this gig
        await models_1.Bid.updateMany({ gigId: gig._id, _id: { $ne: new mongoose_1.default.Types.ObjectId(bidId) } }, { status: 'rejected' }, { session });
        // Commit the transaction
        await session.commitTransaction();
        // Send real-time notification (after transaction commits)
        notifyHired(bid.freelancerId.toString(), gig.title);
        res.json({
            message: 'Freelancer hired successfully',
            gig: {
                id: gig._id,
                title: gig.title,
                status: gig.status,
            },
        });
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
}
// Get user's submitted bids
async function getMyBids(req, res) {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [bids, total] = await Promise.all([
        models_1.Bid.find({ freelancerId: userId })
            .populate({
            path: 'gigId',
            select: 'title budget status ownerId',
            populate: { path: 'ownerId', select: 'name avatar' },
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        models_1.Bid.countDocuments({ freelancerId: userId }),
    ]);
    res.json({
        bids,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
}
//# sourceMappingURL=bidController.js.map