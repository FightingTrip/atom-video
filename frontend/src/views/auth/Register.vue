<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'

  const router = useRouter()
  const authStore = useAuthStore()
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const username = ref('')
  const isLoading = ref(false)
  const error = ref('')
  const usernameError = ref('')
  const emailError = ref('')
  const passwordError = ref('')
  const confirmPasswordError = ref('')

  const validateForm = () => {
    let isValid = true
    usernameError.value = ''
    emailError.value = ''
    passwordError.value = ''
    confirmPasswordError.value = ''

    if (!username.value) {
      usernameError.value = '请输入用户名'
      isValid = false
    } else if (username.value.length < 3) {
      usernameError.value = '用户名长度至少为3位'
      isValid = false
    }

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

    if (!confirmPassword.value) {
      confirmPasswordError.value = '请确认密码'
      isValid = false
    } else if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = '两次输入的密码不一致'
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    error.value = ''

    try {
      const result = await authStore.register(email.value, password.value, username.value)
      if (result.success) {
        router.push('/')
      } else {
        error.value = result.error
      }
    } catch (err) {
      error.value = '注册失败，请重试'
    } finally {
      isLoading.value = false
    }
  }

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  const handleGithubRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`
  }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          注册 Atom Video 账号
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <!-- 社交注册按钮 -->
        <div class="grid grid-cols-2 gap-3">
          <button @click="handleGoogleRegister"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <img src="@/assets/google.svg" class="h-5 w-5 mr-2" alt="Google" />
            Google
          </button>
          <button @click="handleGithubRegister"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <img src="@/assets/github.svg" class="h-5 w-5 mr-2" alt="GitHub" />
            GitHub
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">或使用邮箱注册</span>
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

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">用户名</label>
              <input id="username" v-model="username" name="username" type="text" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="用户名" :class="{ 'border-red-500': usernameError }" />
              <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
            </div>
            <div>
              <label for="email" class="sr-only">邮箱地址</label>
              <input id="email" v-model="email" name="email" type="email" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="邮箱地址" :class="{ 'border-red-500': emailError }" />
              <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
            </div>
            <div>
              <label for="password" class="sr-only">密码</label>
              <input id="password" v-model="password" name="password" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="密码" :class="{ 'border-red-500': passwordError }" />
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">确认密码</label>
              <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="确认密码" :class="{ 'border-red-500': confirmPasswordError }" />
              <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
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
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </div>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            已有账号？
            <router-link to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              立即登录
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>