import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(body: {
        bookingId: string;
        userId: string;
        providerId: string;
        rating: number;
        comment?: string;
    }): Promise<any>;
    findByProvider(providerId: string): Promise<any>;
    findByUser(userId: string): Promise<any>;
    getProviderRating(providerId: string): Promise<{
        average: number;
        count: any;
    }>;
}
