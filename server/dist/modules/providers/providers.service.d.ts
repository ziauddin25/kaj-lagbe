import { PrismaService } from '../prisma/prisma.service';
export declare class ProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    findNearby(latitude: number, longitude: number, radiusKm?: number): Promise<any>;
    findByCategory(categoryId: string, latitude?: number, longitude?: number): Promise<any>;
    create(userId: string, data: {
        bio?: string;
        skills?: string[];
        basePrice?: number;
        address?: string;
        area?: string;
        latitude?: number;
        longitude?: number;
    }): Promise<any>;
    updateStatus(providerId: string, status: 'AVAILABLE' | 'BUSY' | 'OFFLINE'): Promise<any>;
    updateLocation(providerId: string, latitude: number, longitude: number): Promise<any>;
    getEarnings(providerId: string): Promise<{
        total: any;
        count: any;
    }>;
}
