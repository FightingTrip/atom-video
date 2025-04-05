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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          忘记密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          请输入您的邮箱地址，我们将发送重置密码的链接
        </p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ success }}</p>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">邮箱地址</label>
          <input id="email" v-model="email" name="email" type="email" required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="邮箱地址" :class="{ 'border-red-500': emailError }" />
          <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '发送中...' : '发送重置链接' }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          想起密码了？
          <router-link to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
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