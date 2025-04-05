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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="text-3xl font-extrabold">{{ t('auth.processing') }}</h2>
        <div class="mt-4">
          <span class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></span>
        </div>
        <p class="mt-4 text-gray-600">{{ t('auth.oauthCallbackProcessing') }}</p>
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