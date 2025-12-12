"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
async function connectDb() {
    if (isConnected) {
        return mongoose_1.default;
    }
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    try {
        const conn = await mongoose_1.default.connect(MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        return conn;
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
exports.default = connectDb;
//# sourceMappingURL=db.js.map