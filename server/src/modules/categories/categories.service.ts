import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        providers: {
          include: {
            provider: {
              include: { user: true },
            },
          },
        },
      },
    });
  }

  async create(data: {
    name: string;
    nameBn: string;
    icon: string;
    basePrice: number;
    estimatedTime: number;
    description?: string;
    descriptionBn?: string;
  }) {
    return this.prisma.category.create({ data });
  }

  async seedDefaultCategories() {
    const categories = [
      { name: 'Electrician', nameBn: 'ইলেকট্রিশিয়ান', icon: '⚡', basePrice: 300, estimatedTime: 60, description: 'Electrical repairs and installations', descriptionBn: 'বৈদ্যুতিক মেরামত ও ইনস্টলেশন' },
      { name: 'Plumber', nameBn: 'প্লাম্বার', icon: '💧', basePrice: 250, estimatedTime: 45, description: 'Plumbing repairs and installations', descriptionBn: 'প্লাম্বিং মেরামত ও ইনস্টলেশন' },
      { name: 'AC Repair', nameBn: 'এসি মেরামত', icon: '❄️', basePrice: 500, estimatedTime: 90, description: 'Air conditioner repair and service', descriptionBn: 'এয়ার কন্ডিশনার মেরামত ও সার্ভিস' },
      { name: 'Cleaner', nameBn: 'ক্লিনার', icon: '✨', basePrice: 200, estimatedTime: 120, description: 'Home and office cleaning', descriptionBn: 'বাড়ি ও অফিস পরিষ্কার' },
      { name: 'Tutor', nameBn: 'টিউটর', icon: '📚', basePrice: 400, estimatedTime: 60, description: 'Home tutoring services', descriptionBn: 'হোম টিউশন সার্ভিস' },
      { name: 'Mechanic', nameBn: 'মেকানিক', icon: '🔧', basePrice: 350, estimatedTime: 60, description: 'Vehicle repair and maintenance', descriptionBn: 'গাড়ি মেরামত ও রক্ষণাবেক্ষণ' },
    ];

    for (const cat of categories) {
      const existing = await this.prisma.category.findFirst({
        where: { name: cat.name },
      });
      if (!existing) {
        await this.prisma.category.create({ data: cat });
      }
    }

    return { message: 'Categories seeded successfully' };
  }
}