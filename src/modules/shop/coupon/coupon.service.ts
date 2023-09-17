import { HttpException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { collections } from 'src/core/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class CouponService {
  private coupon: Collection<Document>;

  constructor(private readonly db: DatabaseService) {}

  async getCoupons() {
    this.coupon = this.db.getCollection(collections.COUPON_COLLECTION);
    const coupons = await this.coupon.find().toArray();
    return coupons;
  }

  async couponByCode(couponCode: string) {
    this.coupon = this.db.getCollection(collections.COUPON_COLLECTION);
    const coupon = await this.coupon.findOne({
      code: couponCode.toUpperCase(),
    });
    return coupon;
  }

  async addCoupon(coupon: any) {
    this.coupon = this.db.getCollection(collections.COUPON_COLLECTION);
    try {
      const result = await this.coupon.insertOne(coupon);
      if (!result.insertedId) {
        throw new HttpException({ error: 'Error in adding coupon' }, 400);
      }
      return result.insertedId;
    } catch {
      throw new HttpException({ error: 'Error in adding coupon' }, 400);
    }
  }

  async updateCoupon(coupon: any) {
    this.coupon = this.db.getCollection(collections.COUPON_COLLECTION);

    try {
      const result = await this.coupon.updateOne(
        { _id: new ObjectId(coupon._id) },
        {
          $set: {
            code: coupon.code,
            amount: Number(coupon.amount),
            minPurchase: coupon.minPurchase,
            expiry: coupon.expiry,
          },
        },
      );
      if (!result) {
        throw new HttpException({ error: 'Error in adding coupon' }, 400);
      }
      return result;
    } catch {
      throw new HttpException({ error: 'Error in adding coupon' }, 400);
    }
  }

  async deleteCoupon(couponId: string) {
    this.coupon = this.db.getCollection(collections.COUPON_COLLECTION);
    const response = await this.coupon.deleteOne({
      _id: new ObjectId(couponId),
    });
    return response;
  }
}
