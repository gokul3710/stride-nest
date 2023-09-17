import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
