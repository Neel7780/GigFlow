"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigflow';
let isConnected = false;
async function connectDB() {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(MONGODB_URI);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
async function disconnectDB() {
    if (!isConnected)
        return;
    await mongoose_1.default.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
}
exports.default = mongoose_1.default;
//# sourceMappingURL=db.js.map