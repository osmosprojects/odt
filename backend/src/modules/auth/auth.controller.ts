import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService, LoginDto } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Return JWT access token & user profile' })
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @ApiOperation({ summary: 'Logout Session' })
  @Post('logout')
  async logout() {
    return { message: 'Session logged out successfully' };
  }

  @ApiOperation({ summary: 'Get Active User Profile' })
  @Get('profile')
  async getProfile(@Req() req: any) {
    // If auth guard applied
    const dummyUser = {
      sub: 101,
      loginId: 'john_doe',
      userCode: 'EMP1001',
      email: 'john.doe@castrol-odt.com',
      role: 'Sales Representative',
      stream: 'B2B',
      channel: 'HD',
    };
    return this.authService.getProfile(dummyUser);
  }
}
