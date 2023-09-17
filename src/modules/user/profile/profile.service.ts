import { HttpException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { UserDocument } from 'src/core/models/user.model';
import { DatabaseService } from 'src/shared/database/database.service';
import { passwordChangeDto } from '../../../core/dtos/user/profile/password-change.dto';
import * as bcrypt from 'bcrypt';
import { collections } from 'src/core/constants/collections';
import {readFileSync} from 'fs'
import { uploadFileToS3 } from 'src/config/aws.config';

@Injectable()
export class ProfileService {
  private user: Collection<UserDocument>;

  constructor(private readonly db: DatabaseService) {}

  async editProfile(
    userId: string,
    { firstName, lastName }: { firstName: string; lastName: string },
  ): Promise<{ status: 'Done' }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    if (!firstName.trim() || !lastName.trim()) {
      throw new HttpException('Name should not be empty', 400);
    }

    const response = await this.user.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          firstName,
          lastName,
        },
      },
    );

    if (!response.modifiedCount) {
      throw new HttpException('Could not update name', 400);
    }

    return { status: 'Done' };
  }

  async editUsername(
    userId: string,
    username: string,
  ): Promise<{ status: 'Done' }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    if (!username.trim() || username.length < 5) {
      throw new HttpException('Username should have atleast 5 characters', 400);
    }

    const userByUsername = await this.user.findOne({ username });

    if (userByUsername && userByUsername._id.toString() !== userId) {
      throw new HttpException('Username is not available', 400);
    }

    const response = await this.user.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          username,
        },
      },
    );

    if (!response.modifiedCount) {
      throw new HttpException('Could not update username', 400);
    }

    return { status: 'Done' };
  }

  async editPhone(userId: string, phone: string): Promise<{ status: 'Done' }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    if (!phone.trim() || phone.length != 10) {
      throw new HttpException('Invalid Phone Number', 400);
    }

    const userByUsername = await this.user.findOne({ phone });

    if (userByUsername && userByUsername._id.toString() !== userId) {
      throw new HttpException('Phone number is laready registered', 400);
    }

    const response = await this.user.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          phone,
        },
      },
    );

    if (!response.modifiedCount) {
      throw new HttpException('Could not update phone', 400);
    }

    return { status: 'Done' };
  }

  async editImage(
    userId: string,
    images: Array<any>,
  ): Promise<{ status: 'Done'; data: string }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    let file = images[0]

    const fileBuffer = readFileSync(file?.path);
    const fileName = file?.filename;

    let link = await uploadFileToS3(fileBuffer,fileName)
    console.log(link);
    
    const response = await this.user.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          image: link,
        },
      },
    );

    if (!response.modifiedCount) {
      throw new HttpException('Could not update image', 400);
    }

    return { status: 'Done', data: link };
  }

  async changePassword(
    userId: string,
    passwords: passwordChangeDto,
  ): Promise<{ status: 'Done' }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    const user = await this.user.findOne({ _id: new ObjectId(userId) });
    if (user) {
      const status = await bcrypt.compare(passwords.password, user.password);
      if (status) {
        const password = await bcrypt.hash(passwords.newPassword, 10);
        const response = await this.user.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              password: password,
            },
          },
        );

        return { status: 'Done' };
      } else {
        throw new HttpException('Wrong Password', 400);
      }
    } else {
      throw new HttpException('User Not Found', 400);
    }
  }
}
