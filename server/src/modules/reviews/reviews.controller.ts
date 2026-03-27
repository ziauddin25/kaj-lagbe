import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create review' })
  create(@Body() body: {
    bookingId: string;
    userId: string;
    providerId: string;
    rating: number;
    comment?: string;
  }) {
    return this.reviewsService.create(body);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get provider reviews' })
  findByProvider(@Param('providerId') providerId: string) {
    return this.reviewsService.findByProvider(providerId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user reviews' })
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get('provider/:providerId/rating')
  @ApiOperation({ summary: 'Get provider rating' })
  getProviderRating(@Param('providerId') providerId: string) {
    return this.reviewsService.getProviderRating(providerId);
  }
}