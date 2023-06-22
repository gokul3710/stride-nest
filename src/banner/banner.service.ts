import { HttpException, Injectable } from '@nestjs/common';
import { Collection, Document, ObjectId } from 'mongodb';
import { uploadFilesToCloudinary } from 'src/config/cloudinary.config';
import { collections } from 'src/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class BannerService {
  private banner: Collection<Document>;

  constructor(private readonly db: DatabaseService) {}

  async allBanners() {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    const banners = await this.banner.find().toArray();
    return banners;
  }

  async activeBanners() {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    const banners = await this.banner.find({ active: true }).toArray();
    return banners;
  }

  async bannerById(bannerId: string) {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    const banner = await this.banner.findOne({ _id: new ObjectId(bannerId) });
    return banner;
  }

  async addBanner(banner: any, images: Array<any>) {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    try {
      images = images.map((image) => image.path);
      images = await uploadFilesToCloudinary(images);

      banner.image = images[0];

      banner.active = true;

      const result = await this.banner.insertOne(banner);

      if (!result.insertedId) {
        throw new HttpException({ error: 'Error in adding product' }, 400);
      }
      return result.insertedId;
    } catch {
      throw new HttpException({ error: 'Error in adding product' }, 400);
    }
  }

  async updateBanner(banner: any, images: Array<any>) {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);

    try {
      images = images.map((image) => image.path);
      images = await uploadFilesToCloudinary(images);

      banner.image = images[0];

      const result = await this.banner.updateOne(
        { _id: new ObjectId(banner._id) },
        {
          $set: {
            title: banner.title,
            subtitle: banner.subtitle,
            text: banner.text,
            btnText: banner.btnText,
            image: banner.image,
          },
        },
      );

      if (!result) {
        throw new HttpException({ error: 'Error in adding product' }, 400);
      }
      return result;
    } catch {
      throw new HttpException({ error: 'Error in adding product' }, 400);
    }
  }

  async deleteBanner(bannerId: string) {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    const response = await this.banner.deleteOne({
      _id: new ObjectId(bannerId),
    });
    return response;
  }

  async activateBanner(bannerId: string) {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    const response = await this.banner.updateOne(
      { _id: new ObjectId(bannerId) },
      {
        $set: {
          active: true,
        },
      },
    );
    return response;
  }

  async inActivateBanner(bannerId: string) {
    this.banner = this.db.getCollection(collections.BANNER_COLLECTION);
    const response = await this.banner.updateOne(
      { _id: new ObjectId(bannerId) },
      {
        $set: {
          active: false,
        },
      },
    );
    return response;
  }
}
