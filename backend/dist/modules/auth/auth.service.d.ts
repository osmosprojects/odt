import { JwtService } from '@nestjs/jwt';
export interface LoginDto {
    username: string;
    password: string;
}
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(credentials: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            stream: string;
            channel: string;
        };
    }>;
    getProfile(userPayload: any): Promise<{
        userId: any;
        loginId: any;
        userCode: any;
        email: any;
        role: any;
        stream: any;
        channel: any;
    }>;
}
