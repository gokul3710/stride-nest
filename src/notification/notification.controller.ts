import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserGuard } from 'src/guards/auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(UserGuard)
  getNotifications() {
    return this.notificationService.getNotifications();
  }
}
