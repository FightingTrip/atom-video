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
          {{ isLogin ? t('auth.signInTitle') : t('auth.signUpTitle') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          {{ isLogin ? t('auth.signInDesc') : t('auth.signUpDesc') }}
        </p>

        <!-- 验证错误提示 -->
        <div v-if="validationError"
          class="mb-4 p-3 rounded-md bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {{ validationError }}
        </div>

        <!-- 社交登录 (仅登录模式显示) -->
        <div v-if="isLogin" class="mb-8">
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
          <!-- 注册时显示用户名 -->
          <div v-if="!isLogin">
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

          <!-- 确认密码 (注册时) -->
          <div v-if="!isLogin">
            <label for="confirmPassword" class="block text-sm font-medium mb-1">
              {{ t('auth.confirmPassword') }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input id="confirmPassword" v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" class="auth-input pr-10"
                :placeholder="t('auth.confirmPasswordPlaceholder')" required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i :class="['fas', showConfirmPassword ? 'fa-eye-slash' : 'fa-eye', 'text-gray-500']"></i>
              </button>
            </div>
          </div>

          <!-- 邮箱验证码 (注册时) -->
          <div v-if="!isLogin">
            <label for="verificationCode" class="block text-sm font-medium mb-1">
              {{ t('auth.verificationCode') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <input id="verificationCode" v-model="form.verificationCode" type="text" class="auth-input flex-1"
                :placeholder="t('auth.verificationCodePlaceholder')" required />
              <button type="button" @click="sendVerificationCode"
                class="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap"
                :disabled="countdown > 0">
                {{ countdown > 0 ? `${countdown}s` : t('auth.sendCode') }}
              </button>
            </div>
          </div>

          <!-- 记住我/忘记密码 (登录时) -->
          <div v-if="isLogin" class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                class="h-4 w-4 accent-primary rounded" />
              <label for="remember-me" class="ml-2 block text-sm">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <button type="button" @click="openForgotPasswordModal"
                class="font-medium text-primary hover:text-primary-dark">
                忘记密码？
              </button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div>
            <button type="submit"
              class="w-full py-3 px-4 rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              :disabled="loading">
              <span v-if="!loading">{{ isLogin ? t('auth.signIn') : t('auth.signUp') }}</span>
              <span v-else class="flex items-center justify-center">
                <i class="fas fa-circle-notch fa-spin mr-2"></i>
                {{ t('auth.processing') }}
              </span>
            </button>
          </div>

          <!-- 切换模式 -->
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ isLogin ? t('auth.noAccount') : t('auth.haveAccount') }}
              <a href="#" @click.prevent="isLogin = !isLogin" class="font-medium text-primary hover:text-primary-dark">
                {{ isLogin ? t('auth.signUpNow') : t('auth.signInNow') }}
              </a>
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

  <!-- 忘记密码弹窗 - 使用naive-ui的modal组件 -->
  <n-modal v-model:show="showForgotPassword" preset="card" title="重置密码" style="width: 400px;" :mask-closable="false">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      请输入您的邮箱地址，我们将发送重置密码的链接
    </div>

    <!-- 添加验证错误提示 -->
    <div v-if="resetError" class="mb-4 p-3 rounded-md bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
      {{ resetError }}
    </div>

    <!-- 添加成功提示 -->
    <div v-if="resetSuccess"
      class="mb-4 p-3 rounded-md bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
      {{ resetSuccess }}
    </div>

    <form @submit.prevent="handleForgotPassword">
      <div class="mb-4">
        <label for="reset-email" class="block text-sm font-medium mb-1">
          邮箱 <span class="text-red-500">*</span>
        </label>
        <n-input id="reset-email" v-model:value="forgotPasswordEmail" type="email" placeholder="请输入您的邮箱地址" required />
      </div>

      <div class="flex space-x-2 mt-4">
        <n-button @click="closeForgotPasswordModal" class="flex-1">
          取消
        </n-button>
        <n-button type="primary" @click="handleForgotPassword" :loading="resetLoading" class="flex-1">
          {{ resetLoading ? '发送中...' : '发送重置链接' }}
        </n-button>
      </div>
    </form>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useMessage, NModal, NInput, NButton } from 'naive-ui'
  import { useUserStore } from '@/stores/user'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const router = useRouter()
  const message = useMessage()
  const userStore = useUserStore()
  const authStore = useAuthStore()

  // 页面状态
  const isLogin = ref(true)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loading = ref(false)
  const countdown = ref(0)
  const showForgotPassword = ref(false)
  const forgotPasswordEmail = ref('')
  const resetLoading = ref(false)
  const resetError = ref('')
  const resetSuccess = ref('')
  const validationError = ref('')

  // 表单数据
  const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    rememberMe: false
  })

  // 表单提交
  const handleSubmit = async () => {
    loading.value = true
    validationError.value = ''

    try {
      // 简单验证
      if (!isLogin.value) {
        if (form.password !== form.confirmPassword) {
          validationError.value = t('auth.passwordsNotMatch')
          loading.value = false
          return
        }

        if (form.password.length < 8) {
          validationError.value = t('auth.passwordTooShort')
          loading.value = false
          return
        }
      }

      // 根据登录或注册调用不同的API
      if (isLogin.value) {
        // 邮箱登录逻辑
        const success = await authStore.login(form.email, form.password)
        if (success) {
          message.success(t('auth.signInSuccess'))
          router.push('/')
        }
      } else {
        // 注册逻辑
        await authStore.register(form.username, form.password, form.username)
        message.success(t('auth.signUpSuccess'))
        isLogin.value = true // 注册成功后转到登录页
      }
    } catch (error: any) {
      validationError.value = error.message || (isLogin.value ? t('auth.signInError') : t('auth.signUpError'))
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
      await userStore.sendVerificationCode(form.email)

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

  // 打开忘记密码模态框
  const openForgotPasswordModal = () => {
    showForgotPassword.value = true
    resetError.value = ''
    resetSuccess.value = ''
    forgotPasswordEmail.value = form.email // 自动填充当前输入的邮箱
  }

  // 忘记密码处理
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.value) {
      resetError.value = '请输入邮箱地址'
      return
    }

    resetLoading.value = true
    resetError.value = ''
    resetSuccess.value = ''

    try {
      await userStore.forgotPassword(forgotPasswordEmail.value)
      resetSuccess.value = `重置密码链接已发送至 ${forgotPasswordEmail.value}`

      // 3秒后关闭弹窗
      setTimeout(() => {
        closeForgotPasswordModal()
      }, 3000)

    } catch (error: any) {
      resetError.value = error.message || '发送重置链接失败'
    } finally {
      resetLoading.value = false
    }
  }

  // 关闭弹窗并重置状态
  const closeForgotPasswordModal = () => {
    showForgotPassword.value = false
    resetError.value = ''
    resetSuccess.value = ''
    // 保留邮箱，以便用户可以再次尝试
  }

  // 社交登录处理
  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}`
  }

  // 页面加载时检查认证状态
  onMounted(() => {
    if (authStore.isAuthenticated) {
      router.push('/')
    }
  })
</script>

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