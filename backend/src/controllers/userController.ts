import { Request, Response } from 'express';
import { User } from '../../db/models';
import { UpdateUserInput } from '../validators/schemas';

// Get user profile by ID
export async function getProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json({
        user: {
            id: user._id,
            name: user.name,
            bio: user.bio,
            skills: user.skills,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    });
}

// Update current user's profile
export async function updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!._id;
    const updates = req.body as UpdateUserInput;

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json({
        message: 'Profile updated successfully',
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
