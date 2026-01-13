import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup';
import { User } from '../db/models/User';

describe('Auth Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    describe('User Model', () => {
        it('should create a user with hashed password', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            const user = await User.create(userData);

            expect(user.name).toBe(userData.name);
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Should be hashed
            expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length
        });

        it('should validate password correctly', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            await User.create(userData);
            const user = await User.findOne({ email: userData.email }).select('+password');

            expect(user).not.toBeNull();
            const isMatch = await user!.comparePassword('password123');
            expect(isMatch).toBe(true);

            const isWrongMatch = await user!.comparePassword('wrongpassword');
            expect(isWrongMatch).toBe(false);
        });

        it('should require email and password', async () => {
            await expect(User.create({ name: 'Test' })).rejects.toThrow();
            await expect(User.create({ email: 'test@example.com' })).rejects.toThrow();
        });

        it('should enforce unique email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            await User.create(userData);
            await expect(User.create(userData)).rejects.toThrow();
        });

        it('should validate email format', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123',
            };

            await expect(User.create(userData)).rejects.toThrow();
        });
    });
});
