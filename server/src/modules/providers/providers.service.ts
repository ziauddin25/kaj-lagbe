import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async findNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    return this.prisma.$queryRaw`
      SELECT 
        p.*,
        u.name as "userName",
        u.avatar as "userAvatar",
        (
          6371 * acos(
            cos(radians(${latitude})) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians(p.latitude))
          )
        ) AS distance
      FROM "Provider" p
      JOIN "User" u ON p."userId" = u.id
      WHERE p.status = 'AVAILABLE'
        AND p."isApproved" = true
        AND p.latitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT 20
    `;
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
        skills: data.skills || [],
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