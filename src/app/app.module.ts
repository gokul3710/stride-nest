import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../modules/user/user.module';
import { AuthModule } from '../modules/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from '../modules/shop/product/product.module';
import { BannerModule } from '../modules/shop/banner/banner.module';
import { BrandModule } from '../modules/shop/brand/brand.module';
import { NotificationModule } from '../modules/shop/notification/notification.module';
import { CouponModule } from '../modules/shop/coupon/coupon.module';
import { AdminModule } from '../modules/admin/admin.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MulterModule.register({
      dest: './uploads',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    ProductModule,
    BannerModule,
    BrandModule,
    NotificationModule,
    CouponModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
