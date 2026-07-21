import { AuthService, LoginDto } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        userId: any;
        loginId: any;
        userCode: any;
        email: any;
        role: any;
        stream: any;
        channel: any;
    }>;
}
