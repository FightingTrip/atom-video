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
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMessage, NModal } from 'naive-ui'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/auth'
  import LoginTestAccountsComponent from './LoginTestAccountsComponent.vue'
  import { OAuthService } from '@/services/oauth'

  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()
  const message = useMessage()

  // 页面状态
  const showPassword = ref(true) // 默认显示密码框，支持单步登录
  const loading = ref(false)
  const showForgotPassword = ref(false)
  const forgotPasswordEmail = ref('')
  const resetLoading = ref(false)

  // 密码重置流程状态
  const resetStep = ref(1) // 1:输入邮箱, 2:输入验证码, 3:设置新密码, 4:成功
  const resetVerificationCode = ref('')
  const resetNewPassword = ref('')
  const resetConfirmPassword = ref('')
  const verificationCodeSent = ref(false)
  const countdown = ref(0)
  const countdownTimer = ref<number | null>(null)

  // 测试账号状态
  const showTestAccounts = ref(false)

  // 监听弹窗关闭，重置状态
  watch(showForgotPassword, (newVal) => {
    if (!newVal) {
      setTimeout(() => {
        resetStep.value = 1
        resetVerificationCode.value = ''
        resetNewPassword.value = ''
        resetConfirmPassword.value = ''
        verificationCodeSent.value = false
        if (countdownTimer.value) {
          clearInterval(countdownTimer.value)
          countdown.value = 0
        }
      }, 300)
    }
  })

  // 组件卸载时清理定时器
  onMounted(() => {
    return () => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
    }
  })

  const form = reactive({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async () => {
    // 表单基本验证
    if (!form.email) {
      message.warning('请输入邮箱地址')
      return
    }
    if (!form.password) {
      message.warning('请输入密码')
      return
    }

    loading.value = true
    try {
      // 直接使用message实例，避免经过useToast
      try {
        const success = await authStore.login(form.email, form.password)
        if (success) {
          message.success(t('auth.signInSuccess') || '登录成功')
          router.push('/')
        }
      } catch (loginError: any) {
        console.error('登录提交过程中发生错误:', loginError)
        const errorMsg = loginError && typeof loginError === 'object' && loginError.message
          ? loginError.message
          : '登录过程中发生错误，请稍后再试'
        message.error(errorMsg)
      }
    } catch (error: any) {
      console.error('处理登录请求时发生错误:', error)
      // 确保即使在错误情况下也提供友好提示
      try {
        const errorMessage = error && typeof error === 'object' && error.message
          ? error.message
          : '登录过程中发生未知错误'
        message.error(errorMessage)
      } catch (toastError) {
        console.error('显示错误消息失败:', toastError)
        alert('登录失败，请刷新页面重试')
      }
    } finally {
      loading.value = false
    }
  }

  const handleSocialLogin = (provider: 'google' | 'github') => {
    OAuthService.initiateOAuth(provider);
  }

  // 开始重置密码流程
  const startPasswordReset = () => {
    forgotPasswordEmail.value = form.email || ''
    showForgotPassword.value = true
  }

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!forgotPasswordEmail.value) {
      message.warning('请输入邮箱地址')
      return
    }

    resetLoading.value = true
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 实际项目中应该调用真实API
      // await authStore.sendResetCode(forgotPasswordEmail.value)

      message.success(`验证码已发送至 ${forgotPasswordEmail.value}`)
      verificationCodeSent.value = true

      // 设置倒计时
      countdown.value = 60
      if (countdownTimer.value) clearInterval(countdownTimer.value)
      countdownTimer.value = window.setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          if (countdownTimer.value) clearInterval(countdownTimer.value)
        }
      }, 1000)

      // 进入下一步
      resetStep.value = 2
    } catch (error: any) {
      message.error(error.message || '发送验证码失败')
    } finally {
      resetLoading.value = false
    }
  }

  // 验证验证码
  const verifyCode = async () => {
    if (!resetVerificationCode.value) {
      message.warning('请输入验证码')
      return
    }

    resetLoading.value = true
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 实际项目中应该调用真实API
      // const result = await authStore.verifyResetCode(forgotPasswordEmail.value, resetVerificationCode.value)

      message.success('验证成功')
      resetStep.value = 3
    } catch (error: any) {
      message.error(error.message || '验证码无效')
    } finally {
      resetLoading.value = false
    }
  }

  // 重置密码
  const resetPassword = async () => {
    if (!resetNewPassword.value) {
      message.warning('请输入新密码')
      return
    }

    if (resetNewPassword.value.length < 8) {
      message.warning('密码长度至少为8位')
      return
    }

    if (resetNewPassword.value !== resetConfirmPassword.value) {
      message.warning('两次输入的密码不一致')
      return
    }

    resetLoading.value = true
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 实际项目中应该调用真实API
      // await authStore.resetPassword(forgotPasswordEmail.value, resetVerificationCode.value, resetNewPassword.value)

      message.success('密码重置成功')
      resetStep.value = 4
    } catch (error: any) {
      message.error(error.message || '密码重置失败')
    } finally {
      resetLoading.value = false
    }
  }
