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
  import { ref, reactive, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useMessage, NModal } from 'naive-ui'
  import { useAuthStore } from '@/stores/auth'
  import { sendVerificationCode as mockSendVerificationCode, verifyEmailCode } from '@/mock/users'
  import { OAuthService } from '@/services/oauth'

  const { t } = useI18n()
  const router = useRouter()
  const message = useMessage()
  const authStore = useAuthStore()

  // 页面状态
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loading = ref(false)
  const countdown = ref(0)
  const countdownTimer = ref<number | null>(null)
  const showVerifyEmail = ref(false)

  // 表单数据
  const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  })

  // 是否可以发送验证码
  const canSendCode = computed(() => {
    return form.email && form.email.includes('@') && countdown.value === 0
  })

  // 表单提交
  const handleSubmit = async () => {
    // 先验证表单
    if (!validateForm()) return

    // 如果需要验证码但尚未验证
    if (!showVerifyEmail.value) {
      showVerifyEmail.value = true
      sendVerificationCode()
      return
    }

    // 如果已经进入验证码界面，此方法不应该被直接调用
    // 而是应该通过verifyEmail方法间接调用
    if (showVerifyEmail.value && !form.verificationCode) {
      message.warning('请输入验证码完成注册')
      return
    }

    loading.value = true
    try {
      // 在模拟模式下，简化为直接注册
      const success = await authStore.register(form.username, form.password, form.username)

      if (success) {
        message.success(t('auth.signUpSuccess') || '注册成功')
        showVerifyEmail.value = false
        router.push('/auth/login')
      }
    } catch (error: any) {
      message.error(error.message || t('auth.signUpError') || '注册失败')
    } finally {
      loading.value = false
    }
  }

  // 表单验证
  const validateForm = () => {
    if (!form.username) {
      message.error('请输入用户名')
      return false
    }

    if (!form.email || !form.email.includes('@')) {
      message.error('请输入有效的邮箱地址')
      return false
    }

    if (!form.password) {
      message.error('请输入密码')
      return false
    }

    if (form.password.length < 8) {
      message.error('密码长度至少为8位')
      return false
    }

    if (form.password !== form.confirmPassword) {
      message.error('两次输入的密码不一致')
      return false
    }

    return true
  }

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!form.email || !form.email.includes('@')) {
      message.warning('请输入有效的邮箱地址')
      return
    }

    if (countdown.value > 0) return

    try {
      loading.value = true
      // 调用模拟验证码API
      const response = await mockSendVerificationCode(form.email)
      loading.value = false

      if (response.success) {
        // 在模拟模式下，显示验证码方便测试
        message.success(`验证码已发送！模拟模式下，验证码为: ${response.data}`)

        // 倒计时
        countdown.value = 60
        if (countdownTimer.value) clearInterval(countdownTimer.value)
        countdownTimer.value = window.setInterval(() => {
          countdown.value--
          if (countdown.value <= 0) {
            if (countdownTimer.value) clearInterval(countdownTimer.value)
          }
        }, 1000)
      } else {
        message.error(response.error || '发送验证码失败')
      }
    } catch (error: any) {
      loading.value = false
      message.error(error.message || '发送验证码失败')
    }
  }

  // 验证邮箱
  const verifyEmail = async () => {
    if (!form.verificationCode) {
      message.warning('请输入验证码')
      return
    }

    loading.value = true
    try {
      // 调用验证码验证API
      const response = await verifyEmailCode(form.email, form.verificationCode)

      if (response.success) {
        message.success('验证成功')
        // 继续注册流程
        await handleSubmit()
      } else {
        message.error(response.error || '验证码不正确或已过期')
      }
    } catch (error: any) {
      message.error(error.message || '验证码无效')
    } finally {
      loading.value = false
    }
  }

  // 关闭验证邮箱模态框
  const closeVerifyModal = () => {
    showVerifyEmail.value = false
  }

  // 社交登录处理
  const handleSocialLogin = (provider: 'google' | 'github') => {
    OAuthService.initiateOAuth(provider);
  }
</script>

