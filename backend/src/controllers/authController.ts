import { Request, Response } from 'express';
import { User } from '../../db/models';
import { generateToken } from '../middleware';
import { RegisterInput, LoginInput } from '../validators/schemas';

// Cookie options for JWT token
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
};

// Register new user
export async function register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body as RegisterInput;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(409).json({ error: 'Email already registered' });
        return;
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token and set cookie
    const token = generateToken(user._id.toString());
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
export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as LoginInput;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
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
    const token = generateToken(user._id.toString());
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
export async function logout(_req: Request, res: Response): Promise<void> {
    res.cookie('token', '', {
        ...cookieOptions,
        maxAge: 0,
    });

    res.json({ message: 'Logout successful' });
}

// Get current user
export async function me(req: Request, res: Response): Promise<void> {
    const user = req.user!;

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
