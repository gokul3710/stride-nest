import { ObjectId } from 'mongodb';

export interface AddressDocument extends Document {
  _id: ObjectId;
  userId: ObjectId;
  addresses: Address[];
}

export interface Address {
  _id: ObjectId;
  name: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  country: 'India';
  pincode: string;
  landmark?: string;
  default: boolean;
}
