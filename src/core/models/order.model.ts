import { Document, ObjectId } from 'mongodb';

export interface OrderDocument extends Document {
  _id: ObjectId;
  deliveryAddress: DeliveryAddress;
  items: Array<OrderItem>;
  tracking: Tracking;
  payment: ObjectId;
  status: string;
  total: number;
  quantity: number;
  discount: number;
  userId: ObjectId;
}

export interface DeliveryAddress {
  _id: ObjectId;
  name: string;
  phone: string;
  street: string;
  house: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

export interface OrderItem {
  _id: string;
  brand: any;
  model: string;
  description: string;
  color: string;
  size: number;
  price: number;
  material: string;
  style: string;
  year: number;
  condition: string;
  stock: number;
  images: string[];
  quantity: number;
  total: number;
}

export interface Tracking {
  placed: string | Date | false;
  packed: string | Date | false;
  shipped: string | Date | false;
  arrived: string | Date | false;
  delivered: string | Date | false;
  returned: string | Date | false;
  cancelled: string | Date | false;
}
