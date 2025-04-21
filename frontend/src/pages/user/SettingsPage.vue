/**
* @file SettingsPage.vue
* @description 用户设置页面，使用 UserSettingsComponent 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="settings-page">
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
      <p>加载设置中...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <n-result status="error" title="加载失败" :description="error">
        <template #footer>
          <n-button @click="fetchUserData">重试</n-button>
          <n-button @click="goHome">返回首页</n-button>
        </template>
      </n-result>
    </div>
    <div v-else-if="!isAuthenticated" class="auth-container">
      <n-result status="warning" title="需要登录" description="请先登录以访问设置页面">
        <template #footer>
          <n-button type="primary" @click="goToLogin">去登录</n-button>
          <n-button @click="goHome">返回首页</n-button>
        </template>
      </n-result>
    </div>
    <UserSettingsComponent v-else :user-data="userData" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { NSpin, NResult, NButton } from 'naive-ui';
  import UserSettingsComponent from '@/components/business/user/UserSettingsComponent.vue';
  import type { User } from '@/types';

  // 路由相关
  const router = useRouter();

  // 页面状态
  const loading = ref(true);
  const error = ref('');
  const isAuthenticated = ref(false);
  const userData = ref<User | null>(null);

  // 模拟当前登录用户数据
  const mockCurrentUser: User = {
    id: '1',
    username: 'demo_user',
    email: 'demo@example.com',
    nickname: '演示用户',
    avatar: 'https://i.pravatar.cc/150?u=1',
    bio: '这是一个用于演示的账号，您可以在这里测试各种功能。',
    verified: true,
    subscribers: 1024,
    subscribing: 42,
    totalViews: 30240,
    joinedAt: '2024-01-15T08:00:00Z',
    social: {
      website: 'https://example.com',
      github: 'https://github.com/demo-user',
      twitter: 'https://twitter.com/demo-user',
    },
  };

  // 获取用户数据
  const fetchUserData = async () => {
    loading.value = true;
    error.value = '';

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

      // 模拟验证登录状态
      // 实际应用中，应该从身份验证服务获取当前登录用户信息
      const isLoggedIn = true; // 假设用户已登录

      if (!isLoggedIn) {
        isAuthenticated.value = false;
        return;
      }

      // 用户已登录
      isAuthenticated.value = true;
      userData.value = mockCurrentUser;
    } catch (err) {
      console.error('获取用户数据失败:', err);
      error.value = err instanceof Error ? err.message : '加载用户数据失败';
    } finally {
      loading.value = false;
    }
  };

  // 导航函数
  const goHome = () => router.push('/');
  const goToLogin = () => router.push('/auth/login');

  // 页面初始化时获取数据
  onMounted(() => {
    fetchUserData();
  });
</script>

<style scoped>
  .settings-page {
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .loading-container,
  .error-container,
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
  }

  .loading-container p {
    margin-top: 16px;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .settings-page {
      padding: 12px;
    }
  }
</style>