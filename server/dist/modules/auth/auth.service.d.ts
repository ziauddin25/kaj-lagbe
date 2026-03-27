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
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
            avatar: any;
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
        id: any;
        name: any;
        email: any;
        phone: any;
        role: any;
        avatar: any;
        provider: any;
    }>;
    private normalizePhone;
    private generateToken;
    validateToken(token: string): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        role: any;
        avatar: any;
        provider: any;
    }>;
}
