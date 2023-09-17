import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { UserGuard } from 'src/core/guards/auth.guard';
import { addReviewDto } from '../../../core/dtos/user/review/add-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  addReview(@Request() request, @Body() review: addReviewDto) {
    return this.reviewService.addReview(request.user, review);
  }
}
