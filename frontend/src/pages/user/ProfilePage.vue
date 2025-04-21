/**
* @file ProfilePage.vue
* @description 用户个人主页页面，使用 UserProfileComponent 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
      <p>加载用户资料中...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <n-result status="error" title="加载失败" :description="error">
        <template #footer>
          <n-button @click="fetchUserData">重试</n-button>
          <n-button @click="goHome">返回首页</n-button>
        </template>
      </n-result>
    </div>
    <UserProfileComponent v-else :user-id="userId" :profile-data="userData" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NSpin, NResult, NButton } from 'naive-ui';
  import UserProfileComponent from '@/components/business/user/UserProfileComponent.vue';
  import type { User } from '@/types';

  // 路由相关
  const route = useRoute();
  const router = useRouter();

  // 页面状态
  const loading = ref(true);
  const error = ref('');
  const userId = ref('');
  const userData = ref<User | null>(null);

  // 模拟用户数据
  const mockUsers: User[] = [
    {
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
    },
    {
      id: '2',
      username: 'admin_user',
      email: 'admin@example.com',
      nickname: '管理员',
      avatar: 'https://i.pravatar.cc/150?u=2',
      bio: '系统管理员账号，拥有所有权限。',
      verified: true,
      subscribers: 5000,
      subscribing: 10,
      totalViews: 100000,
      joinedAt: '2023-12-01T08:00:00Z',
      social: {
        github: 'https://github.com/admin-user',
      },
    },
    {
      id: '3',
      username: 'creator',
      email: 'creator@example.com',
      nickname: '内容创作者',
      avatar: 'https://i.pravatar.cc/150?u=3',
      bio: '专业视频创作者，分享有趣的科技内容和教程。',
      verified: true,
      subscribers: 25000,
      subscribing: 120,
      totalViews: 2500000,
      joinedAt: '2023-10-15T08:00:00Z',
      social: {
        website: 'https://creator-tech.com',
        github: 'https://github.com/tech-creator',
        twitter: 'https://twitter.com/tech-creator',
      },
    },
  ];

  // 获取用户数据
  const fetchUserData = async () => {
    loading.value = true;
    error.value = '';

    try {
      // 从路由参数中获取用户ID
      userId.value = route.params.id as string;

      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

      // 查找用户
      const user = userId.value ?
        mockUsers.find(u => u.id === userId.value) :
        mockUsers[0];

      if (!user) {
        throw new Error('用户不存在');
      }

      // 设置用户数据
      userData.value = user;
    } catch (err) {
      console.error('获取用户数据失败:', err);
      error.value = err instanceof Error ? err.message : '加载用户数据失败';
    } finally {
      loading.value = false;
    }
  };

  // 返回首页
  const goHome = () => {
    router.push('/');
  };

  // 监听路由参数变化，重新获取数据
  watch(() => route.params.id, (newId) => {
    if (newId && newId !== userId.value) {
      fetchUserData();
    }
  });

  // 页面初始化时获取数据
  onMounted(() => {
    fetchUserData();
  });
</script>

<style scoped>
  .profile-page {
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .loading-container,
  .error-container {
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
    .profile-page {
      padding: 12px;
    }
  }
</style>