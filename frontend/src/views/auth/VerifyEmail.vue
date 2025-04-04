<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          验证邮箱
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          请检查您的邮箱，点击验证链接完成注册
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

      <div class="mt-8 space-y-6">
        <div>
          <button @click="resendVerificationEmail" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '发送中...' : '重新发送验证邮件' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            验证邮件已发送到您的邮箱，请查收
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/auth';
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