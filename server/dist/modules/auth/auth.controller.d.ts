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
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
            avatar: any;
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
        id: any;
        name: any;
        email: any;
        phone: any;
        role: any;
        avatar: any;
        provider: any;
    }>;
}
