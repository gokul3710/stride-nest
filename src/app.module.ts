import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { BannerModule } from './banner/banner.module';
import { BrandModule } from './brand/brand.module';
import { NotificationModule } from './notification/notification.module';
import { CouponModule } from './coupon/coupon.module';
import { AdminModule } from './admin/admin.module';

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
