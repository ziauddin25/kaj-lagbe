import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private otpStore;
    constructor(prisma: PrismaService);
    generateOTP(): string;
    sendOTP(phone: string): Promise<{
        message: string;
    }>;
    verifyOTP(phone: string, otp: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: string;
            avatar: string;
        };
    }>;
    register(data: {
        name: string;
        email?: string;
        phone: string;
        role?: string;
    }): Promise<{
        message: string;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
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
    }>;
    private normalizePhone;
    private generateToken;
    validateToken(token: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
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
    }>;
}
