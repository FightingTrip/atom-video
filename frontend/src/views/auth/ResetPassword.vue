<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          重置密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          请输入新密码
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
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="password" class="sr-only">新密码</label>
            <input id="password" v-model="password" name="password" type="password" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="新密码" :class="{ 'border-red-500': passwordError }" />
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">确认新密码</label>
            <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="确认新密码" :class="{ 'border-red-500': confirmPasswordError }" />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '重置中...' : '重置密码' }}
          </button>
        </div>
      </form>
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
