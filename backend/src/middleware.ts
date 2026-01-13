import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ZodSchema } from 'zod';
import { User, IUser } from '../db/models';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// JWT Token generation
export function generateToken(userId: string): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });
}

// Auth middleware - verifies JWT from HttpOnly cookie
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        next(error);
    }
}

// Optional auth middleware - attaches user if token exists but doesn't require it
export async function optionalAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.cookies?.token;

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch {
        // Token invalid, continue without user
        next();
    }
}

// Validation middleware factory
export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errors' in error) {
                const zodError = error as { errors: Array<{ path: string[]; message: string }> };
                res.status(400).json({
                    error: 'Validation failed',
                    details: zodError.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
}

// Query validation middleware factory
export function validateQuery(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const parsed = schema.parse(req.query);
            // Attach parsed values to request for controller access
            (req as Request & { parsedQuery: typeof parsed }).parsedQuery = parsed;
            Object.assign(req.query, parsed);
            next();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errors' in error) {
                const zodError = error as { errors: Array<{ path: string[]; message: string }> };
                res.status(400).json({
                    error: 'Validation failed',
                    details: zodError.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
}

// Error handler middleware
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
        return;
    }

    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
        res.status(409).json({ error: 'Resource already exists' });
        return;
    }

    // Default error
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
}

// Async handler wrapper
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
