<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const form = reactive({
    username: '',
    password: '',
    remember: false,
  })

  const handleSubmit = async () => {
    const success = await authStore.login(form.username, form.password)
    if (success) {
      router.push('/')
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
        <img class="mx-auto h-12 w-auto" src="/logo-192.png" alt="Atom Video" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录到您的账号
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <router-link to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
            创建新账号
          </router-link>
        </p>
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
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ authStore.error }}</p>
            </div>
          </div>
        </div>

        <!-- 邮箱登录表单 -->
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">用户名</label>
              <input id="username" v-model="form.username" name="username" type="text" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="用户名" />
            </div>
            <div>
              <label for="password" class="sr-only">密码</label>
              <input id="password" v-model="form.password" name="password" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="密码" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.remember" name="remember-me" type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                忘记密码？
              </a>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="authStore.loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-sign-in-alt h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
              </span>
              {{ authStore.loading ? '登录中...' : '登录' }}
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