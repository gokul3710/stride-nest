import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../../core/guards/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  adminLogin(@Body() admin: { email: string; password: string }) {
    return this.adminService.adminLogin(admin);
  }

  @Get('user')
  @UseGuards(AdminGuard)
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('user/:userId')
  @UseGuards(AdminGuard)
  getUserById(@Param() { userId }: { userId: string }) {
    return this.adminService.getUserById(userId);
  }

  @Patch('user/:userId/block')
  @UseGuards(AdminGuard)
  blockUser(@Param() { userId }: { userId: string }) {
    return this.adminService.blockUser(userId);
  }

  @Patch('user/:userId/unblock')
  @UseGuards(AdminGuard)
  unBlockUser(@Param() { userId }: { userId: string }) {
    return this.adminService.unBlockUser(userId);
  }
}
