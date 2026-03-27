import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new booking' })
  create(@Body() body: {
    userId: string;
    categoryId: string;
    description?: string;
    address: string;
    latitude?: number;
    longitude?: number;
    area?: string;
    estimatedPrice: number;
    scheduledTime?: Date;
  }) {
    return this.bookingsService.create(body);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user bookings' })
  findByUser(@Param('userId') userId: string) {
    return this.bookingsService.findByUser(userId);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending unassigned bookings' })
  findPending() {
    return this.bookingsService.findPending();
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get provider bookings' })
  findByProvider(@Param('providerId') providerId: string) {
    return this.bookingsService.findByProvider(providerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.bookingsService.updateStatus(id, body.status);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign provider to booking' })
  assignProvider(
    @Param('id') id: string,
    @Body() body: { providerId: string },
  ) {
    return this.bookingsService.assignProvider(id, body.providerId);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete booking' })
  complete(
    @Param('id') id: string,
    @Body() body: { finalPrice: number },
  ) {
    return this.bookingsService.complete(id, body.finalPrice);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}