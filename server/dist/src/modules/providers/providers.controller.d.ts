import { ProvidersService } from './providers.service';
export declare class ProvidersController {
    private providersService;
    constructor(providersService: ProvidersService);
    findNearby(latitude: string, longitude: string, radius?: string): Promise<{
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
    findByCategory(categoryId: string, latitude?: string, longitude?: string): Promise<{
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
    create(body: {
        userId: string;
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
    updateStatus(id: string, body: {
        status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    }): Promise<{
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
    updateLocation(id: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<{
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
    getEarnings(id: string): Promise<{
        total: number;
        count: number;
    }>;
}
