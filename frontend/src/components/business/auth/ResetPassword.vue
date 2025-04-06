/**
* @file ResetPassword.vue
* @description 重置密码页面组件，用于用户重置密码
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 密码重置：支持通过邮箱重置密码
* - 表单验证：密码强度验证、确认密码匹配
* - 状态提示：显示重置成功/失败状态
* - 自动跳转：重置成功后自动跳转到登录页
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
  <div class="reset-password">
    <div class="reset-password-container">
      <div>
        <h2 class="reset-password-title">
          重置密码
        </h2>
        <p class="reset-password-desc">
          请输入您的新密码
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

      <form class="reset-password-form" @submit.prevent="handleSubmit">
        <!-- 密码 -->
        <div>
          <label for="password" class="form-label">
            新密码 <span class="required-mark">*</span>
          </label>
          <div class="password-input-container">
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required
              class="auth-input" :class="{ 'input-error': passwordError }" placeholder="请输入新密码" />
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
            </button>
          </div>
          <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
        </div>

        <!-- 确认密码 -->
        <div>
          <label for="confirm-password" class="form-label">
            确认密码 <span class="required-mark">*</span>
          </label>
          <div class="password-input-container">
            <input id="confirm-password" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
              required class="auth-input" :class="{ 'input-error': confirmPasswordError }" placeholder="请再次输入新密码" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
              <i :class="['fas', showConfirmPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
            </button>
          </div>
          <p v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</p>
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="submit-button" :class="{ 'button-disabled': isLoading }">
            {{ isLoading ? '重置中...' : '重置密码' }}
          </button>
        </div>
      </form>

      <div class="reset-password-footer">
        <p class="reset-password-text">
          想起密码了？
          <router-link to="/auth/login" class="reset-password-link">
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
  import api from '@/utils/api';

  const route = useRoute();
  const router = useRouter();

  const password = ref('');
  const confirmPassword = ref('');
  const isLoading = ref(false);
  const error = ref('');
  const success = ref('');
  const passwordError = ref('');
  const confirmPasswordError = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  const validateForm = () => {
    let isValid = true;
    passwordError.value = '';
    confirmPasswordError.value = '';

    if (!password.value) {
      passwordError.value = '请输入新密码';
      isValid = false;
    } else if (password.value.length < 6) {
      passwordError.value = '密码长度至少为6位';
      isValid = false;
    }

    if (!confirmPassword.value) {
      confirmPasswordError.value = '请确认新密码';
      isValid = false;
    } else if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = '两次输入的密码不一致';
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
      const token = route.query.token as string;
      await api.post('/auth/reset-password', {
        token,
        password: password.value,
      });
      success.value = '密码重置成功！';
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      error.value = err.response?.data?.message || '重置失败，请重试';
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    const token = route.query.token as string;
    if (!token) {
      router.push('/auth/forgot-password');
    }
  });
</script>

<style scoped>
  .reset-password {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-bg);
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .reset-password-container {
    max-width: 28rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .reset-password-title {
    margin-top: var(--spacing-md);
    text-align: center;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
  }

  .reset-password-desc {
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

  .reset-password-form {
    margin-top: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-label {
    display: block;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .required-mark {
    color: var(--error-color);
  }

  .password-input-container {
    position: relative;
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

  .password-toggle {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    transition: color var(--transition-normal);
  }

  .password-toggle:hover {
    color: var(--text-primary);
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

  .reset-password-footer {
    text-align: center;
  }

  .reset-password-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .reset-password-link {
    font-weight: 500;
    color: var(--primary-color);
    transition: color var(--transition-normal);
  }

  .reset-password-link:hover {
    color: var(--primary-color-dark);
  }
</style>
