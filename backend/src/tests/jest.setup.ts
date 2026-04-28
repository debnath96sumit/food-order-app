import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

export default async (): Promise<void> => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    process.env.MONGODB_URI = uri;
    process.env.NODE_ENV = "test";

    // Expose instance so teardown can access it
    (global as any).__MONGOD__ = mongod;
};
