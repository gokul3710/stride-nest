import { HttpException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { collections } from 'src/core/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async getUser(userId: string) {
    const user = await this.db
      .getCollection(collections.USER_COLLECTION)
      .findOne({ _id: new ObjectId(userId) });
    return user;
  }

  async getPayments(userId: string) {
    const payments = await this.db
      .getCollection(collections.PAYMENT_COLLECTION)
      .aggregate([
        {
          $match: {
            $and: [
              { userId: new ObjectId(userId) },
              { status: { $in: ['paid', 'refunded'] } },
            ],
          },
        },
        {
          $lookup: {
            from: collections.ORDER_COLLECTION,
            localField: '_id',
            foreignField: 'payment',
            as: 'order',
          },
        },
        {
          $project: {
            method: 1,
            status: 1,
            amount: 1,
            currency: 1,
            date: 1,
            transactionId: 1,
            userId: 1,
            order: { $arrayElemAt: ['$order', 0] },
          },
        },
      ])
      .toArray();
    return payments;
  }

  async userSession(userId: string, logs: Array<string>) {
    const session = {
      user: new ObjectId(userId),
      logs,
      createdOn: new Date(),
    };
    const response = await this.db
      .getCollection(collections.SESSION_COLLECTION)
      .insertOne(session);
    return response;
  }

  async clearNotifications(userId: string) {
    const response = await this.db
      .getCollection(collections.USER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            notificationCleared: new Date(),
          },
        },
      );
    return response;
  }

  async resetNotifications(userId: string) {
    const response = await this.db
      .getCollection(collections.USER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            notifications: 0,
          },
        },
      );
    return response;
  }

  async addCoupon(
    userId: string,
    data: { couponCode: string; subtotal: number },
  ) {
    const coupon = await this.db
      .getCollection(collections.COUPON_COLLECTION)
      .findOne({ code: data.couponCode });
    if (coupon) {
      if (Number(coupon.minPurchase) > Number(data.subtotal)) {
        throw new HttpException('Minimum purchase not met', 400);
      }

      if (new Date(coupon?.expiry) < new Date()) {
        throw new HttpException('Coupon Expired', 400);
      }

      const response = this.db
        .getCollection(collections.CART_COLLECTION)
        .updateOne(
          { user: new ObjectId(userId) },
          {
            $set: {
              coupon: coupon._id,
            },
          },
        );
      return coupon;
    } else {
      throw new HttpException('Invalid Coupon', 400);
    }
  }

  async removeCoupon(userId: string) {
    const response = await this.db
      .getCollection(collections.CART_COLLECTION)
      .updateOne(
        { user: new ObjectId(userId) },
        {
          $set: {
            coupon: null,
          },
        },
      );
    return response;
  }
}
