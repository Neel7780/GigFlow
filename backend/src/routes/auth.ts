import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController';
import { authMiddleware, asyncHandler, validate } from '../middleware';
import { registerSchema, loginSchema } from '../validators/schemas';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), asyncHandler(register));

// POST /api/auth/login
router.post('/login', validate(loginSchema), asyncHandler(login));

// POST /api/auth/logout
router.post('/logout', authMiddleware, asyncHandler(logout));

// GET /api/auth/me
router.get('/me', authMiddleware, asyncHandler(me));

export default router;
