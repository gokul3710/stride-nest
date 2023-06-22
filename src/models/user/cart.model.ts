import { Document, ObjectId } from "mongodb";

export interface CartDocument extends Document{
    _id: ObjectId,
    user: ObjectId,
    products: Array<CartItem>
}

export interface CartItem {
    item: ObjectId,
    quantity: number
}