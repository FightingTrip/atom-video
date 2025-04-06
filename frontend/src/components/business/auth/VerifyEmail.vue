/**
* @file VerifyEmail.vue
* @description 邮箱验证页面组件，用于验证用户邮箱
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 邮箱验证：支持通过链接验证邮箱
* - 重新发送：支持重新发送验证邮件
* - 状态提示：显示验证成功/失败状态
* - 自动跳转：验证成功后自动跳转到登录页
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useAuthStore: 认证状态管理
* - api: API 请求工具
* - vue-router: 路由管理
*/

<template>
  <div class="verify-email">
    <div class="verify-email-container">
      <div>
        <h2 class="verify-email-title">
          邮箱验证
        </h2>
        <p class="verify-email-desc">
          请验证您的邮箱地址
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

      <div class="verify-email-content">
        <p class="verify-email-text">
          我们已经向您的邮箱发送了一封验证邮件，请查收并点击邮件中的验证链接。
        </p>
        <p class="verify-email-text">
          如果您没有收到邮件，请检查垃圾邮件文件夹，或者点击下方按钮重新发送。
        </p>
      </div>

      <div class="verify-email-actions">
        <button type="button" :disabled="isLoading" class="resend-button" :class="{ 'button-disabled': isLoading }"
          @click="handleResend">
          {{ isLoading ? '发送中...' : '重新发送验证邮件' }}
        </button>
      </div>

      <div class="verify-email-footer">
        <p class="verify-email-text">
          验证完成后，
          <router-link to="/auth/login" class="verify-email-link">
            返回登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import api from '@/utils/api';

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();

  const isLoading = ref(false);
  const error = ref('');
  const success = ref('');

  // 验证邮箱
  const verifyEmail = async (token: string) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      success.value = '邮箱验证成功！';
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      error.value = err.response?.data?.message || '验证失败，请重试';
    }
  };

  // 重新发送验证邮件
  const resendVerificationEmail = async () => {
    isLoading.value = true;
    error.value = '';
    success.value = '';

    try {
      await api.post('/auth/resend-verification');
      success.value = '验证邮件已重新发送，请查收';
    } catch (err: any) {
      error.value = err.response?.data?.message || '发送失败，请重试';
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    const token = route.query.token as string;
    if (token) {
      verifyEmail(token);
    }
  });
</script>

<style scoped>
  .verify-email {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-bg);
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .verify-email-container {
    max-width: 28rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .verify-email-title {
    margin-top: var(--spacing-md);
    text-align: center;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
  }

  .verify-email-desc {
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

  .verify-email-content {
    text-align: center;
  }

  .verify-email-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .verify-email-actions {
    display: flex;
    justify-content: center;
  }

  .resend-button {
    display: flex;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-inverse);
    background-color: var(--primary-color);
    transition: background-color var(--transition-normal);
  }

  .resend-button:hover:not(.button-disabled) {
    background-color: var(--primary-color-dark);
  }

  .button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .verify-email-footer {
    text-align: center;
  }

  .verify-email-link {
    font-weight: 500;
    color: var(--primary-color);
    transition: color var(--transition-normal);
  }

  .verify-email-link:hover {
    color: var(--primary-color-dark);
  }
</style>