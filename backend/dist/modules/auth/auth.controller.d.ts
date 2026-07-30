import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendPasswordDto } from './dto/send-password.dto';
import type { JwtPayload } from '../auth/jwt.strategy';
import { PermissionsService } from './permissions.service';
import { Role } from '../../enums/roles.enum';
export declare class AuthController {
    private authService;
    private permissions;
    constructor(authService: AuthService, permissions: PermissionsService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: JwtPayload;
    }>;
    refresh(user: JwtPayload & {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: JwtPayload;
    }>;
    logout(user: JwtPayload): Promise<{
        message: string;
    }>;
    getProfile(user: JwtPayload): Promise<import("../../database/migrations/user.entity").UserEntity | null>;
    sendPassword(dto: SendPasswordDto): Promise<{
        message: string;
    }>;
    getFormFields(req: Request): {
        role: Role;
        visibleFields: string[];
    };
}
