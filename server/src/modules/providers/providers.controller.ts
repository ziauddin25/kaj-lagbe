import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby providers' })
  async findNearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius?: string,
  ) {
    return this.providersService.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : 10,
    );
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get providers by category' })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ) {
    return this.providersService.findByCategory(
      categoryId,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create provider profile' })
  async create(
    @Body() body: {
      userId: string;
      bio?: string;
      skills?: string[];
      basePrice?: number;
      address?: string;
      area?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    return this.providersService.create(body.userId, body);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update provider status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'AVAILABLE' | 'BUSY' | 'OFFLINE' },
  ) {
    return this.providersService.updateStatus(id, body.status);
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update provider location' })
  async updateLocation(
    @Param('id') id: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.providersService.updateLocation(id, body.latitude, body.longitude);
  }

  @Get(':id/earnings')
  @ApiOperation({ summary: 'Get provider earnings' })
  async getEarnings(@Param('id') id: string) {
    return this.providersService.getEarnings(id);
  }
}