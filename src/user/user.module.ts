import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileModule } from './profile/profile.module';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from 'src/shared/database/database.module';
import { JwtStrategy } from './jwt.strategy';
import { ReviewModule } from './review/review.module';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [
    ProfileModule,
    AddressModule,
    CartModule,
    OrderModule,
    DatabaseModule,
    ReviewModule,
  ],
})
export class UserModule {}
