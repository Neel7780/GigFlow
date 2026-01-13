"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
const models_1 = require("../../db/models");
const middleware_1 = require("../middleware");
// Cookie options for JWT token
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Must be true if sameSite is 'none'
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
};
// Register new user
async function register(req, res) {
    const { name, email, password } = req.body;
    // Check if user exists
    const existingUser = await models_1.User.findOne({ email });
    if (existingUser) {
        res.status(409).json({ error: 'Email already registered' });
        return;
    }
    // Create user
    const user = await models_1.User.create({ name, email, password });
    // Generate token and set cookie
    const token = (0, middleware_1.generateToken)(user._id.toString());
    res.cookie('token', token, cookieOptions);
    res.status(201).json({
        message: 'Registration successful',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
}
// Login user
async function login(req, res) {
    const { email, password } = req.body;
    // Find user with password
    const user = await models_1.User.findOne({ email }).select('+password');
    if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    // Generate token and set cookie
    const token = (0, middleware_1.generateToken)(user._id.toString());
    res.cookie('token', token, cookieOptions);
    res.json({
        message: 'Login successful',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            skills: user.skills,
            avatar: user.avatar,
        },
    });
}
// Logout user
async function logout(_req, res) {
    res.cookie('token', '', {
        ...cookieOptions,
        maxAge: 0,
    });
    res.json({ message: 'Logout successful' });
}
// Get current user
async function me(req, res) {
    const user = req.user;
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            skills: user.skills,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    });
}
//# sourceMappingURL=authController.js.map