</script>

<template>
  <div class="auth-container">
    <!-- 登录卡片 -->
    <div class="auth-card">
      <!-- Logo -->
      <div class="logo-container">
        <svg viewBox="0 0 24 24" width="36" height="36">
          <rect width="24" height="24" fill="#333" />
          <path d="M12 6l-8 4.5v3L12 18l8-4.5v-3L12 6z" fill="white" />
        </svg>
      </div>

      <!-- 标题 -->
      <h1 class="auth-title">Sign in 登入</h1>

      <!-- 登录表单 - 整合版本 -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email 电子邮件</label>
          <div class="input-container">
            <input id="email" v-model="form.email" type="email" class="form-input" placeholder="请输入邮箱地址" required />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="input-container">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input"
              placeholder="请输入密码" required />
            <button type="button" @click="showPassword = !showPassword" class="toggle-password">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor"
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor"
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input id="remember-me" v-model="form.rememberMe" type="checkbox" class="checkbox" />
            <label for="remember-me">记住我</label>
          </div>
          <button type="button" @click="startPasswordReset" class="forgot-password-link">
            忘记密码?
          </button>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="!loading">登录</span>
          <span v-else class="loader-container">
            <span class="loader"></span>
            <span>处理中...</span>
          </span>
        </button>
      </form>

      <!-- 分隔符 -->
      <div class="divider">
        <span>OR 或者</span>
      </div>

      <!-- 社交登录按钮 -->
      <div class="social-login-buttons">
        <button @click="handleSocialLogin('google')" class="social-btn google-btn">
          <span class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </span>
          <span>Continue with Google 继续使用谷歌</span>
        </button>

        <button @click="handleSocialLogin('github')" class="social-btn github-btn">
          <span class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </span>
          <span>Continue with GitHub 继续使用github</span>
        </button>
      </div>

      <!-- 底部注册链接 -->
      <div class="auth-footer">
        <p class="signup-prompt">
          Don't have an account? <router-link to="/auth/register">Sign up 注册</router-link>
        </p>
      </div>

      <!-- 服务条款和隐私政策 -->
      <div class="terms-privacy">
        <a href="#">Terms of Service</a>
      </div>

      <!-- 测试账号表 -->
      <login-test-accounts-component v-if="showTestAccounts" />

      <!-- 切换测试账号显示 -->
      <div class="test-accounts-toggle">
        <button @click="showTestAccounts = !showTestAccounts" class="toggle-test-accounts-btn">
          {{ showTestAccounts ? '隐藏测试账号' : '显示测试账号' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 忘记密码弹窗 - 多步骤流程 -->
  <n-modal v-model:show="showForgotPassword">
    <div class="reset-password-container">
      <!-- 步骤1: 输入邮箱 -->
      <template v-if="resetStep === 1">
        <h3 class="reset-title">找回密码</h3>
        <p class="reset-description">
          请输入您的邮箱地址，我们将向您发送验证码。
        </p>

        <div class="form-group">
          <label for="reset-email" class="form-label">邮箱</label>
          <div class="input-container">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor"
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
              </svg>
            </span>
            <input id="reset-email" v-model="forgotPasswordEmail" type="email" class="form-input"
              placeholder="your.email@example.com" required />
          </div>
        </div>

        <div class="reset-buttons">
          <button type="button" @click="showForgotPassword = false" class="reset-cancel-button">
            取消
          </button>
          <button type="submit" class="reset-submit-button" @click="sendVerificationCode"
            :disabled="resetLoading || !forgotPasswordEmail">
            <span v-if="!resetLoading">发送验证码</span>
            <span v-else class="loader-container">
              <span class="loader loader-small"></span>
              <span>发送中...</span>
            </span>
          </button>
        </div>
      </template>

      <!-- 步骤2: 输入验证码 -->
      <template v-if="resetStep === 2">
        <h3 class="reset-title">验证身份</h3>
        <p class="reset-description">
          验证码已发送至 {{ forgotPasswordEmail }}
        </p>

        <div class="form-group">
          <label for="reset-code" class="form-label">验证码</label>
          <div class="input-container code-input-container">
            <input id="reset-code" v-model="resetVerificationCode" type="text" class="form-input" placeholder="请输入6位验证码"
              maxlength="6" required />
            <button @click="sendVerificationCode" class="resend-button" :disabled="countdown > 0 || resetLoading">
              {{ countdown > 0 ? `重新发送(${countdown}s)` : '重新发送' }}
            </button>
          </div>
        </div>

        <div class="reset-buttons">
          <button type="button" @click="resetStep = 1" class="reset-cancel-button">
            上一步
          </button>
          <button type="submit" class="reset-submit-button" @click="verifyCode"
            :disabled="resetLoading || !resetVerificationCode">
            <span v-if="!resetLoading">下一步</span>
            <span v-else class="loader-container">
              <span class="loader loader-small"></span>
              <span>验证中...</span>
            </span>
          </button>
        </div>
      </template>

      <!-- 步骤3: 设置新密码 -->
      <template v-if="resetStep === 3">
        <h3 class="reset-title">设置新密码</h3>
        <p class="reset-description">
          请设置您的新密码
        </p>

        <div class="form-group">
          <label for="new-password" class="form-label">新密码</label>
          <div class="input-container">
            <input id="new-password" v-model="resetNewPassword" type="password" class="form-input"
              placeholder="请设置至少8位的新密码" required />
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password" class="form-label">确认密码</label>
          <div class="input-container">
            <input id="confirm-password" v-model="resetConfirmPassword" type="password" class="form-input"
              placeholder="请再次输入新密码" required />
          </div>
        </div>

        <div class="reset-buttons">
          <button type="button" @click="resetStep = 2" class="reset-cancel-button">
            上一步
          </button>
          <button type="submit" class="reset-submit-button" @click="resetPassword"
            :disabled="resetLoading || !resetNewPassword || !resetConfirmPassword">
            <span v-if="!resetLoading">重置密码</span>
            <span v-else class="loader-container">
              <span class="loader loader-small"></span>
              <span>重置中...</span>
            </span>
          </button>
        </div>
      </template>

      <!-- 步骤4: 重置成功 -->
      <template v-if="resetStep === 4">
        <div class="reset-success">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <circle cx="12" cy="12" r="11" fill="#3b82f6" opacity="0.2" />
              <path fill="#3b82f6"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h3 class="success-title">密码重置成功</h3>
          <p class="reset-description">
            您现在可以使用新密码登录您的账号
          </p>
          <button @click="showForgotPassword = false" class="done-button">
            完成
          </button>
        </div>
      </template>
    </div>
  </n-modal>
</template>

<style scoped>
  .auth-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .auth-card {
    max-width: 420px;
    width: 100%;
    background-color: #222;
    border-radius: 8px;
    padding: 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
  }

  .logo-container {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  .auth-title {
    font-size: 24px;
    font-weight: 600;
    color: white;
    margin-bottom: 24px;
    text-align: center;
  }

  /* 登录表单样式 */
  .login-form {
    width: 100%;
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
  }

  .input-container {
    position: relative;
    margin-bottom: 16px;
  }

  .form-input {
    width: 100%;
    background-color: #333;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 12px;
    color: white;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .login-button {
    width: 100%;
    padding: 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 8px;
  }

  .login-button:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .login-button:disabled {
    background-color: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .divider span {
    padding: 0 12px;
  }

  .social-login-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .social-btn {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: #333;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .social-btn:hover {
    background-color: #444;
  }

  .social-icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .checkbox {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    background-color: transparent;
    cursor: pointer;
    position: relative;
  }

  .checkbox:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .checkbox:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 3px;
    height: 6px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .forgot-password-link {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .forgot-password-link:hover {
    color: #3b82f6;
  }

  .auth-footer {
    margin-top: 24px;
    text-align: center;
  }

  .signup-prompt {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .signup-prompt a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .signup-prompt a:hover {
    text-decoration: underline;
  }

  .terms-privacy {
    margin-top: 24px;
    text-align: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .loader {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loader-small {
    width: 12px;
    height: 12px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.5);
  }

  /* 重置密码弹窗样式 */
  .reset-password-container {
    background-color: #222;
    padding: 28px;
    border-radius: 8px;
    max-width: 380px;
    width: 100%;
    color: white;
  }

  .reset-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    text-align: center;
  }

  .reset-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 24px;
    text-align: center;
  }

  .reset-buttons {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 24px;
  }

  .reset-cancel-button {
    flex: 1;
    padding: 10px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-cancel-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .reset-submit-button,
  .done-button {
    flex: 1;
    padding: 10px;
    background-color: #3b82f6;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-submit-button:hover:not(:disabled),
  .done-button:hover {
    background-color: #2563eb;
  }

  .reset-submit-button:disabled {
    background-color: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
  }

  .code-input-container {
    display: flex;
    gap: 10px;
  }

  .resend-button {
    padding: 0 12px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
  }

  .resend-button:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .resend-button:disabled {
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
  }

  .reset-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px 0;
  }

  .success-icon {
    margin-bottom: 20px;
  }

  .success-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: white;
  }

  .done-button {
    width: 100%;
    max-width: 200px;
  }

  /* 测试账号样式 */
  .test-accounts-toggle {
    margin-top: 20px;
    text-align: center;
  }

  .toggle-test-accounts-btn {
    padding: 10px 20px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .toggle-test-accounts-btn:hover {
    background-color: #2563eb;
  }
</style>