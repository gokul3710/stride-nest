import { HttpException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { collections } from 'src/core/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';
import { UserService } from '../user.service';
import { CartDocument } from 'src/core/models/cart.model';

@Injectable()
export class CartService {
  private cart: Collection<CartDocument>;

  constructor(
    private readonly db: DatabaseService,
    private userService: UserService,
  ) {}

  async cartProducts(userId: string) {
    this.cart = this.db.getCollection(collections.CART_COLLECTION);

    let cartProducts = await this.cart
      ?.aggregate([
        {
          $match: { user: new ObjectId(userId) },
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity',
          },
        },
        {
          $lookup: {
            from: collections.PRODUCT_COLLECTION,
            localField: 'item',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ['$product', 0] },
          },
        },
        {
          $lookup: {
            from: collections.BRAND_COLLECTION,
            localField: 'product.brand',
            foreignField: '_id',
            as: 'product.brand',
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: 1,
            total: {
              $multiply: [
                '$quantity',
                { $convert: { input: '$product.price', to: 'int' } },
              ],
            },
          },
        },
      ])
      .toArray();
    cartProducts = cartProducts.map((cartProduct) => {
      cartProduct.product.brand = cartProduct.product.brand[0];
      return cartProduct;
    });
    return cartProducts;
  }

  async addToCart(
    userId: string,
    data: { productId: string; count?: number },
  ): Promise<{ status: 'Done' }> {
    this.cart = this.db.getCollection(collections.CART_COLLECTION);

    data.count = data.count ? data.count : 1;

    const productObj = {
      item: new ObjectId(data.productId),
      quantity: data.count,
    };

    const cart = await this.cart?.findOne({ user: new ObjectId(userId) });

    if (cart) {
      const productExist = cart.products.findIndex(
        (product) => product.item.toString() == data.productId,
      );
      if (productExist != -1) {
        const product = await this.db
          .getCollection(collections.PRODUCT_COLLECTION)
          .findOne({ _id: new ObjectId(data.productId) });

        const cartProduct = cart.products.filter(
          (cartProduct) => cartProduct.item.toString() === data.productId,
        );
        if (Number(product.stock) < cartProduct[0].quantity + data.count) {
          throw new HttpException('No more stock', 400);
        }

        const response = await this.cart?.updateOne(
          {
            user: new ObjectId(userId),
            'products.item': new ObjectId(data.productId),
          },
          {
            $inc: { 'products.$.quantity': data.count ? data.count : 1 },
          },
        );
        if (response) {
          return { status: 'Done' };
        }
      } else {
        const response = await this.cart?.updateOne(
          { user: new ObjectId(userId) },
          {
            $push: { products: productObj },
          },
        );
        if (response) {
          return { status: 'Done' };
        }
      }
    } else {
      const cartObj: any = {
        user: new ObjectId(userId),
        products: [productObj],
      };
      const response = await this.cart?.insertOne(cartObj);
      if (response) {
        return { status: 'Done' };
      }
    }
  }

  async removeFromCart(
    userId: string,
    productId: string,
  ): Promise<{ status: 'Done' }> {
    this.cart = this.db.getCollection(collections.CART_COLLECTION);

    const response = await this.cart?.updateOne(
      { user: new ObjectId(userId) },
      {
        $pull: { products: { item: new ObjectId(productId) } },
      },
    );
    if (response) {
      return { status: 'Done' };
    }
  }

  async getCartTotal(userId: string) {
    this.cart = this.db.getCollection(collections.CART_COLLECTION);

    const total = await this.cart
      ?.aggregate([
        {
          $match: { user: new ObjectId(userId) },
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity',
            coupon: '$coupon',
          },
        },
        {
          $lookup: {
            from: collections.PRODUCT_COLLECTION,
            localField: 'item',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            coupon: 1,
            product: { $arrayElemAt: ['$product', 0] },
          },
        },
        {
          $group: {
            _id: null,
            subtotal: {
              $sum: {
                $multiply: [
                  '$quantity',
                  { $convert: { input: '$product.price', to: 'int' } },
                ],
              },
            },
            items: { $sum: { $multiply: ['$quantity', 1] } },
          },
        },
        {
          $project: {
            _id: 0,
            subtotal: 1,
            items: 1,
          },
        },
      ])
      .toArray();

    const cartTotal = total[0];

    if (cartTotal) {
      if (cartTotal.subtotal < 1000) {
        cartTotal.shipping = 100;
      } else {
        cartTotal.shipping = 0;
      }

      const cart = await this.cart?.findOne({ user: new ObjectId(userId) });

      if (cart?.coupon) {
        const coupon = await this.db
          .getCollection(collections.COUPON_COLLECTION)
          .findOne({ _id: cart.coupon });
        if (coupon) {
          if (new Date(coupon.expiry) < new Date()) {
            cartTotal.discount = 0;
            this.userService.removeCoupon(userId);
          } else {
            cartTotal.discount = coupon.amount;
            cartTotal.couponCode = coupon.code;
          }
        } else {
          cartTotal.discount = 0;
          this.userService.removeCoupon(userId);
        }
      } else {
        cartTotal.discount = 0;
      }

      return cartTotal;
    } else {
      throw new HttpException('Cart Is Empty', 400);
    }
  }

  async changeQuantity(
    userId: string,
    data: { productId: string; count: number },
  ): Promise<{ status: 'Done' }> {
    this.cart = this.db.getCollection(collections.CART_COLLECTION);

    const count = Number(data.count);

    const product = await this.db
      .getCollection(collections.PRODUCT_COLLECTION)
      .findOne({ _id: new ObjectId(data.productId) });

    const cart = await this.cart?.findOne({ user: new ObjectId(userId) });

    const cartProduct = cart?.products?.filter(
      (cartProduct) => cartProduct.item.toString() === data.productId,
    );

    if (Number(product?.stock) < cartProduct[0]?.quantity + count) {
      throw new HttpException('No more stock', 400);
    }

    const response = this.cart?.updateOne(
      {
        user: new ObjectId(userId),
        'products.item': new ObjectId(data.productId),
      },
      {
        $inc: { 'products.$.quantity': count },
      },
    );
    if (response) {
      return { status: 'Done' };
    }
  }
}
