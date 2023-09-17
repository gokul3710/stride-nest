import { CouponService } from './coupon.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminGuard } from 'src/core/guards/admin.guard';

@Controller('coupon')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get()
  getCoupons() {
    return this.couponService.getCoupons();
  }

  @Get(':couponCode')
  getCouponByCode(@Param() { couponCode }: { couponCode: string }) {
    return this.couponService.couponByCode(couponCode);
  }

  
  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  addCoupon(@Body() coupon: any) {
    return this.couponService.addCoupon(coupon);
  }

  @Patch(':couponId')
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  updateCoupon(@Param() { couponId }: { couponId: string },@Body() coupon: any) {
    return this.couponService.updateCoupon({...coupon,couponId});
  }

  @Delete(':couponId')
  @UseGuards(AdminGuard)
  deleteCoupon(@Param() { couponId }: { couponId: string }) {
    return this.couponService.deleteCoupon(couponId);
  }
}
