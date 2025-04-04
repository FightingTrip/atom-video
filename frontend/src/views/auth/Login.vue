<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const isLoading = ref(false)
  const error = ref('')
  const emailError = ref('')
  const passwordError = ref('')

  const validateForm = () => {
    let isValid = true
    emailError.value = ''
    passwordError.value = ''

    if (!email.value) {
      emailError.value = '请输入邮箱地址'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      emailError.value = '请输入有效的邮箱地址'
      isValid = false
    }

    if (!password.value) {
      passwordError.value = '请输入密码'
      isValid = false
    } else if (password.value.length < 6) {
      passwordError.value = '密码长度至少为6位'
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    error.value = ''

    try {
      const result = await authStore.login(email.value, password.value)
      if (result.success) {
        router.push('/')
      } else {
        error.value = result.error
      }
    } catch (err) {
      error.value = '登录失败，请重试'
    } finally {
      isLoading.value = false
    }
  }

  const handleGoogleLogin = () => {
    // TODO: 实现 Google 登录
    window.location.href = '/api/auth/google'
  }

  const handleGithubLogin = () => {
    // TODO: 实现 GitHub 登录
    window.location.href = '/api/auth/github'
  }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录到 Atom Video
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <!-- 社交登录按钮 -->
        <div class="grid grid-cols-2 gap-3">
          <button @click="handleGoogleLogin"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <img class="h-5 w-5 mr-2" src="@/assets/google.svg" alt="Google" />
            Google
          </button>
          <button @click="handleGithubLogin"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <img class="h-5 w-5 mr-2" src="@/assets/github.svg" alt="GitHub" />
            GitHub
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">或使用邮箱登录</span>
          </div>
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

        <!-- 邮箱登录表单 -->
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">邮箱地址</label>
              <input id="email" v-model="email" type="email" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="邮箱地址" :class="{ 'border-red-500': emailError }" />
              <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
            </div>
            <div>
              <label for="password" class="sr-only">密码</label>
              <input id="password" v-model="password" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="密码" :class="{ 'border-red-500': passwordError }" />
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <router-link to="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
                忘记密码？
              </router-link>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            还没有账号？
            <router-link to="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              立即注册
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>