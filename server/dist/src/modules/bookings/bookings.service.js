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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId },
        });
        return this.prisma.booking.create({
            data: {
                userId: data.userId,
                categoryId: data.categoryId,
                description: data.description,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                area: data.area,
                estimatedPrice: data.estimatedPrice,
                scheduledTime: data.scheduledTime,
                status: 'PENDING',
            },
            include: {
                category: true,
                user: true,
                provider: { include: { user: true } },
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                category: true,
                provider: { include: { user: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPending() {
        return this.prisma.booking.findMany({
            where: {
                status: 'PENDING',
                providerId: null,
            },
            include: {
                category: true,
                user: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findByProvider(providerId) {
        return this.prisma.booking.findMany({
            where: { providerId },
            include: {
                category: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.booking.findUnique({
            where: { id },
            include: {
                category: true,
                user: true,
                provider: { include: { user: true } },
                review: true,
            },
        });
    }
    async updateStatus(id, status) {
        const updateData = { status };
        if (status === 'IN_PROGRESS') {
            updateData.startTime = new Date();
        }
        else if (status === 'COMPLETED') {
            updateData.endTime = new Date();
        }
        return this.prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                user: true,
                provider: { include: { user: true } },
            },
        });
    }
    async assignProvider(bookingId, providerId) {
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                providerId,
                status: 'ACCEPTED',
            },
            include: {
                category: true,
                user: true,
                provider: { include: { user: true } },
            },
        });
    }
    async complete(bookingId, finalPrice) {
        const booking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'COMPLETED',
                finalPrice,
                endTime: new Date(),
            },
            include: { provider: true },
        });
        if (booking.provider) {
            await this.prisma.provider.update({
                where: { id: booking.providerId },
                data: { totalJobs: { increment: 1 } },
            });
        }
        return booking;
    }
    async cancel(bookingId) {
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map