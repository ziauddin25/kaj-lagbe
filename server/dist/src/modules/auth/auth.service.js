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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
        this.otpStore = new Map();
    }
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }
    async sendOTP(phone) {
        const normalizedPhone = this.normalizePhone(phone);
        const existingUser = await this.prisma.user.findUnique({
            where: { phone: normalizedPhone },
        });
        if (!existingUser) {
            throw new Error('User not found. Please sign up first.');
        }
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStore.set(normalizedPhone, { otp, expiresAt });
        console.log(`OTP for ${normalizedPhone}: ${otp}`);
        return { message: 'OTP sent successfully' };
    }
    async verifyOTP(phone, otp) {
        const normalizedPhone = this.normalizePhone(phone);
        const stored = this.otpStore.get(normalizedPhone);
        if (!stored) {
            throw new Error('OTP expired or not requested');
        }
        if (new Date() > stored.expiresAt) {
            this.otpStore.delete(normalizedPhone);
            throw new Error('OTP expired');
        }
        if (stored.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        this.otpStore.delete(normalizedPhone);
        const user = await this.prisma.user.findUnique({
            where: { phone: normalizedPhone },
            include: { provider: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const token = this.generateToken(user.id);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
        };
    }
    async register(data) {
        const normalizedPhone = this.normalizePhone(data.phone);
        const existing = await this.prisma.user.findUnique({
            where: { phone: normalizedPhone },
        });
        if (existing) {
            throw new Error('User already exists');
        }
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email || null,
                phone: normalizedPhone,
                role: data.role === 'PROVIDER' ? 'PROVIDER' : 'USER',
            },
        });
        if (data.role === 'PROVIDER') {
            await this.prisma.provider.create({
                data: {
                    userId: user.id,
                    status: 'AVAILABLE',
                    isApproved: true,
                    latitude: 23.8103,
                    longitude: 90.4125,
                    area: 'ঢাকা',
                    basePrice: 300,
                },
            });
        }
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStore.set(normalizedPhone, { otp, expiresAt });
        console.log(`OTP for ${normalizedPhone}: ${otp}`);
        return { message: 'Registration successful. Please verify OTP.' };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { provider: true },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            provider: user.provider,
        };
    }
    normalizePhone(phone) {
        let normalized = phone.replace(/\D/g, '');
        if (!normalized.startsWith('880')) {
            if (normalized.startsWith('0')) {
                normalized = '88' + normalized;
            }
            else {
                normalized = '880' + normalized;
            }
        }
        return normalized;
    }
    generateToken(userId) {
        return crypto.randomBytes(32).toString('hex') + '.' + userId;
    }
    async validateToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 2)
                return null;
            const userId = parts[1];
            return this.getUserById(userId);
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map