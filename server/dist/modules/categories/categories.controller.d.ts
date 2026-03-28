import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<any>;
    findById(id: string): Promise<any>;
    seed(): Promise<{
        message: string;
    }>;
}
