"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigQuerySchema = exports.paginationSchema = exports.createBidSchema = exports.createGigSchema = exports.createCategorySchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Auth schemas
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// User schemas
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .optional(),
    bio: zod_1.z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
});
// Category schemas
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name cannot exceed 50 characters'),
    description: zod_1.z
        .string()
        .max(200, 'Description cannot exceed 200 characters')
        .optional(),
});
// Gig schemas
exports.createGigSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .max(5000, 'Description cannot exceed 5000 characters'),
    budget: zod_1.z.number().min(1, 'Budget must be at least 1'),
    categoryId: zod_1.z.string().optional(),
});
// Bid schemas
exports.createBidSchema = zod_1.z.object({
    gigId: zod_1.z.string().min(1, 'Gig ID is required'),
    message: zod_1.z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message cannot exceed 2000 characters'),
    price: zod_1.z.number().min(1, 'Price must be at least 1'),
});
// Query schemas
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(50).default(10),
});
exports.gigQuerySchema = exports.paginationSchema.extend({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
});
//# sourceMappingURL=schemas.js.map