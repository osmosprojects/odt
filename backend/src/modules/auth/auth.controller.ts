import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendPasswordDto } from './dto/send-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt.strategy';
import { PermissionsService } from './permissions.service';
import { Role } from '../../enums/roles.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private permissions:PermissionsService
  ) {}

  // POST /auth/login — replaces PHP index.php login section
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with empcode and password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST /auth/refresh — get new access token using refresh token
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(
    @CurrentUser() user: JwtPayload & { refreshToken: string },
  ) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  // POST /auth/logout — replaces PHP session_destroy()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.sub);
  }

  // GET /auth/me — replaces PHP session check at top of every file
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user profile' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  // POST /auth/send-password — replaces PHP send_mail.php
  @Post('send-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password to registered email' })
  sendPassword(@Body() dto: SendPasswordDto) {
    return this.authService.sendPassword(dto.email);
  }

  @Get('permissions/form-fields')
  @UseGuards(JwtAuthGuard) 
  getFormFields(@Req() req: Request) {
    const userRole = (req as any).user?.role as Role;
    return {
      role: userRole,
      visibleFields: this.permissions.getVisibleFields(userRole),
    };
  }

}
