import { HttpException, Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { DatabaseService } from 'src/shared/database/database.service';
import { userSigninDto } from '../dtos/user/auth/user-siginin.dto';
import { checkCredential } from 'src/auth/middlewares/signin-credential-checker';
import { userGoogleSigninDto } from '../dtos/user/auth/user-google-signin.dto';
import {
  generateGoogleAuthToken,
  generateUserToken,
} from 'src/auth/middlewares/jwt';
import * as bcrypt from 'bcrypt';
import { userLoginDto } from '../dtos/user/auth/user-login.dto';
import { UserDocument } from '../models/user/user.model';
import { collections } from 'src/constants/collections';

@Injectable()
export class AuthService {
  private user: Collection<UserDocument>;

  constructor(private readonly db: DatabaseService) {}

  async signin(data: userSigninDto): Promise<{
    state: 'email' | 'phone' | 'username';
    response: 'login' | 'signup';
  }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    const credentialType = checkCredential(data.credential);

    if (!credentialType) {
      throw new HttpException('Invalid credential', 400);
    }

    const userData = await this.user.findOne({
      [credentialType]: data.credential,
    });

    if (userData) {
      return { state: credentialType, response: 'login' };
    } else {
      return { state: credentialType, response: 'signup' };
    }
  }

  async signup(data: any): Promise<{ token: string }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    const userByEmail = await this.user.findOne({ email: data.email });
    if (userByEmail) {
      throw new HttpException('Email is already registered', 400);
    }

    const userByPhone = await this.user.findOne({ phone: data.phone });
    if (userByPhone) {
      throw new HttpException('Phone Number is already registered', 400);
    }

    const userByUsername = await this.user.findOne({
      username: data.email.split('@')[0],
    });
    if (userByUsername) {
      data.username =
        data.email.split('@')[0] + Math.floor(Math.random() * 10000);
    } else {
      data.username = data.email.split('@')[0];
    }

    data.password = await bcrypt.hash(data.password, 10);

    if (!data.image) {
      if (data.gender === 'Male') {
        data.image =
          'https://res.cloudinary.com/djep4papd/image/upload/v1684653271/73658623971098176-avatar_yap3rx.png';
      } else if (data.gender === 'Female') {
        data.image =
          'https://res.cloudinary.com/djep4papd/image/upload/v1684653271/73152894782929282-avatar_t083fv.png';
      }
    }
    data.notifications = 0;
    const response = await this.user.insertOne(data);
    if (!response.insertedId) {
      throw new HttpException('Error in inserting data', 400);
    }
    const token = generateUserToken(response.insertedId.toString());
    return { token };
  }

  async login(data: userLoginDto): Promise<{ token: string }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    const credentialType = checkCredential(data.credential);

    if (!credentialType) {
      throw new HttpException('Invalid credential', 400);
    }

    const user = await this.user.findOne({
      [credentialType]: data.credential,
    });

    if (user?.block) {
      throw new HttpException('User has been Blocked', 400);
    }
    if (user) {
      const status = await bcrypt.compare(data.password, user.password);
      if (status) {
        const token = generateUserToken(user._id.toString());
        return { token };
      } else {
        throw new HttpException('Wrong Password', 400);
      }
    } else {
      throw new HttpException(`No user found`, 400);
    }
  }

  async signinByGoogle(
    data: userGoogleSigninDto,
  ): Promise<{ token: string; state: 'login' | 'signup' }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);

    const userByEmail = await this.user.findOne({ email: data.email });

    // if (userByEmail?.block) {
    //   throw new HttpException('User has been Blocked', 400);
    // }

    if (userByEmail) {
      const token = generateUserToken(userByEmail._id.toString());
      return { token, state: 'login' };
    } else {
      const newUser = {
        email: data.email,
        firstName: (data.displayName as string).split(' ')[0],
        lastName: (data.displayName as string).split(' ')[1],
        image: data.photoURL,
        googleAuth: true,
      };

      const token = generateGoogleAuthToken(newUser);
      return { token, state: 'signup' };
    }
  }

  async signupByGoogle(data: any): Promise<{ token: string }> {
    this.user = this.db.getCollection(collections.USER_COLLECTION);
    const userByEmail = await this.user.findOne({ email: data.email });
    if (userByEmail) {
      throw new HttpException('Email is already registered', 400);
    }

    const userByPhone = await this.user.findOne({ phone: data.phone });
    if (userByPhone) {
      throw new HttpException('Phone Number is already registered', 400);
    }

    const userByUsername = await this.user.findOne({
      username: data.email.split('@')[0],
    });
    if (userByUsername) {
      data.username =
        data.email.split('@')[0] + Math.floor(Math.random() * 10000);
    } else {
      data.username = data.email.split('@')[0];
    }

    data.password = await bcrypt.hash(data.password, 10);
    if (!data.image) {
      if (data.gender === 'Male') {
        data.image =
          'https://res.cloudinary.com/djep4papd/image/upload/v1684653271/73658623971098176-avatar_yap3rx.png';
      } else if (data.gender === 'Female') {
        data.image =
          'https://res.cloudinary.com/djep4papd/image/upload/v1684653271/73152894782929282-avatar_t083fv.png';
      }
    }
    data.notifications = 0;
    const response = await this.user.insertOne(data);
    if (!response.insertedId) {
      throw new HttpException('Error in inserting data', 400);
    }
    const token = generateUserToken(response.insertedId.toString());
    return { token };
  }
}
