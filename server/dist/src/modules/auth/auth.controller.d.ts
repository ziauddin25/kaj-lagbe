import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        phone: string;
    }): Promise<{
        message: string;
    }>;
    verify(body: {
        phone: string;
        otp: string;
    }): Promise<{
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
    register(body: {
        name: string;
        email?: string;
        phone: string;
        role?: string;
    }): Promise<{
        message: string;
    }>;
    resend(body: {
        phone: string;
    }): Promise<{
        message: string;
    }>;
    me(auth: string): Promise<{
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
