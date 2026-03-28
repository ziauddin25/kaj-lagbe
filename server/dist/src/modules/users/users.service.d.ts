import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        provider: {
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
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        role: string;
        avatar: string | null;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        avatar?: string;
    }): Promise<{
        provider: {
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
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        role: string;
        avatar: string | null;
        updatedAt: Date;
    }>;
}
