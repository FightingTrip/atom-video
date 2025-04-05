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
        © {{ currentYear }} Atom Video. All rights reserved.
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

        <!-- 切换按钮 -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
            <button @click="currentView = 'login'" :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              currentView === 'login'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            ]">
              {{ t('auth.signIn') }}
            </button>
            <button @click="currentView = 'register'" :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              currentView === 'register'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            ]">
              {{ t('auth.signUp') }}
            </button>
          </div>
        </div>

        <!-- 动态组件 -->
        <component :is="currentView === 'login' ? LoginForm : RegisterForm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import LoginForm from './Login.vue'
  import RegisterForm from './Register.vue'

  const { t } = useI18n()
  const currentView = ref('login')
  const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
  .auth-background {
    background-color: var(--surface-color);
  }

  .brand-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  }

  .brand-logo {
    color: var(--primary-color);
  }

  .form-section {
    background-color: var(--surface-color);
  }

  .auth-input {
    @apply w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-colors;
    background-color: var(--input-bg);
    border-color: var(--border-color);
    color: var(--text-color);
  }

  .auth-input:focus {
    border-color: var(--primary-color);
  }

  .social-btn {
    @apply border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
    background-color: var(--surface-color);
    border-color: var(--border-color);
    color: var(--text-color);
  }
</style>