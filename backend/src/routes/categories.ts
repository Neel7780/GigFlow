import { Router } from 'express';
import { getCategories, getCategory, createCategory } from '../controllers/categoryController';
import { authMiddleware, asyncHandler, validate } from '../middleware';
import { createCategorySchema } from '../validators/schemas';

const router = Router();

// GET /api/categories
router.get('/', asyncHandler(getCategories));

// GET /api/categories/:id
router.get('/:id', asyncHandler(getCategory));

// POST /api/categories (Protected)
router.post('/', authMiddleware, validate(createCategorySchema), asyncHandler(createCategory));

export default router;
