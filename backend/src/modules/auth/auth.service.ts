import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(credentials: LoginDto) {
    const { username, password } = credentials;

    // Demo / Default User validation mapping for migration
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    // Default mock user mapping for system development
    const user = {
      userId: 101,
      loginId: username,
      userCode: 'EMP' + Math.floor(1000 + Math.random() * 9000),
      fullName: username === 'admin' ? 'System Admin' : 'John Doe',
      email: `${username}@castrol-odt.com`,
      role: username === 'admin' ? 'Admin' : 'Sales Representative',
      stream: 'B2B',
      channel: 'HD',
      territoryCode: 'TERR_NORTH_01',
    };

    const payload = {
      sub: user.userId,
      loginId: user.loginId,
      userCode: user.userCode,
      email: user.email,
      role: user.role,
      stream: user.stream,
      channel: user.channel,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.userId,
        name: user.fullName,
        email: user.email,
        role: user.role,
        stream: user.stream,
        channel: user.channel,
      },
    };
  }

  async getProfile(userPayload: any) {
    return {
      userId: userPayload.sub,
      loginId: userPayload.loginId,
      userCode: userPayload.userCode,
      email: userPayload.email,
      role: userPayload.role,
      stream: userPayload.stream,
      channel: userPayload.channel,
    };
  }
}
