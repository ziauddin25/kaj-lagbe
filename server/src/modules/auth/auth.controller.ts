import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  async login(@Body() body: { phone: string }) {
    return this.authService.sendOTP(body.phone);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP and login' })
  async verify(@Body() body: { phone: string; otp: string }) {
    return this.authService.verifyOTP(body.phone, body.otp);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() body: { name: string; email?: string; phone: string; role?: string }) {
    return this.authService.register(body);
  }

  @Post('resend')
  @ApiOperation({ summary: 'Resend OTP' })
  async resend(@Body() body: { phone: string }) {
    return this.authService.sendOTP(body.phone);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async me(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }
    
    const token = auth.replace('Bearer ', '');
    const user = await this.authService.validateToken(token);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user;
  }
}