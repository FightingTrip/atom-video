/**
* @file MockOAuthPage.vue
* @description 模拟第三方登录授权页面
* @author Atom Video Team
*/

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const provider = ref<'google' | 'github'>('google');
  const redirectUri = ref('');
  const clientId = ref('');
  const countDown = ref(5);
  const countdownInterval = ref<number | null>(null);

  // 获取授权参数
  onMounted(() => {
    // 解析查询参数
    provider.value = route.params.provider as 'google' | 'github';
    redirectUri.value = route.query.redirect_uri as string || '';
    const code = generateMockCode();

    // 倒计时自动跳转
    countdownInterval.value = window.setInterval(() => {
      countDown.value--;

      if (countDown.value <= 0) {
        // 清除计时器
        if (countdownInterval.value) {
          clearInterval(countdownInterval.value);
        }

        // 模拟授权成功跳转回应用
        handleAuthorize();
      }
    }, 1000);
  });

  // 生成模拟授权码
  function generateMockCode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // 处理授权
  function handleAuthorize() {
    loading.value = true;

    // 生成授权码
    const code = generateMockCode();

    // 构建回调URL
    let callbackUrl = redirectUri.value;
    if (callbackUrl) {
      callbackUrl += (callbackUrl.includes('?') ? '&' : '?') + `code=${code}`;

      // 模拟延迟后跳转
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 800);
    } else {
      console.error('无效的重定向URI');
    }
  }

  // 拒绝授权
  function handleCancel() {
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value);
    }

    router.push('/auth/login');
  }
</script>

<template>
  <div class="oauth-page" :class="provider">
    <div class="oauth-container">
      <div class="provider-logo" v-if="provider === 'google'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      </div>

      <div class="provider-logo" v-if="provider === 'github'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </div>

      <h2 class="auth-title">
        <span v-if="provider === 'google'">Google</span>
        <span v-if="provider === 'github'">GitHub</span>
        授权登录
      </h2>

      <div class="auth-description">
        <p>Atom Video 想要访问您的帐户</p>
        <p class="service-name">atom-video.app</p>
      </div>

      <div class="permissions">
        <div class="permission-item">
          <div class="permission-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="permission-text">
            <span>查看您的姓名、电子邮件地址和个人资料照片</span>
          </div>
        </div>
      </div>

      <div class="mock-indicator">
        <span>模拟模式 - 这是一个测试环境</span>
        <p class="countdown">{{ countDown }}秒后自动授权</p>
      </div>

      <div class="buttons">
        <button class="cancel-button" @click="handleCancel">取消</button>
        <button class="authorize-button" :class="provider" @click="handleAuthorize" :disabled="loading">
          <span v-if="!loading">授权登录</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .oauth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  .oauth-page.google {
    background-color: #f5f5f5;
    color: #202124;
  }

  .oauth-page.github {
    background-color: #0d1117;
    color: #e6edf3;
  }

  .oauth-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    padding: 32px;
    width: 100%;
    max-width: 450px;
    text-align: center;
  }

  .github .oauth-container {
    background-color: #161b22;
    border: 1px solid #30363d;
  }

  .provider-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .auth-title {
    font-size: 22px;
    font-weight: 600;
    margin: 16px 0;
  }

  .github .auth-title {
    color: #e6edf3;
  }

  .auth-description {
    margin-bottom: 24px;
    color: #5f6368;
    font-size: 14px;
  }

  .github .auth-description {
    color: #8b949e;
  }

  .service-name {
    font-weight: 600;
    margin-top: 8px;
  }

  .permissions {
    text-align: left;
    margin-bottom: 24px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    padding: 16px;
  }

  .github .permissions {
    border-color: #30363d;
  }

  .permission-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .permission-icon {
    margin-right: 16px;
    color: #5f6368;
  }

  .github .permission-icon {
    color: #8b949e;
  }

  .permission-text {
    font-size: 14px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
  }

  .cancel-button {
    padding: 10px 20px;
    font-size: 14px;
    color: #5f6368;
    background: transparent;
    border: 1px solid #dadce0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .github .cancel-button {
    color: #8b949e;
    border-color: #30363d;
  }

  .cancel-button:hover {
    background-color: #f1f3f4;
  }

  .github .cancel-button:hover {
    background-color: #1f2937;
  }

  .authorize-button {
    padding: 10px 20px;
    font-size: 14px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .authorize-button.google {
    background-color: #4285f4;
  }

  .authorize-button.github {
    background-color: #238636;
  }

  .authorize-button.google:hover {
    background-color: #3367d6;
  }

  .authorize-button.github:hover {
    background-color: #2ea043;
  }

  .authorize-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .mock-indicator {
    margin-top: 24px;
    padding: 8px;
    background-color: #f1f3f4;
    border-radius: 4px;
    font-size: 13px;
    color: #5f6368;
  }

  .github .mock-indicator {
    background-color: #1f2937;
    color: #8b949e;
  }

  .countdown {
    font-weight: 600;
    margin-top: 4px;
    color: #4285f4;
  }

  .github .countdown {
    color: #58a6ff;
  }

  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>