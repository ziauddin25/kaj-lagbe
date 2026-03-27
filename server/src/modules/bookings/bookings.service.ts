import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
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
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    return this.prisma.booking.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        area: data.area,
        estimatedPrice: data.estimatedPrice,
        scheduledTime: data.scheduledTime,
        status: 'PENDING',
      },
      include: {
        category: true,
        user: true,
        provider: { include: { user: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        category: true,
        provider: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.booking.findMany({
      where: {
        status: 'PENDING',
        providerId: null,
      },
      include: {
        category: true,
        user: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.booking.findMany({
      where: { providerId },
      include: {
        category: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
        provider: { include: { user: true } },
        review: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const updateData: any = { status };
    
    if (status === 'IN_PROGRESS') {
      updateData.startTime = new Date();
    } else if (status === 'COMPLETED') {
      updateData.endTime = new Date();
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        user: true,
        provider: { include: { user: true } },
      },
    });
  }

  async assignProvider(bookingId: string, providerId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        providerId,
        status: 'ACCEPTED',
      },
      include: {
        category: true,
        user: true,
        provider: { include: { user: true } },
      },
    });
  }

  async complete(bookingId: string, finalPrice: number) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'COMPLETED',
        finalPrice,
        endTime: new Date(),
      },
      include: { provider: true },
    });

    if (booking.provider) {
      await this.prisma.provider.update({
        where: { id: booking.providerId },
        data: { totalJobs: { increment: 1 } },
      });
    }

    return booking;
  }

  async cancel(bookingId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }
}