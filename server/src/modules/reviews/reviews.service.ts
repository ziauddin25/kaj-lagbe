import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    bookingId: string;
    userId: string;
    providerId: string;
    rating: number;
    comment?: string;
  }) {
    return this.prisma.review.create({
      data,
      include: {
        user: true,
        provider: { include: { user: true } },
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.review.findMany({
      where: { providerId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { provider: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProviderRating(providerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { providerId },
      select: { rating: true },
    });

    if (reviews.length === 0) return { average: 0, count: 0 };

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      average: total / reviews.length,
      count: reviews.length,
    };
  }
}