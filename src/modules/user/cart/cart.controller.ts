import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserGuard } from '../../../core/guards/auth.guard';
import { CartService } from './cart.service';
import { addToCartDto } from '../../../core/dtos/user/cart/add-to-cart.dto';
import { editCartDto } from '../../../core/dtos/user/cart/edit-cart.dto';

@Controller('user/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(UserGuard)
  getCart(@Request() request: { user: string }) {
    return this.cartService.cartProducts(request.user);
  }

  @Get('total')
  @UseGuards(UserGuard)
  getCartTotal(@Request() request: { user: string }) {
    return this.cartService.getCartTotal(request.user);
  }

  @Post()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  addToCart(@Request() request: { user: string }, @Body() data: addToCartDto) {
    return this.cartService.addToCart(request.user, data);
  }

  @Patch()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  changeQuantity(
    @Request() request: { user: string },
    @Body() data: editCartDto,
  ) {
    return this.cartService.changeQuantity(request.user, data);
  }

  @Delete(':productId')
  @UseGuards(UserGuard)
  removeFromCart(
    @Request() request: { user: string },
    @Param() { productId }: { productId: string },
  ) {
    return this.cartService.removeFromCart(request.user, productId);
  }
}
