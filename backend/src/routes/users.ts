import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authMiddleware, asyncHandler, validate } from '../middleware';
import { updateUserSchema } from '../validators/schemas';

const router = Router();

// GET /api/users/:id - Public profile
router.get('/:id', asyncHandler(getProfile));

// PATCH /api/users/me - Update own profile
router.patch('/me', authMiddleware, validate(updateUserSchema), asyncHandler(updateProfile));

export default router;
