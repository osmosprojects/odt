import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/migrations/user.entity';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtPayload } from '../../modules/auth/jwt.strategy';
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: Repository<UserEntity>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: JwtPayload;
    }>;
    private verifyPassword;
    generateTokens(user: UserEntity): Promise<{
        accessToken: string;
        refreshToken: string;
        user: JwtPayload;
    }>;
    getProfile(userId: number): Promise<UserEntity | null>;
    logout(userId: number): Promise<{
        message: string;
    }>;
    sendPassword(email: string): Promise<{
        message: string;
    }>;
    refreshTokens(userId: number, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: JwtPayload;
    }>;
}
