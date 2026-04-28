import { MongoMemoryServer } from "mongodb-memory-server";

export default async (): Promise<void> => {
    const mongod: MongoMemoryServer = (global as any).__MONGOD__;
    if (mongod) {
        await mongod.stop();
    }
};
