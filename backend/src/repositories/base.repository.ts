import { Document, FilterQuery, Model, Types } from "mongoose";

export abstract class BaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async save(data: Partial<T>): Promise<T> {
        try {
            return await this.model.create(data);
        } catch (error) {
            console.error("Error saving document:", error);
            throw new Error("Error saving document");
        }
    }

    async getById(id: string | Types.ObjectId): Promise<T | null> {
        try {
            return await this.model.findById(id).exec();
        } catch (error) {
            console.error("Error retrieving document by ID:", error);
            throw new Error("Error retrieving document by ID");
        }
    }

    async updateById(
        id: string | Types.ObjectId,
        data: Partial<T>
    ): Promise<T | null> {
        try {
            return await this.model
                .findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                })
                .exec();
        } catch (error) {
            console.error("Error updating document by ID:", error);
            throw new Error("Error updating document by ID");
        }
    }

    async getByField(params: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(params).exec();
        } catch (error) {
            console.error("Error retrieving document by field:", error);
            throw new Error("Error retrieving document by field");
        }
    }

    // get all by fields
    async getAllByFields(params: FilterQuery<T>): Promise<T[]> {
        try {
            return await this.model.find(params).exec();
        } catch (error) {
            console.error("Error retrieving documents by fields:", error);
            throw new Error("Error retrieving documents by fields");
        }
    }

    async delete(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { is_deleted: true },
                { new: true }
            );
        } catch (err: any) {
            console.error("Error deleting document:", err);
            throw new Error("Error deleting document");
        }
    }
}
