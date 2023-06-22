import { Injectable, HttpException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { generateAdminToken } from 'src/auth/middlewares/jwt';
import { collections } from 'src/constants/collections';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  adminLogin(admin: { email: string; password: string }) {
    if (admin.email != process.env.ADMIN_EMAIL) {
      throw new HttpException('Wrong Email', 400);
    }

    if (admin.password != process.env.ADMIN_PASSWORD) {
      throw new HttpException('Wrong Password', 400);
    }

    const token: string = generateAdminToken();
    return { token };
  }

  async getAllUsers() {
    const users = await this.db
      .getCollection(collections.USER_COLLECTION)
      .find()
      .toArray();
    return users;
  }

  async getUserById(userId: string) {
    const user = await this.db
      .getCollection(collections.USER_COLLECTION)
      .findOne({ _id: new ObjectId(userId) });
    return user;
  }

  async blockUser(userId: string) {
    const response = await this.db
      .getCollection(collections.USER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            block: true,
          },
        },
      );
    return response;
  }

  async unBlockUser(userId: string) {
    const response = await this.db
      .getCollection(collections.USER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            block: false,
          },
        },
      );
    return response;
  }
}
