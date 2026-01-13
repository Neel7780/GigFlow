import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigflow';

let isConnected = false;

export async function connectDB(): Promise<void> {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export async function disconnectDB(): Promise<void> {
    if (!isConnected) return;

    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
}

export default mongoose;
