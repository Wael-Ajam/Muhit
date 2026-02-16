import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
interface AuthenticatedRequest {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, ip: string, userAgent: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            avatar: string | null;
        };
    }>;
    refresh(refreshDto: RefreshDto): Promise<{
        accessToken: string;
    }>;
    logout(refreshDto: RefreshDto): Promise<{
        message: string;
    }>;
    getMe(req: AuthenticatedRequest): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        lastLogin: Date | null;
        createdAt: Date;
    }>;
    changePassword(req: AuthenticatedRequest, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
export {};
