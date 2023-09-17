import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
