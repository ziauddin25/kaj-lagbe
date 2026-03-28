import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findById(id: string): Promise<any>;
    create(data: {
        name: string;
        nameBn: string;
        icon: string;
        basePrice: number;
        estimatedTime: number;
        description?: string;
        descriptionBn?: string;
    }): Promise<any>;
    seedDefaultCategories(): Promise<{
        message: string;
    }>;
}
