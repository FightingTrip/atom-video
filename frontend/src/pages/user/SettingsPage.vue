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
  import { useUserStore } from '@/stores/user';
  import userProfileService from '@/services/user/profile';
  import type { User } from '@/types';

  // 用户状态
  const userStore = useUserStore();

  // 路由相关
  const router = useRouter();

  // 页面状态
  const loading = ref(true);
  const error = ref('');
  const isAuthenticated = ref(false);
  const userData = ref<User | null>(null);

  // 获取用户数据
  const fetchUserData = async () => {
    loading.value = true;
    error.value = '';

    try {
      // 模拟验证登录状态
      // 实际应用中，应该从身份验证服务获取当前登录用户信息
      const currentUserId = userStore.currentUser?.id || '1'; // 默认使用ID为1的用户
      const isLoggedIn = !!currentUserId;

      if (!isLoggedIn) {
        isAuthenticated.value = false;
        loading.value = false;
        return;
      }

      // 用户已登录，获取用户数据
      isAuthenticated.value = true;
      const user = await userProfileService.getUserProfile(currentUserId);

      if (!user) {
        throw new Error('获取用户数据失败');
      }

      userData.value = user;
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