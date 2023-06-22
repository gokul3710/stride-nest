import { ObjectId } from 'mongodb';

export interface PaymentDocument extends Document {
    _id: ObjectId
    userId: ObjectId
    method: string
    status: string
    amount: number
    currency: string
    date: string | Date | false
    transactionId: string
}