<template>
  <div class="auth-container">
    <!-- 注册卡片 -->
    <div class="auth-card">
      <!-- Logo -->
      <div class="logo-container">
        <svg viewBox="0 0 24 24" width="36" height="36">
          <rect width="24" height="24" fill="#333" />
          <path d="M12 6l-8 4.5v3L12 18l8-4.5v-3L12 6z" fill="white" />
        </svg>
      </div>

      <!-- 标题 -->
      <h1 class="auth-title">Sign up 注册</h1>

      <!-- 社交注册按钮 -->
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
          <span>Continue with Google</span>
        </button>

        <button @click="handleSocialLogin('github')" class="social-btn github-btn">
          <span class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </span>
          <span>Continue with GitHub</span>
        </button>
      </div>

      <!-- 分隔符 -->
      <div class="divider">
        <span>OR</span>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleSubmit" class="register-form">
        <!-- 用户名和邮箱 (两列布局) -->
        <div class="form-row">
          <div class="form-col">
            <label for="username" class="form-label">用户名</label>
            <div class="input-container">
              <input id="username" v-model="form.username" type="text" class="form-input" placeholder="请输入用户名"
                required />
            </div>
          </div>
          <div class="form-col">
            <label for="email" class="form-label">电子邮件</label>
            <div class="input-container">
              <input id="email" v-model="form.email" type="email" class="form-input" placeholder="请输入邮箱" required />
            </div>
          </div>
        </div>

        <!-- 密码和确认密码 (两列布局) -->
        <div class="form-row">
          <div class="form-col">
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
          <div class="form-col">
            <label for="confirmPassword" class="form-label">确认密码</label>
            <div class="input-container">
              <input id="confirmPassword" v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" class="form-input" placeholder="请再次输入" required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="toggle-password">
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18"
                  height="18">
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
        </div>

        <!-- 同意条款 -->
        <div class="terms-checkbox">
          <input type="checkbox" id="agree-terms" required>
          <label for="agree-terms">我已阅读并同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#"
              class="terms-link">隐私政策</a></label>
        </div>

        <button type="submit" class="register-button" :disabled="loading">
          <span v-if="!loading">注册</span>
          <span v-else class="loader-container">
            <span class="loader"></span>
            <span>处理中...</span>
          </span>
        </button>
      </form>

      <!-- 底部登录链接 -->
      <div class="auth-footer">
        <p class="login-prompt">
          已有账号? <router-link to="/auth/login">Sign in 登录</router-link>
        </p>
      </div>

      <!-- 服务条款和隐私政策 -->
      <div class="terms-privacy">
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>

  <!-- 邮箱验证弹窗 -->
  <n-modal v-model:show="showVerifyEmail">
    <div class="verify-email-container">
      <h3 class="verify-title">验证邮箱</h3>
      <p class="verify-description">
        我们已向 {{ form.email }} 发送了验证码，请输入您收到的验证码完成注册。
      </p>

      <!-- 模拟模式下的帮助提示 -->
      <div class="mock-tip">
        <p><strong>提示:</strong> 在模拟模式下，您可以：</p>
        <ul>
          <li>使用控制台查看验证码 (已打印到控制台)</li>
          <li>使用固定测试验证码 "123456"</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="verification-code" class="form-label">验证码</label>
        <div class="input-container code-input-container">
          <input id="verification-code" v-model="form.verificationCode" type="text" class="form-input"
            placeholder="请输入6位验证码" maxlength="6" required />
          <button @click="sendVerificationCode" class="resend-button" :disabled="!canSendCode || countdown > 0">
            {{ countdown > 0 ? `${countdown}s` : '重新发送' }}
          </button>
        </div>
      </div>

      <div class="verify-buttons">
        <button type="button" @click="closeVerifyModal" class="verify-cancel-button">
          返回
        </button>
        <button type="submit" @click="verifyEmail" class="verify-submit-button"
          :disabled="loading || !form.verificationCode">
          <span v-if="!loading">验证并注册</span>
          <span v-else class="loader-container">
            <span class="loader loader-small"></span>
            <span>处理中...</span>
          </span>
        </button>
      </div>
    </div>
  </n-modal>
</template>

<style scoped>
  .auth-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .auth-card {
    background-color: #222;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 520px;
    padding: 28px;
    color: #fff;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  .auth-title {
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    color: #fff;
  }

  .form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #ddd;
  }

  .input-container {
    position: relative;
    margin-bottom: 12px;
  }

  .form-input {
    width: 100%;
    padding: 10px 12px;
    background-color: #333;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 14px;
    color: white;
    transition: all 0.3s;
    overflow: visible;
    text-overflow: ellipsis;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
  }

  .register-button {
    width: 100%;
    padding: 10px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 12px;
  }

  .register-button:hover {
    background-color: #2563eb;
  }

  .register-button:disabled {
    background-color: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 16px 0;
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
    gap: 8px;
    margin-bottom: 16px;
  }

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: #333;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
  }

  .social-btn:hover {
    background-color: #444;
  }

  .social-icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .auth-footer {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .auth-footer a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .auth-footer a:hover {
    text-decoration: underline;
  }

  .terms-privacy {
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  .terms-privacy a {
    color: #3b82f6;
    text-decoration: none;
  }

  .terms-privacy a:hover {
    text-decoration: underline;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-row {
    display: flex;
    gap: 12px;
  }

  .form-col {
    flex: 1;
  }

  /* 验证邮箱弹窗样式 */
  .verify-email-container {
    background-color: #222;
    padding: 28px;
    border-radius: 8px;
    max-width: 380px;
    width: 100%;
    color: white;
  }

  .verify-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    text-align: center;
  }

  .verify-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 24px;
    text-align: center;
  }

  .verify-buttons {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 24px;
  }

  .verify-cancel-button {
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

  .verify-cancel-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .verify-submit-button {
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

  .verify-submit-button:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .verify-submit-button:disabled {
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
    min-width: 80px;
  }

  .resend-button:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .resend-button:disabled {
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
  }

  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 4px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
  }

  .terms-checkbox input {
    margin-top: 3px;
  }

  .terms-link {
    color: #3b82f6;
    text-decoration: none;
  }

  .terms-link:hover {
    text-decoration: underline;
  }

  .mock-tip {
    background-color: #2d3748;
    border-left: 4px solid #3b82f6;
    padding: 12px;
    margin: 16px 0;
    border-radius: 4px;
    font-size: 13px;
  }

  .mock-tip p {
    margin: 0 0 8px 0;
    color: #e2e8f0;
  }

  .mock-tip strong {
    font-weight: 600;
    color: #3b82f6;
  }

  .mock-tip ul {
    margin: 0;
    padding-left: 20px;
    color: #cbd5e0;
  }

  .mock-tip li {
    margin: 4px 0;
  }
</style>