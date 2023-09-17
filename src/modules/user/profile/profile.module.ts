import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
