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
    }): Promise<{
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
        };
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
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    }>;
    findByUser(userId: string): Promise<({
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
        };
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
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    })[]>;
    findPending(): Promise<({
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
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
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    })[]>;
    findByProvider(providerId: string): Promise<({
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
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
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    })[]>;
    findById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
        };
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
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            bookingId: string;
            providerId: string;
            comment: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
        };
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
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    }>;
    assignProvider(id: string, body: {
        providerId: string;
    }): Promise<{
        category: {
            id: string;
            name: string;
            nameBn: string;
            basePrice: number;
            icon: string | null;
            createdAt: Date;
        };
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
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    }>;
    complete(id: string, body: {
        finalPrice: number;
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
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    }>;
    cancel(id: string): Promise<{
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        userId: string;
        address: string;
        area: string | null;
        latitude: number | null;
        longitude: number | null;
        status: string;
        description: string | null;
        providerId: string | null;
        categoryId: string;
        estimatedPrice: number;
        finalPrice: number | null;
        scheduledTime: Date | null;
        startTime: Date | null;
        endTime: Date | null;
    }>;
}
