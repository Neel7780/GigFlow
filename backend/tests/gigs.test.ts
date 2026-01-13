import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup';
import { Gig, User, Category } from '../db/models';

describe('Gig Tests', () => {
    let testUser: InstanceType<typeof User>;
    let testCategory: InstanceType<typeof Category>;

    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        // Create test user
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        // Create test category
        testCategory = await Category.create({
            name: 'Web Development',
            description: 'Web development projects',
        });
    });

    describe('Gig Model', () => {
        it('should create a gig with required fields', async () => {
            const gigData = {
                title: 'Build a React Landing Page',
                description: 'Need a beautiful landing page with React and Tailwind CSS for my startup.',
                budget: 500,
                ownerId: testUser._id,
            };

            const gig = await Gig.create(gigData);

            expect(gig.title).toBe(gigData.title);
            expect(gig.description).toBe(gigData.description);
            expect(gig.budget).toBe(gigData.budget);
            expect(gig.status).toBe('open'); // Default status
            expect(gig.ownerId.toString()).toBe(testUser._id.toString());
        });

        it('should create a gig with category', async () => {
            const gig = await Gig.create({
                title: 'Build a React Landing Page',
                description: 'Need a beautiful landing page with React and Tailwind CSS.',
                budget: 500,
                ownerId: testUser._id,
                categoryId: testCategory._id,
            });

            expect(gig.categoryId?.toString()).toBe(testCategory._id.toString());
        });

        it('should validate minimum title length', async () => {
            const gigData = {
                title: 'Hi', // Too short (min 5)
                description: 'Need a beautiful landing page with React and Tailwind CSS.',
                budget: 500,
                ownerId: testUser._id,
            };

            await expect(Gig.create(gigData)).rejects.toThrow();
        });

        it('should validate minimum description length', async () => {
            const gigData = {
                title: 'Build a React App',
                description: 'Short', // Too short (min 20)
                budget: 500,
                ownerId: testUser._id,
            };

            await expect(Gig.create(gigData)).rejects.toThrow();
        });

        it('should validate minimum budget', async () => {
            const gigData = {
                title: 'Build a React App',
                description: 'Need a beautiful landing page with React and Tailwind CSS.',
                budget: 0, // Too low (min 1)
                ownerId: testUser._id,
            };

            await expect(Gig.create(gigData)).rejects.toThrow();
        });

        it('should populate owner details', async () => {
            const gig = await Gig.create({
                title: 'Build a React Landing Page',
                description: 'Need a beautiful landing page with React and Tailwind CSS.',
                budget: 500,
                ownerId: testUser._id,
            });

            const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

            expect(populatedGig?.ownerId).toHaveProperty('name', testUser.name);
        });
    });
});
