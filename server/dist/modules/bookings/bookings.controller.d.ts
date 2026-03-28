import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(body: {
        userId: string;
        categoryId: string;
        description?: string;
        address: string;
        latitude?: number;
        longitude?: number;
        area?: string;
        estimatedPrice: number;
        scheduledTime?: Date;
    }): Promise<any>;
    findByUser(userId: string): Promise<any>;
    findPending(): Promise<any>;
    findByProvider(providerId: string): Promise<any>;
    findById(id: string): Promise<any>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<any>;
    assignProvider(id: string, body: {
        providerId: string;
    }): Promise<any>;
    complete(id: string, body: {
        finalPrice: number;
    }): Promise<any>;
    cancel(id: string): Promise<any>;
}
