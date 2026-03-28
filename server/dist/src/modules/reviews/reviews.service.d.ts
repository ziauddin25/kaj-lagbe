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
    }): Promise<{
        provider: {
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
        };
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
        createdAt: Date;
        userId: string;
        rating: number;
        bookingId: string;
        providerId: string;
        comment: string | null;
    }>;
    findByProvider(providerId: string): Promise<({
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
        createdAt: Date;
        userId: string;
        rating: number;
        bookingId: string;
        providerId: string;
        comment: string | null;
    })[]>;
    findByUser(userId: string): Promise<({
        provider: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        bookingId: string;
        providerId: string;
        comment: string | null;
    })[]>;
    getProviderRating(providerId: string): Promise<{
        average: number;
        count: number;
    }>;
}
