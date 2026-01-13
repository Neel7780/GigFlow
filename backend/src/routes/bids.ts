import { Router } from 'express';
import { createBid, getBidsForGig, hireBid, getMyBids } from '../controllers/bidController';
import { authMiddleware, asyncHandler, validate, requireRole } from '../middleware';
import { createBidSchema } from '../validators/schemas';

const router = Router();

// POST /api/bids - Submit a bid (Protected - Freelancers only)
router.post('/', authMiddleware, requireRole('freelancer'), validate(createBidSchema), asyncHandler(createBid));

// GET /api/bids/my - Get user's submitted bids (Protected)
router.get('/my', authMiddleware, asyncHandler(getMyBids));

// GET /api/bids/:gigId - Get all bids for a gig (Owner only)
router.get('/:gigId', authMiddleware, asyncHandler(getBidsForGig));

// PATCH /api/bids/:bidId/hire - Hire a freelancer (Owner only)
router.patch('/:bidId/hire', authMiddleware, asyncHandler(hireBid));

export default router;
