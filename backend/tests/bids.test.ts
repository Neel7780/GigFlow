import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup';
import { Gig, User, Bid } from '../db/models';

describe('Bid Tests', () => {
    let gigOwner: InstanceType<typeof User>;
    let freelancer: InstanceType<typeof User>;
    let freelancer2: InstanceType<typeof User>;
    let testGig: InstanceType<typeof Gig>;

    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        // Create users
        gigOwner = await User.create({
            name: 'Gig Owner',
            email: 'owner@example.com',
            password: 'password123',
        });

        freelancer = await User.create({
            name: 'Freelancer One',
            email: 'freelancer1@example.com',
            password: 'password123',
        });

        freelancer2 = await User.create({
            name: 'Freelancer Two',
            email: 'freelancer2@example.com',
            password: 'password123',
        });

        // Create test gig
        testGig = await Gig.create({
            title: 'Build a React Landing Page',
            description: 'Need a beautiful landing page with React and Tailwind CSS.',
            budget: 500,
            ownerId: gigOwner._id,
        });
    });

    describe('Bid Model', () => {
        it('should create a bid with required fields', async () => {
            const bidData = {
                gigId: testGig._id,
                freelancerId: freelancer._id,
                message: 'I am an expert React developer with 5 years of experience.',
                price: 450,
            };

            const bid = await Bid.create(bidData);

            expect(bid.message).toBe(bidData.message);
            expect(bid.price).toBe(bidData.price);
            expect(bid.status).toBe('pending'); // Default status
            expect(bid.gigId.toString()).toBe(testGig._id.toString());
            expect(bid.freelancerId.toString()).toBe(freelancer._id.toString());
        });

        it('should enforce one bid per freelancer per gig', async () => {
            await Bid.create({
                gigId: testGig._id,
                freelancerId: freelancer._id,
                message: 'First bid on this project',
                price: 450,
            });

            // Second bid from same freelancer on same gig should fail
            await expect(
                Bid.create({
                    gigId: testGig._id,
                    freelancerId: freelancer._id,
                    message: 'Second bid attempt',
                    price: 400,
                })
            ).rejects.toThrow();
        });

        it('should allow multiple freelancers to bid on same gig', async () => {
            const bid1 = await Bid.create({
                gigId: testGig._id,
                freelancerId: freelancer._id,
                message: 'Bid from freelancer 1',
                price: 450,
            });

            const bid2 = await Bid.create({
                gigId: testGig._id,
                freelancerId: freelancer2._id,
                message: 'Bid from freelancer 2',
                price: 400,
            });

            expect(bid1._id).not.toEqual(bid2._id);
        });
    });

    describe('Hiring Logic', () => {
        it('should update bid status to hired and gig status to assigned', async () => {
            const bid = await Bid.create({
                gigId: testGig._id,
                freelancerId: freelancer._id,
                message: 'I am the best candidate!',
                price: 450,
            });

            // Simulate hire process
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                // Update gig
                await Gig.updateOne(
                    { _id: testGig._id },
                    { status: 'assigned', hiredFreelancerId: freelancer._id },
                    { session }
                );

                // Update bid
                await Bid.updateOne(
                    { _id: bid._id },
                    { status: 'hired' },
                    { session }
                );

                await session.commitTransaction();
            } finally {
                session.endSession();
            }

            const updatedGig = await Gig.findById(testGig._id);
            const updatedBid = await Bid.findById(bid._id);

            expect(updatedGig?.status).toBe('assigned');
            expect(updatedGig?.hiredFreelancerId?.toString()).toBe(freelancer._id.toString());
            expect(updatedBid?.status).toBe('hired');
        });

        it('should reject all other bids when one is hired', async () => {
            // Create multiple bids
            const bid1 = await Bid.create({
                gigId: testGig._id,
                freelancerId: freelancer._id,
                message: 'Bid from freelancer 1',
                price: 450,
            });

            const bid2 = await Bid.create({
                gigId: testGig._id,
                freelancerId: freelancer2._id,
                message: 'Bid from freelancer 2',
                price: 400,
            });

            // Hire bid1
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                await Gig.updateOne(
                    { _id: testGig._id },
                    { status: 'assigned', hiredFreelancerId: freelancer._id },
                    { session }
                );

                await Bid.updateOne(
                    { _id: bid1._id },
                    { status: 'hired' },
                    { session }
                );

                await Bid.updateMany(
                    { gigId: testGig._id, _id: { $ne: bid1._id } },
                    { status: 'rejected' },
                    { session }
                );

                await session.commitTransaction();
            } finally {
                session.endSession();
            }

            const updatedBid1 = await Bid.findById(bid1._id);
            const updatedBid2 = await Bid.findById(bid2._id);

            expect(updatedBid1?.status).toBe('hired');
            expect(updatedBid2?.status).toBe('rejected');
        });

        it('should prevent hiring on already assigned gig', async () => {
            // First, assign the gig
            await Gig.updateOne(
                { _id: testGig._id },
                { status: 'assigned' }
            );

            // Try to update only if status is 'open'
            const result = await Gig.findOneAndUpdate(
                { _id: testGig._id, status: 'open' },
                { status: 'assigned', hiredFreelancerId: freelancer._id },
                { new: true }
            );

            expect(result).toBeNull(); // Should not update as gig is already assigned
        });
    });
});
