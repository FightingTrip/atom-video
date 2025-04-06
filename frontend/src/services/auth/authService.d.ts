import { LoginRequest, RegisterRequest, AuthResponse, ResetPasswordRequest, ChangePasswordRequest } from './types';
export declare const authService: {
    login(data: LoginRequest): Promise<AuthResponse>;
    register(data: RegisterRequest): Promise<AuthResponse>;
    logout(): Promise<void>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(data: ResetPasswordRequest): Promise<void>;
    changePassword(data: ChangePasswordRequest): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    getSession(): Promise<AuthResponse>;
};
