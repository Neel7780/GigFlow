import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
    role: z.enum(['freelancer', 'client']),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    skills: z.array(z.string()).optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
});

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name cannot exceed 50 characters'),
    description: z
        .string()
        .max(200, 'Description cannot exceed 200 characters')
        .optional(),
});

export const createGigSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title cannot exceed 100 characters'),
    description: z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .max(5000, 'Description cannot exceed 5000 characters'),
    budgetMin: z.number().min(1, 'Min budget must be at least 1'),
    budgetMax: z.number().min(1, 'Max budget must be at least 1'),
    budgetType: z.enum(['fixed', 'hourly']).optional(),
    duration: z.string().optional(),
    skills: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    category: z.string().optional(), // Allow category name or ID as fallback
});

export const createBidSchema = z.object({
    gigId: z.string().min(1, 'Gig ID is required'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message cannot exceed 2000 characters'),
    price: z.number().min(1, 'Price must be at least 1'),
});

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});

export const gigQuerySchema = paginationSchema.extend({
    search: z.string().optional(),
    category: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateGigInput = z.infer<typeof createGigSchema>;
export type CreateBidInput = z.infer<typeof createBidSchema>;
export type GigQueryInput = z.infer<typeof gigQuerySchema>;
