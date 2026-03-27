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
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProvidersService = class ProvidersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findNearby(latitude, longitude, radiusKm = 10) {
        return this.prisma.$queryRaw `
      SELECT 
        p.*,
        u.name as "userName",
        u.avatar as "userAvatar",
        (
          6371 * acos(
            cos(radians(${latitude})) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians(p.latitude))
          )
        ) AS distance
      FROM "Provider" p
      JOIN "User" u ON p."userId" = u.id
      WHERE p.status = 'AVAILABLE'
        AND p."isApproved" = true
        AND p.latitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT 20
    `;
    }
    async findByCategory(categoryId, latitude, longitude) {
        const where = {
            categories: { some: { categoryId } },
            status: 'AVAILABLE',
            isApproved: true,
        };
        const providers = await this.prisma.provider.findMany({
            where,
            include: {
                user: true,
                categories: { include: { category: true } },
                reviews: { select: { rating: true } },
            },
        });
        return providers.map(p => {
            const avgRating = p.reviews.length > 0
                ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
                : 0;
            return { ...p, rating: avgRating };
        });
    }
    async create(userId, data) {
        return this.prisma.provider.create({
            data: {
                userId,
                bio: data.bio,
                skills: data.skills || [],
                basePrice: data.basePrice || 300,
                address: data.address,
                area: data.area,
                latitude: data.latitude,
                longitude: data.longitude,
                status: 'OFFLINE',
                isApproved: false,
            },
            include: { user: true },
        });
    }
    async updateStatus(providerId, status) {
        return this.prisma.provider.update({
            where: { id: providerId },
            data: { status },
        });
    }
    async updateLocation(providerId, latitude, longitude) {
        return this.prisma.provider.update({
            where: { id: providerId },
            data: { latitude, longitude },
        });
    }
    async getEarnings(providerId) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                providerId,
                status: 'COMPLETED',
            },
            select: { finalPrice: true },
        });
        return {
            total: bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0),
            count: bookings.length,
        };
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map