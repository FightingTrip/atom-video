/**
* @file OAuthCallback.vue
* @description OAuth 回调页面组件，用于处理第三方登录回调
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - OAuth 回调：支持处理第三方登录回调
* - 状态提示：显示登录成功/失败状态
* - 自动跳转：登录成功后自动跳转到首页
* - 错误处理：处理各种 OAuth 错误情况
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useAuthStore: 认证状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/

<template>
  <div class="oauth-callback">
    <div class="oauth-callback-container">
      <div>
        <h2 class="oauth-callback-title">
          第三方登录
        </h2>
        <p class="oauth-callback-desc">
          正在处理登录请求，请稍候...
        </p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-alert">
        <div class="error-alert-content">
          <div class="error-alert-icon">
            <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="error-alert-text">
            <p class="error-message">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="success-alert">
        <div class="success-alert-content">
          <div class="success-alert-icon">
            <svg class="success-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="success-alert-text">
            <p class="success-message">{{ success }}</p>
          </div>
        </div>
      </div>

      <!-- 加载动画 -->
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">正在处理登录请求...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { OAuthService } from '@/services/oauth';
  import { useMessage } from 'naive-ui';

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const message = useMessage();

  onMounted(async () => {
    try {
      const provider = route.params.provider as 'google' | 'github';
      const code = route.query.code as string;

      if (!provider || !code) {
        throw new Error('Missing provider or code');
      }

      const success = await OAuthService.handleOAuthCallback(provider, code);

      if (success) {
        message.success(t('auth.signInSuccess'));
        router.push('/');
      } else {
        throw new Error('OAuth login failed');
      }
    } catch (error) {
      console.error('OAuth error:', error);
      message.error(t('auth.oauthError'));
      router.push('/auth');
    }
  });
</script>

<style scoped>
  .oauth-callback {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-bg);
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .oauth-callback-container {
    max-width: 28rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .oauth-callback-title {
    margin-top: var(--spacing-md);
    text-align: center;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
  }

  .oauth-callback-desc {
    margin-top: var(--spacing-sm);
    text-align: center;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .error-alert,
  .success-alert {
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }

  .error-alert {
    background-color: var(--error-bg);
  }

  .success-alert {
    background-color: var(--success-bg);
  }

  .error-alert-content,
  .success-alert-content {
    display: flex;
  }

  .error-alert-icon,
  .success-alert-icon {
    flex-shrink: 0;
  }

  .error-icon,
  .success-icon {
    height: 1.25rem;
    width: 1.25rem;
  }

  .error-icon {
    color: var(--error-color);
  }

  .success-icon {
    color: var(--success-color);
  }

  .error-alert-text,
  .success-alert-text {
    margin-left: var(--spacing-sm);
  }

  .error-message,
  .success-message {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .error-message {
    color: var(--error-color);
  }

  .success-message {
    color: var(--success-color);
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid var(--border-light);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }
</style>