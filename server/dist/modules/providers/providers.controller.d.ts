import { ProvidersService } from './providers.service';
export declare class ProvidersController {
    private providersService;
    constructor(providersService: ProvidersService);
    findNearby(latitude: string, longitude: string, radius?: string): Promise<any>;
    findByCategory(categoryId: string, latitude?: string, longitude?: string): Promise<any>;
    create(body: {
        userId: string;
        bio?: string;
        skills?: string[];
        basePrice?: number;
        address?: string;
        area?: string;
        latitude?: number;
        longitude?: number;
    }): Promise<any>;
    updateStatus(id: string, body: {
        status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    }): Promise<any>;
    updateLocation(id: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<any>;
    getEarnings(id: string): Promise<{
        total: any;
        count: any;
    }>;
}
