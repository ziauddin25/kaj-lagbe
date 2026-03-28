import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        categoryId: string;
        description?: string;
        address: string;
        latitude?: number;
        longitude?: number;
        area?: string;
        estimatedPrice: number;
        scheduledTime?: Date;
    }): Promise<any>;
    findByUser(userId: string): Promise<any>;
    findPending(): Promise<any>;
    findByProvider(providerId: string): Promise<any>;
    findById(id: string): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
    assignProvider(bookingId: string, providerId: string): Promise<any>;
    complete(bookingId: string, finalPrice: number): Promise<any>;
    cancel(bookingId: string): Promise<any>;
}
