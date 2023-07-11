import { HttpException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { collections } from 'src/constants/collections';
import { OrderDocument } from 'src/models/user/order.model';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class OrderService {
  private order: Collection<OrderDocument>;

  constructor(private readonly db: DatabaseService) {}

  async allOrders(userId: string): Promise<OrderDocument[]> {
    this.order = this.db.getCollection(collections.ORDER_COLLECTION);
    const orders = await this.order
      .find({ userId: new ObjectId(userId) })
      .sort({ _id: -1 })
      .toArray();
    return orders;
  }

  async placeOrder(userId: string, order: any): Promise<ObjectId> {
    this.order = this.db.getCollection(collections.ORDER_COLLECTION);

    order.userId = new ObjectId(userId);

    order.payment.userId = new ObjectId(userId);

    const cart = await this.db
      .getCollection(collections.CART_COLLECTION)
      .findOne({ user: new ObjectId(userId) });

    if (order?.items?.length === 1) {
      const productExist = cart?.products?.find(
        (product) => product.item.toString() === order.items[0]._id,
      );
      if (productExist) {
        await this.db
          .getCollection(collections.CART_COLLECTION)
          .deleteOne({ user: new ObjectId(userId) });
      }
    } else {
      await this.db
        .getCollection(collections.CART_COLLECTION)
        .deleteOne({ user: new ObjectId(userId) });
    }

    const products = order.items.map((item) => {
      return { _id: item._id, quantity: item.quantity };
    });

    const stockUpdate = await this.updateStock(products);

    const paymentId = await this.db
      .getCollection(collections.PAYMENT_COLLECTION)
      .insertOne(order.payment);
    order.payment = paymentId.insertedId;
    order.deliveryAddress.country = 'India';
    const response = await this.order.insertOne(order);
    return response.insertedId;
  }

  async cancelOrder(userId: string, orderId: string): Promise<OrderDocument> {
    this.order = this.db.getCollection(collections.ORDER_COLLECTION);
    const order = await this.order.findOne({ _id: new ObjectId(orderId) });
    if (userId !== order.userId.toString()) {
      throw new HttpException('Unauthorized attempt', 401);
    }

    if (order.status === 'delivered') {
      throw new HttpException('Already Delivered', 400);
    }

    if (order.status === 'cancelled') {
      throw new HttpException('Already Cancelled', 400);
    }

    order.tracking.cancelled = new Date();

    const payment = await this.db
      .getCollection(collections.PAYMENT_COLLECTION)
      .findOne({ _id: order.payment });

    if (payment.method !== 'COD') {
      await this.db.getCollection(collections.PAYMENT_COLLECTION).updateOne(
        { _id: payment._id },
        {
          $set: {
            status: 'refunded',
          },
        },
      );
      payment.status = 'refunded';
    }
    order.status = 'cancelled';
    const response = await this.order.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: 'cancelled',
          tracking: order.tracking,
        },
      },
    );
    order.payment = payment;
    return order;
  }

  async updateStock(
    products: { _id: ObjectId; quantity: number }[],
  ): Promise<{ status: 'Done' }> {
    const productCollection = this.db.getCollection(
      collections.PRODUCT_COLLECTION,
    );
    const updatePromises = products.map((item) =>
      productCollection.updateOne(
        { _id: new ObjectId(item._id) },
        { $inc: { stock: -Number(item.quantity) } },
      ),
    );

    Promise.all(updatePromises)
      .then((results) => {
        return true;
      })
      .catch((error) => {
        throw new HttpException('Error updating stock', 400);
      });

    return { status: 'Done' };
  }
}
