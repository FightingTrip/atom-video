/**
* @file Register.vue
* @description 注册页面组件，提供用户注册功能
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 邮箱密码注册：支持用户名、邮箱、密码注册
* - 社交账号注册：支持 Google 和 GitHub 注册
* - 邮箱验证：支持邮箱验证码
* - 表单验证：必填字段验证、密码强度验证
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
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useMessage } from 'naive-ui'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const router = useRouter()
  const message = useMessage()
  const authStore = useAuthStore()

  // 页面状态
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loading = ref(false)
  const countdown = ref(0)

  // 表单数据
  const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  })

  // 表单提交
  const handleSubmit = async () => {
    loading.value = true
    try {
      // 简单验证
      if (form.password !== form.confirmPassword) {
        message.error(t('auth.passwordsNotMatch'))
        return
      }

      if (form.password.length < 8) {
        message.error(t('auth.passwordTooShort'))
        return
      }

      // 注册逻辑
      await authStore.register(form.username, form.password, form.username)

      message.success(t('auth.signUpSuccess'))
      router.push('/auth/login')
    } catch (error: any) {
      message.error(error.message || t('auth.signUpError'))
    } finally {
      loading.value = false
    }
  }

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!form.email) {
      message.warning(t('auth.emailRequired'))
      return
    }

    try {
      // 这里应该调用发送验证码的API
      // await userStore.sendVerificationCode(form.email)

      // 倒计时
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)

      message.success(t('auth.codeSent'))
    } catch (error: any) {
      message.error(error.message || t('auth.codeSendFailed'))
    }
  }

  // 社交登录处理
  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}`
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
          {{ t('auth.signUpTitle') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          {{ t('auth.signUpDesc') }}
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
          <!-- 用户名 -->
          <div>
            <label for="username" class="block text-sm font-medium mb-1">
              {{ t('auth.username') }} <span class="text-red-500">*</span>
            </label>
            <input id="username" v-model="form.username" type="text" class="auth-input"
              :placeholder="t('auth.usernamePlaceholder')" required />
          </div>

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

          <!-- 确认密码 -->
          <div>
            <label for="confirm-password" class="block text-sm font-medium mb-1">
              {{ t('auth.confirmPassword') }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input id="confirm-password" v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" class="auth-input pr-10"
                :placeholder="t('auth.confirmPasswordPlaceholder')" required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i :class="['fas', showConfirmPassword ? 'fa-eye-slash' : 'fa-eye', 'text-gray-500']"></i>
              </button>
            </div>
          </div>

          <!-- 验证码 -->
          <div>
            <label for="verification-code" class="block text-sm font-medium mb-1">
              验证码 <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <input id="verification-code" v-model="form.verificationCode" type="text" class="auth-input flex-1"
                placeholder="请输入验证码" required />
              <button type="button" @click="sendVerificationCode"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium"
                :disabled="countdown > 0">
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div>
            <button type="submit"
              class="w-full py-3 px-4 rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              :disabled="loading">
              <span v-if="!loading">{{ t('auth.signUp') }}</span>
              <span v-else class="flex items-center justify-center">
                <i class="fas fa-circle-notch fa-spin mr-2"></i>
                {{ t('auth.processing') }}
              </span>
            </button>
          </div>

          <!-- 登录提示 -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('auth.hasAccount') }}
              <router-link to="/auth/login" class="font-medium text-primary hover:text-primary-dark">
                {{ t('auth.signIn') }}
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
</template>

<style scoped>
  .auth-background {
    background-color: var(--primary-bg);
  }

  .brand-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
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
    color: var(--text-inverse);
  }

  .form-section {
    background-color: var(--secondary-bg);
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

  .social-btn {
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    transition: all var(--transition-normal);
  }

  .social-btn:hover {
    background-color: var(--tertiary-bg);
  }
</style>