import { PrismaService } from '../prisma/prisma.service';
export declare class ProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    findNearby(latitude: number, longitude: number, radiusKm?: number): Promise<{
        userName: string;
        userAvatar: string;
        distance: number;
        user: {
            name: string;
            avatar: string;
        };
        id: string;
        basePrice: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        skills: string;
        address: string | null;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        isApproved: boolean;
        rating: number;
        totalJobs: number;
    }[]>;
    findByCategory(categoryId: string, latitude?: number, longitude?: number): Promise<{
        rating: number;
        reviews: {
            rating: number;
        }[];
        user: {
            id: string;
            name: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            role: string;
            avatar: string | null;
            updatedAt: Date;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                nameBn: string;
                basePrice: number;
                icon: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            providerId: string;
            categoryId: string;
        })[];
        id: string;
        basePrice: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        skills: string;
        address: string | null;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        isApproved: boolean;
        totalJobs: number;
    }[]>;
    create(userId: string, data: {
        bio?: string;
        skills?: string[];
        basePrice?: number;
        address?: string;
        area?: string;
        latitude?: number;
        longitude?: number;
    }): Promise<{
        user: {
            id: string;
            name: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            role: string;
            avatar: string | null;
            updatedAt: Date;
        };
    } & {
        id: string;
        basePrice: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        skills: string;
        address: string | null;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        isApproved: boolean;
        rating: number;
        totalJobs: number;
    }>;
    updateStatus(providerId: string, status: 'AVAILABLE' | 'BUSY' | 'OFFLINE'): Promise<{
        id: string;
        basePrice: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        skills: string;
        address: string | null;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        isApproved: boolean;
        rating: number;
        totalJobs: number;
    }>;
    updateLocation(providerId: string, latitude: number, longitude: number): Promise<{
        id: string;
        basePrice: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
        skills: string;
        address: string | null;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        isApproved: boolean;
        rating: number;
        totalJobs: number;
    }>;
    getEarnings(providerId: string): Promise<{
        total: number;
        count: number;
    }>;
}
