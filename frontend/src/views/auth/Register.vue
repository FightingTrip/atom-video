<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()
  const form = reactive({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  })
  const validationError = ref('')

  const isValid = computed(() => {
    if (form.password !== form.confirmPassword) {
      validationError.value = '两次输入的密码不一致'
      return false
    }
    if (form.password.length < 6) {
      validationError.value = '密码长度至少为6位'
      return false
    }
    if (form.username.length < 3) {
      validationError.value = '用户名长度至少为3位'
      return false
    }
    validationError.value = ''
    return true
  })

  const handleSubmit = async () => {
    if (!isValid.value) return

    const success = await authStore.register(
      form.username,
      form.password,
      form.nickname || undefined
    )

    if (success) {
      router.push('/')
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
        <img class="mx-auto h-12 w-auto" src="/logo-192.png" alt="Atom Video" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          创建新账号
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            登录已有账号
          </router-link>
        </p>
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

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">用户名</label>
              <input id="username" v-model="form.username" name="username" type="text" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="用户名" />
            </div>
            <div>
              <label for="nickname" class="sr-only">昵称</label>
              <input id="nickname" v-model="form.nickname" name="nickname" type="text"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="昵称（可选）" />
            </div>
            <div>
              <label for="password" class="sr-only">密码</label>
              <input id="password" v-model="form.password" name="password" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="密码" />
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">确认密码</label>
              <input id="confirmPassword" v-model="form.confirmPassword" name="confirmPassword" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="确认密码" />
            </div>
          </div>

          <div>
            <button type="submit" :disabled="authStore.loading || !isValid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-user-plus h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
              </span>
              {{ authStore.loading ? '注册中...' : '注册' }}
            </button>
          </div>
        </form>

        <div v-if="authStore.error" class="mt-4">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ authStore.error }}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="authStore.clearError">
              <i class="fas fa-times" />
            </span>
          </div>
        </div>

        <div v-if="validationError" class="mt-4">
          <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ validationError }}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="validationError = ''">
              <i class="fas fa-times" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>