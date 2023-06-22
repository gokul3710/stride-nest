import { HttpException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { uploadFilesToCloudinary } from 'src/config/cloudinary.config';
import { DatabaseService } from 'src/shared/database/database.service';
import { editProductDto } from '../dtos/product/edit-product.dto';
import { ProductDocument } from './interfaces/product-document.interface';
import { collections } from 'src/constants/collections';
import { toFilterQuery } from './middlewares/toFilter';

@Injectable()
export class ProductService {
  private product: Collection<ProductDocument>;

  constructor(private readonly db: DatabaseService) {}

  async allProducts() {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);
    const products = await this.product
      .aggregate([
        {
          $lookup: {
            from: collections.BRAND_COLLECTION,
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $project: {
            brand: { $arrayElemAt: ['$brand', 0] },
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        {
          $project: {
            brand: '$brand.name',
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
      ])
      .toArray();
    return products;
  }

  async productById(productId: string) {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);
    const product = await this.product.findOne({
      _id: new ObjectId(productId),
    });
    return product;
  }

  async addProduct(product: any, images: Array<any>) {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);
    product = this.toProduct(product);
    try {
      images = images.map((image) => image.path);
      product.images = await uploadFilesToCloudinary(images);

      const result = await this.product.insertOne(product);

      if (!result.insertedId) {
        throw new HttpException({ error: 'Error in adding product' }, 400);
      }
      return result.insertedId;
    } catch {
      throw new HttpException({ error: 'Error in adding product' }, 400);
    }
  }

  async editProduct(product: editProductDto) {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);
    try {
      const result = await this.product.updateOne(
        { _id: new ObjectId(product._id) },
        {
          $set: {
            brand: product.brand,
            model: product.model,
            color: product.color,
            size: product.size,
            price: product.price,
            material: product.material,
            style: product.style,
            year: product.year,
            stock: product.stock,
          },
        },
      );
      if (!result.matchedCount) {
        throw new HttpException({ error: 'Error in updating product' }, 400);
      }
      return { data: result.matchedCount && result.modifiedCount };
    } catch {
      throw new HttpException({ error: 'Error in updating product' }, 400);
    }
  }

  async deleteProduct(productId: string) {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);
    try {
      const result = await this.product.deleteOne({
        _id: new ObjectId(productId),
      });
      if (!result.deletedCount) {
        throw new HttpException(
          { error: `No Product with the Id ${productId}` },
          400,
        );
      }
      return { data: 'Deleted Successfully' };
    } catch {
      throw new HttpException({ error: 'Error in Deleting product' }, 400);
    }
  }

  async editProductImage(productId: string, images: Array<any>) {
    try {
      images = images.map((image) => image.path);
      const imageUrls: string[] = await uploadFilesToCloudinary(images);

      const result = await this.product.updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            images: imageUrls,
          },
        },
      );

      if (!result.modifiedCount) {
        throw new HttpException({ error: 'Error in updating images' }, 400);
      }
      return 'Done';
    } catch {
      throw new HttpException({ error: 'Error in updating images' }, 400);
    }
  }

  async filterProducts(query: any, page: string) {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);

    if (!/^\d+$/.test(page)) {
      throw new HttpException('Invalid page', 400);
    }

    const pageCount = Number(page);

    const [filters, sort] = toFilterQuery(query);

    const productsCount = await this.product
      .aggregate([
        {
          $lookup: {
            from: collections.BRAND_COLLECTION,
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $project: {
            brand: { $arrayElemAt: ['$brand', 0] },
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        {
          $project: {
            brand: '$brand.name',
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        {
          $match: filters,
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const products = await this.product
      .aggregate([
        {
          $lookup: {
            from: collections.BRAND_COLLECTION,
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $project: {
            brand: { $arrayElemAt: ['$brand', 0] },
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        {
          $project: {
            brand: '$brand.name',
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        // {
        //     $lookup: {
        //         from: collections.STYLE_COLLECTION,
        //         localField: 'style',
        //         foreignField: '_id',
        //         as: 'style'
        //     }
        // },
        {
          $match: filters,
        },
        {
          $sort: sort ? sort : { _id: 1 },
        },
        {
          $skip: (pageCount - 1) * 12,
        },
        {
          $limit: 12,
        },
      ])
      .toArray();
    return { products, productsCount: productsCount[0]?.count };
  }

  async searchProducts(searchString: string) {
    this.product = this.db.getCollection(collections.PRODUCT_COLLECTION);

    const search = new RegExp(searchString, 'i');
    const searchProducts = await this.product
      .aggregate([
        {
          $lookup: {
            from: collections.BRAND_COLLECTION,
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $project: {
            brand: { $arrayElemAt: ['$brand', 0] },
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        {
          $project: {
            brand: '$brand.name',
            model: 1,
            description: 1,
            color: 1,
            size: 1,
            price: 1,
            material: 1,
            style: 1,
            year: 1,
            condition: 1,
            images: 1,
            stock: 1,
          },
        },
        {
          $match: {
            $or: [
              { brand: { $regex: search } },
              { model: { $regex: search } },
              { style: { $regex: search } },
              { material: { $regex: search } },
              { color: { $regex: search } },
            ],
          },
        },
      ])
      .toArray();
    return searchProducts;
  }

  async toProduct(product: any) {
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    product.year = Number(product.year);
    product.size = Number(product.size);
    const brand = await this.db
      .getCollection(collections.BRAND_COLLECTION)
      .findOne({ name: product.brand.toLowerCase() });
    if (!brand || !brand?._id) {
      throw new HttpException('Invalid brand name', 400);
    }
    product.brand = brand._id;

    // let style = await db.get().collection(collections.STYLE_COLLECTION).findOne({name: (product.style).toLowerCase()})
    // product.style = style._id
    return product;
  }
}
