import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserGuard } from '../../../core/guards/auth.guard';
import { OrderService } from './order.service';
import { OrderDto } from '../../../core/dtos/user/order/order.dto';
import { OrderCancelDto } from '../../../core/dtos/user/order/order-cancel.dto';

@Controller('user/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(UserGuard)
  getOrderById(@Request() request: { user: string }) {
    return this.orderService.allOrders(request.user);
  }

  @Post()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  placeOrder(
    @Request() request: { user: string },
    @Body() orderdata: OrderDto,
  ) {
    return this.orderService.placeOrder(request.user, orderdata);
  }

  @Patch('cancel')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  cancelOrder(
    @Request() request: { user: string },
    @Body() { orderId }: OrderCancelDto,
  ) {
    return this.orderService.cancelOrder(request.user, orderId);
  }

  @Patch('return')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  returnOrder(
    @Request() request: { user: string },
    @Body() { orderId }: OrderCancelDto,
  ) {
    return this.orderService.cancelOrder(request.user, orderId);
  }
}
