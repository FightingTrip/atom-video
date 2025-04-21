import { useAuthStore } from '@/stores/auth';
import { env } from '@/utils/env';

// OAuth提供商
export type OAuthProvider = 'google' | 'github';

// OAuth服务
export class OAuthService {
  // 获取OAuth登录URL
  public static getOAuthUrl(provider: OAuthProvider): string {
    // 生产环境中，这些URL应该从后端API获取
    const redirectUri = encodeURIComponent(`${window.location.origin}/oauth/callback/${provider}`);

    if (provider === 'google') {
      // 使用环境变量中的client_id
      const clientId = env.oauth.googleClientId || 'your-google-client-id';
      const scope = encodeURIComponent('profile email');
      return `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    } else if (provider === 'github') {
      // 使用环境变量中的client_id
      const clientId = env.oauth.githubClientId || 'your-github-client-id';
      const scope = encodeURIComponent('user:email');
      return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    }

    throw new Error(`不支持的OAuth提供商: ${provider}`);
  }

  // 处理OAuth回调
  public static async handleOAuthCallback(provider: OAuthProvider, code: string): Promise<boolean> {
    // 在实际应用中，这里应该调用后端API来处理OAuth验证
    // 后端会用code换取token，然后获取用户信息
    try {
      // API调用示例 (实际项目中使用)
      // const response = await fetch(`${env.apiUrl}/auth/${provider}/callback`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ code }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || '登录失败');

      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟成功登录
      const authStore = useAuthStore();

      if (provider === 'google') {
        await authStore.setAuth({
          token: 'mock-google-token',
          user: {
            id: 'g-123',
            username: 'googleuser',
            email: 'user@gmail.com',
            avatar: 'https://i.pravatar.cc/150?img=4',
            isVerified: true,
            nickname: 'Google User',
            bio: '',
            verified: true,
            subscribers: 0,
            subscribing: 0,
            totalViews: 0,
            joinedAt: new Date().toISOString(),
          },
        });
      } else if (provider === 'github') {
        await authStore.setAuth({
          token: 'mock-github-token',
          user: {
            id: 'gh-456',
            username: 'githubuser',
            email: 'user@github.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            isVerified: true,
            nickname: 'GitHub User',
            bio: '',
            verified: true,
            subscribers: 0,
            subscribing: 0,
            totalViews: 0,
            joinedAt: new Date().toISOString(),
          },
        });
      }

      return true;
    } catch (error) {
      console.error('OAuth callback error:', error);
      return false;
    }
  }

  // 初始化OAuth登录
  public static initiateOAuth(provider: OAuthProvider): void {
    const url = this.getOAuthUrl(provider);
    window.location.href = url;
  }
}
