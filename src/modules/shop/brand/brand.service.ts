import { HttpException, Injectable } from '@nestjs/common';
import { Collection, Document, ObjectId } from 'mongodb';
import { uploadFilesToCloudinary } from 'src/config/cloudinary.config';
import { collections } from 'src/core/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class BrandService {
  private brand: Collection<Document>;

  constructor(private readonly db: DatabaseService) {}

  async allBrands() {
    this.brand = this.db.getCollection(collections.BRAND_COLLECTION);
    const brands = await this.brand.find().toArray();
    return brands;
  }

  async brandById(brandId: string) {
    this.brand = this.db.getCollection(collections.BRAND_COLLECTION);
    const brand = await this.brand.findOne({ _id: new ObjectId(brandId) });
    return brand;
  }

  async addBrand(brand: any, images: Array<any>) {
    this.brand = this.db.getCollection(collections.BRAND_COLLECTION);
    try {
      images = images.map((image) => image.path);
      images = await uploadFilesToCloudinary(images);

      brand.image = images[0];

      const result = await this.brand.insertOne(brand);

      if (!result.insertedId) {
        throw new HttpException({ error: 'Error in adding brand' }, 400);
      }
      return result.insertedId;
    } catch {
      throw new HttpException({ error: 'Error in adding brand' }, 400);
    }
  }

  async updateBrand(brand: any, images: Array<any>) {
    this.brand = this.db.getCollection(collections.BRAND_COLLECTION);

    try {
      images = images.map((image) => image.path);
      images = await uploadFilesToCloudinary(images);

      brand.image = images[0];

      const result = await this.brand.updateOne(
        { _id: new ObjectId(brand._id) },
        {
          $set: {
            image: brand.image,
            name: brand.name,
            description: brand.description,
          },
        },
      );

      if (!result) {
        throw new HttpException({ error: 'Error in adding brand' }, 400);
      }
      return result;
    } catch {
      throw new HttpException({ error: 'Error in adding brand' }, 400);
    }
  }

  async deleteBrand(brandId: string) {
    this.brand = this.db.getCollection(collections.BRAND_COLLECTION);
    const response = await this.brand.deleteOne({ _id: new ObjectId(brandId) });
    return response;
  }
}
