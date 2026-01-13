import { Router } from 'express';
import { getGigs, getGig, createGig, getMyGigs } from '../controllers/gigController';
import { authMiddleware, asyncHandler, validate, validateQuery } from '../middleware';
import { createGigSchema, gigQuerySchema } from '../validators/schemas';

const router = Router();

// GET /api/gigs - List all open gigs (with pagination & search)
router.get('/', validateQuery(gigQuerySchema), asyncHandler(getGigs));

// GET /api/gigs/my - Get current user's gigs (Protected)
router.get('/my', authMiddleware, asyncHandler(getMyGigs));

// GET /api/gigs/:id - Get single gig
router.get('/:id', asyncHandler(getGig));

// POST /api/gigs - Create new gig (Protected)
router.post('/', authMiddleware, validate(createGigSchema), asyncHandler(createGig));

export default router;
