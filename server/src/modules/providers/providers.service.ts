import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async findNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    const providers = await this.prisma.provider.findMany({
      where: {
        status: 'AVAILABLE',
        isApproved: true,
        latitude: { not: null },
      },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return providers.map(p => {
      const dlat = ((p.latitude || 0) - latitude) * Math.PI / 180;
      const dlng = ((p.longitude || 0) - longitude) * Math.PI / 180;
      const a = Math.sin(dlat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos((p.latitude || 0) * Math.PI / 180) * Math.sin(dlng / 2) ** 2;
      const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return {
        ...p,
        userName: p.user?.name,
        userAvatar: p.user?.avatar,
        distance: Math.round(distance * 100) / 100,
      };
    }).sort((a, b) => a.distance - b.distance);
  }

  async findByCategory(categoryId: string, latitude?: number, longitude?: number) {
    const where: any = {
      categories: { some: { categoryId } },
      status: 'AVAILABLE',
      isApproved: true,
    };

    const providers = await this.prisma.provider.findMany({
      where,
      include: {
        user: true,
        categories: { include: { category: true } },
        reviews: { select: { rating: true } },
      },
    });

    return providers.map(p => {
      const avgRating = p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0;
      return { ...p, rating: avgRating };
    });
  }

  async create(userId: string, data: {
    bio?: string;
    skills?: string[];
    basePrice?: number;
    address?: string;
    area?: string;
    latitude?: number;
    longitude?: number;
  }) {
    return this.prisma.provider.create({
      data: {
        userId,
        bio: data.bio,
        skills: JSON.stringify(data.skills || []),
        basePrice: data.basePrice || 300,
        address: data.address,
        area: data.area,
        latitude: data.latitude,
        longitude: data.longitude,
        status: 'OFFLINE',
        isApproved: false,
      },
      include: { user: true },
    });
  }

  async updateStatus(providerId: string, status: 'AVAILABLE' | 'BUSY' | 'OFFLINE') {
    return this.prisma.provider.update({
      where: { id: providerId },
      data: { status },
    });
  }

  async updateLocation(providerId: string, latitude: number, longitude: number) {
    return this.prisma.provider.update({
      where: { id: providerId },
      data: { latitude, longitude },
    });
  }

  async getEarnings(providerId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        status: 'COMPLETED',
      },
      select: { finalPrice: true },
    });

    return {
      total: bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0),
      count: bookings.length,
    };
  }
}