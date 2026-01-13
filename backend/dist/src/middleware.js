"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
exports.validate = validate;
exports.validateQuery = validateQuery;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../db/models");
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
// JWT Token generation
function generateToken(userId) {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, {
        expiresIn: expiresIn,
    });
}
// Auth middleware - verifies JWT from HttpOnly cookie
async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await models_1.User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        next(error);
    }
}
// Optional auth middleware - attaches user if token exists but doesn't require it
async function optionalAuthMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = await models_1.User.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        }
        next();
    }
    catch {
        // Token invalid, continue without user
        next();
    }
}
// Validation middleware factory
function validate(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        }
        catch (error) {
            if (error && typeof error === 'object' && 'errors' in error) {
                const zodError = error;
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
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.query);
            // Attach parsed values to request for controller access
            req.parsedQuery = parsed;
            Object.assign(req.query, parsed);
            next();
        }
        catch (error) {
            if (error && typeof error === 'object' && 'errors' in error) {
                const zodError = error;
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
function errorHandler(err, _req, res, _next) {
    console.error('Error:', err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
        return;
    }
    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && err.code === 11000) {
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
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=middleware.js.map