import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { UserGuard } from '../guards/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(UserGuard)
  getUser(@Request() request) {
    return this.userService.getUser(request.user);
  }

  @Get('payment')
  @UseGuards(UserGuard)
  getPayments(@Request() request) {
    return this.userService.getPayments(request.user);
  }

  @Post('session')
  @UseGuards(UserGuard)
  addSession(@Request() request, @Body() { logs }: { logs: Array<string> }) {
    return this.userService.userSession(request.user, logs);
  }

  @Patch('notification/clear')
  @UseGuards(UserGuard)
  clearNotifications(@Request() request) {
    return this.userService.clearNotifications(request.user);
  }

  @Patch('notification/reset')
  @UseGuards(UserGuard)
  resetNotifications(@Request() request) {
    return this.userService.resetNotifications(request.user);
  }

  @Patch('coupon/add')
  @UseGuards(UserGuard)
  addCoupon(@Request() request, @Body() data: any) {
    return this.userService.addCoupon(request.user, data);
  }

  @Patch('coupon/remove')
  @UseGuards(UserGuard)
  removeCoupon(@Request() request) {
    return this.userService.removeCoupon(request.user);
  }
}
