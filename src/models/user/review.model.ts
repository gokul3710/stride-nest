import { Document, ObjectId } from "mongodb";

export interface reviewDocument extends Document {
    _id?: ObjectId
    userId: ObjectId,
    productId: ObjectId,
    rating: number,
    review: string,
    createdAt: Date | string
}