import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: string;
        name: string;
        nameBn: string;
        basePrice: number;
        icon: string | null;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        providers: ({
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
            providerId: string;
            categoryId: string;
        })[];
    } & {
        id: string;
        name: string;
        nameBn: string;
        basePrice: number;
        icon: string | null;
        createdAt: Date;
    }>;
    seed(): Promise<{
        message: string;
    }>;
}
