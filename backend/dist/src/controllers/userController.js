"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
const models_1 = require("../../db/models");
// Get user profile by ID
async function getProfile(req, res) {
    const { id } = req.params;
    const user = await models_1.User.findById(id).select('-password');
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
async function updateProfile(req, res) {
    const userId = req.user._id;
    const updates = req.body;
    const user = await models_1.User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });
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
//# sourceMappingURL=userController.js.map