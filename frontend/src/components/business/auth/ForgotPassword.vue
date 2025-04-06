/**
* @file ForgotPassword.vue
* @description 忘记密码页面组件，用于用户找回密码
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 密码找回：支持通过邮箱找回密码
* - 表单验证：邮箱格式验证
* - 状态提示：显示发送成功/失败状态
* - 自动跳转：发送成功后自动跳转到登录页
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
  <div class="forgot-password">
    <div class="forgot-password-container">
      <div>
        <h2 class="forgot-password-title">
          忘记密码
        </h2>
        <p class="forgot-password-desc">
          请输入您的邮箱地址，我们将发送重置密码的链接
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

      <form class="forgot-password-form" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">邮箱地址</label>
          <input id="email" v-model="email" name="email" type="email" required class="auth-input" placeholder="邮箱地址"
            :class="{ 'input-error': emailError }" />
          <p v-if="emailError" class="error-text">{{ emailError }}</p>
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="submit-button" :class="{ 'button-disabled': isLoading }">
            {{ isLoading ? '发送中...' : '发送重置链接' }}
          </button>
        </div>
      </form>

      <div class="forgot-password-footer">
        <p class="forgot-password-text">
          想起密码了？
          <router-link to="/auth/login" class="forgot-password-link">
            返回登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/utils/api';

  const router = useRouter();

  const email = ref('');
  const isLoading = ref(false);
  const error = ref('');
  const success = ref('');
  const emailError = ref('');

  const validateForm = () => {
    let isValid = true;
    emailError.value = '';

    if (!email.value) {
      emailError.value = '请输入邮箱地址';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      emailError.value = '请输入有效的邮箱地址';
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    error.value = '';
    success.value = '';

    try {
      await api.post('/auth/forgot-password', { email: email.value });
      success.value = '重置密码的链接已发送到您的邮箱，请查收';
    } catch (err: any) {
      error.value = err.response?.data?.message || '发送失败，请重试';
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style scoped>
  .forgot-password {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-bg);
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .forgot-password-container {
    max-width: 28rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .forgot-password-title {
    margin-top: var(--spacing-md);
    text-align: center;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
  }

  .forgot-password-desc {
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

  .forgot-password-form {
    margin-top: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .auth-input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    transition: all var(--transition-normal);
  }

  .auth-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  }

  .input-error {
    border-color: var(--error-color);
  }

  .error-text {
    margin-top: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--error-color);
  }

  .submit-button {
    width: 100%;
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

  .submit-button:hover:not(.button-disabled) {
    background-color: var(--primary-color-dark);
  }

  .button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .forgot-password-footer {
    text-align: center;
  }

  .forgot-password-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .forgot-password-link {
    font-weight: 500;
    color: var(--primary-color);
    transition: color var(--transition-normal);
  }

  .forgot-password-link:hover {
    color: var(--primary-color-dark);
  }
</style>