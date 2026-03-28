import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        bookingId: string;
        userId: string;
        providerId: string;
        rating: number;
        comment?: string;
    }): Promise<any>;
    findByProvider(providerId: string): Promise<any>;
    findByUser(userId: string): Promise<any>;
    getProviderRating(providerId: string): Promise<{
        average: number;
        count: any;
    }>;
}
