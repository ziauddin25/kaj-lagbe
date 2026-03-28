"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.category.findUnique({
            where: { id },
            include: {
                providers: {
                    include: {
                        provider: {
                            include: { user: true },
                        },
                    },
                },
            },
        });
    }
    async create(data) {
        return this.prisma.category.create({ data });
    }
    async seedDefaultCategories() {
        const categories = [
            { name: 'Electrician', nameBn: 'ইলেকট্রিশিয়ান', icon: '⚡', basePrice: 300, estimatedTime: 60, description: 'Electrical repairs and installations', descriptionBn: 'বৈদ্যুতিক মেরামত ও ইনস্টলেশন' },
            { name: 'Plumber', nameBn: 'প্লাম্বার', icon: '💧', basePrice: 250, estimatedTime: 45, description: 'Plumbing repairs and installations', descriptionBn: 'প্লাম্বিং মেরামত ও ইনস্টলেশন' },
            { name: 'AC Repair', nameBn: 'এসি মেরামত', icon: '❄️', basePrice: 500, estimatedTime: 90, description: 'Air conditioner repair and service', descriptionBn: 'এয়ার কন্ডিশনার মেরামত ও সার্ভিস' },
            { name: 'Cleaner', nameBn: 'ক্লিনার', icon: '✨', basePrice: 200, estimatedTime: 120, description: 'Home and office cleaning', descriptionBn: 'বাড়ি ও অফিস পরিষ্কার' },
            { name: 'Tutor', nameBn: 'টিউটর', icon: '📚', basePrice: 400, estimatedTime: 60, description: 'Home tutoring services', descriptionBn: 'হোম টিউশন সার্ভিস' },
            { name: 'Mechanic', nameBn: 'মেকানিক', icon: '🔧', basePrice: 350, estimatedTime: 60, description: 'Vehicle repair and maintenance', descriptionBn: 'গাড়ি মেরামত ও রক্ষণাবেক্ষণ' },
        ];
        for (const cat of categories) {
            const existing = await this.prisma.category.findFirst({
                where: { name: cat.name },
            });
            if (!existing) {
                await this.prisma.category.create({ data: cat });
            }
        }
        return { message: 'Categories seeded successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map