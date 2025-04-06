export type OAuthProvider = 'google' | 'github';
export declare class OAuthService {
    static getOAuthUrl(provider: OAuthProvider): string;
    static handleOAuthCallback(provider: OAuthProvider, code: string): Promise<boolean>;
    static initiateOAuth(provider: OAuthProvider): void;
}
