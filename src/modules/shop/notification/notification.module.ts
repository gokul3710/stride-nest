import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
