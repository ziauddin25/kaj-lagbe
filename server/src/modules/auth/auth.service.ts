import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private otpStore: Map<string, { otp: string; expiresAt: Date }> = new Map();

  constructor(private prisma: PrismaService) {}

  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOTP(phone: string) {
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

  async verifyOTP(phone: string, otp: string) {
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

  async register(data: { name: string; email?: string; phone: string; role?: string }) {
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
          status: 'OFFLINE',
          isApproved: true,
        },
      });
    }
    
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    this.otpStore.set(normalizedPhone, { otp, expiresAt });
    
    console.log(`OTP for ${normalizedPhone}: ${otp}`);
    
    return { message: 'Registration successful. Please verify OTP.' };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { provider: true },
    });
    
    if (!user) return null;
    
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

  private normalizePhone(phone: string): string {
    let normalized = phone.replace(/\D/g, '');
    if (!normalized.startsWith('880')) {
      if (normalized.startsWith('0')) {
        normalized = '88' + normalized;
      } else {
        normalized = '880' + normalized;
      }
    }
    return normalized;
  }

  private generateToken(userId: string): string {
    return crypto.randomBytes(32).toString('hex') + '.' + userId;
  }

  async validateToken(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return null;
      
      const userId = parts[1];
      return this.getUserById(userId);
    } catch {
      return null;
    }
  }
}