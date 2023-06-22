import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UserService } from '../user.service';

@Module({
  imports: [DatabaseModule],
  providers: [CartService, UserService],
  controllers: [CartController],
})
export class CartModule {}
