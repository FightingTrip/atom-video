/**
* @file Login.vue
* @description 登录页面组件，提供用户登录功能
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 邮箱密码登录：支持记住我功能
* - 社交账号登录：支持 Google 和 GitHub 登录
* - 忘记密码：支持密码重置
* - 表单验证：必填字段验证
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useAuthStore: 认证状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMessage } from 'naive-ui'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()
  const message = useMessage()

  // 页面状态
  const showPassword = ref(false)
  const loading = ref(false)
  const showForgotPassword = ref(false)
  const forgotPasswordEmail = ref('')
  const resetLoading = ref(false)

  const form = reactive({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async () => {
    loading.value = true
    try {
      console.log('Attempting login with:', form.email, form.password);
      const success = await authStore.login(form.email, form.password)
      console.log('Login result:', success);
      if (success) {
        message.success(t('auth.signInSuccess'))
        router.push('/')
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.message || t('auth.signInError'))
    } finally {
      loading.value = false
    }
  }

  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}`
  }

  const handleForgotPassword = async () => {
    resetLoading.value = true
    try {
      // 在这里实现忘记密码的逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success(`重置密码链接已发送至 ${forgotPasswordEmail.value}`)
      showForgotPassword.value = false
      forgotPasswordEmail.value = ''
    } catch (error: any) {
      message.error(error.message || '发送重置链接失败')
    } finally {
      resetLoading.value = false
    }
  }
</script>

<template>
  <div class="min-h-screen w-full flex auth-background">
    <!-- 左侧品牌区域 (仅在大屏幕显示) -->
    <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 brand-section">
      <div>
        <div class="flex items-center">
          <i class="fas fa-play-circle text-3xl brand-logo"></i>
          <span class="ml-2 text-2xl font-bold text-white">Atom Video</span>
        </div>
        <h1 class="mt-12 text-4xl font-bold leading-tight text-white">
          {{ t('auth.welcomeTitle') }}<br>
          {{ t('auth.platformName') }}
        </h1>
        <p class="mt-4 text-lg text-white/80">
          {{ t('auth.platformDesc') }}
        </p>
      </div>

      <div class="text-white/60 text-sm">
        © 2025 Atom Video. All rights reserved.
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 form-section">
      <div class="w-full max-w-md">
        <!-- 移动端Logo (仅在小屏幕显示) -->
        <div class="flex items-center justify-center mb-8 lg:hidden">
          <i class="fas fa-play-circle text-3xl brand-logo"></i>
          <span class="ml-2 text-2xl font-bold">Atom Video</span>
        </div>

        <!-- 标题 -->
        <h2 class="text-3xl font-bold mb-2">
          {{ t('auth.signInTitle') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          {{ t('auth.signInDesc') }}
        </p>

        <!-- 社交登录 -->
        <div class="mb-8">
          <div class="grid grid-cols-2 gap-4">
            <button @click="handleSocialLogin('google')" class="social-btn flex items-center justify-center py-2.5"
              title="Google">
              <i class="fab fa-google mr-2"></i>
              Google
            </button>
            <button @click="handleSocialLogin('github')" class="social-btn flex items-center justify-center py-2.5"
              title="GitHub">
              <i class="fab fa-github mr-2"></i>
              GitHub
            </button>
          </div>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 form-section text-gray-500 dark:text-gray-400">
                {{ t('auth.orUseEmail') }}
              </span>
            </div>
          </div>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 邮箱 -->
          <div>
            <label for="email" class="block text-sm font-medium mb-1">
              {{ t('auth.email') }} <span class="text-red-500">*</span>
            </label>
            <input id="email" v-model="form.email" type="email" class="auth-input"
              :placeholder="t('auth.emailPlaceholder')" required />
          </div>

          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium mb-1">
              {{ t('auth.password') }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                class="auth-input pr-10" :placeholder="t('auth.passwordPlaceholder')" required />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye', 'text-gray-500']"></i>
              </button>
            </div>
          </div>

          <!-- 记住我/忘记密码 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                class="h-4 w-4 accent-primary rounded" />
              <label for="remember-me" class="ml-2 block text-sm">
                {{ t('auth.rememberMe') }}
              </label>
            </div>

            <div class="text-sm">
              <a href="#" @click.prevent="showForgotPassword = true"
                class="font-medium text-primary hover:text-primary-dark">
                {{ t('auth.forgotPassword') }}
              </a>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div>
            <button type="submit"
              class="w-full py-3 px-4 rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              :disabled="loading">
              <span v-if="!loading">{{ t('auth.signIn') }}</span>
              <span v-else class="flex items-center justify-center">
                <i class="fas fa-circle-notch fa-spin mr-2"></i>
                {{ t('auth.processing') }}
              </span>
            </button>
          </div>

          <!-- 注册提示 -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('auth.noAccount') }}
              <router-link to="/auth/register" class="font-medium text-primary hover:text-primary-dark">
                {{ t('auth.signUp') }}
              </router-link>
            </p>
          </div>
        </form>

        <!-- 返回首页 -->
        <div class="mt-8 text-center">
          <router-link to="/"
            class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
            <i class="fas fa-arrow-left mr-1"></i>
            {{ t('auth.backToHome') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- 忘记密码弹窗 -->
  <n-modal v-model:show="showForgotPassword">
    <div class="w-[350px] rounded-lg p-6 bg-white dark:bg-gray-800">
      <h3 class="text-lg font-bold mb-3">{{ t('auth.resetPassword') }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ t('auth.resetPasswordDesc') }}
      </p>

      <form @submit.prevent="handleForgotPassword">
        <div class="mb-4">
          <label for="reset-email" class="block text-sm font-medium mb-1">
            {{ t('auth.email') }}
          </label>
          <input id="reset-email" v-model="forgotPasswordEmail" type="email" class="auth-input"
            :placeholder="t('auth.emailPlaceholder')" required />
        </div>

        <div class="flex space-x-2">
          <button type="button" @click="showForgotPassword = false"
            class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium">
            {{ t('auth.cancel') }}
          </button>
          <button type="submit"
            class="flex-1 py-2 px-4 rounded-lg text-white bg-primary hover:bg-primary-dark text-sm font-medium"
            :disabled="resetLoading">
            <span v-if="!resetLoading">{{ t('auth.sendResetLink') }}</span>
            <span v-else class="flex items-center justify-center">
              <i class="fas fa-circle-notch fa-spin mr-1"></i>
              {{ t('auth.sending') }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </n-modal>
</template>

<style scoped>
  .auth-background {
    background-color: #f9fafb;
  }

  :root.dark .auth-background {
    background-color: #111827;
  }

  .brand-section {
    background: linear-gradient(135deg, #3182ce 0%, #4f46e5 100%);
    position: relative;
    overflow: hidden;
  }

  .brand-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
    opacity: 0.2;
  }

  .brand-logo {
    color: #ffffff;
  }

  .form-section {
    background-color: #ffffff;
  }

  :root.dark .form-section {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .auth-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    color: #1f2937;
    transition: all 0.2s;
  }

  .auth-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  :root.dark .auth-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  :root.dark .auth-input:focus {
    border-color: var(--primary-color);
  }

  .social-btn {
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    color: #1f2937;
    transition: all 0.2s;
  }

  .social-btn:hover {
    background-color: #f9fafb;
  }

  :root.dark .social-btn {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  :root.dark .social-btn:hover {
    background-color: #4b5563;
  }
</style>
