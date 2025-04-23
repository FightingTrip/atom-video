<template>
  <div class="test-accounts-container">
    <h3 class="test-accounts-title">测试账号</h3>
    <p class="test-accounts-description">以下账号可用于测试不同角色的功能</p>

    <div class="accounts-table">
      <div class="accounts-table-header">
        <div class="accounts-table-cell">角色</div>
        <div class="accounts-table-cell">账号</div>
        <div class="accounts-table-cell">密码</div>
        <div class="accounts-table-cell">操作</div>
      </div>

      <div class="accounts-table-row" v-for="account in testAccounts" :key="account.email">
        <div class="accounts-table-cell">
          <span class="role-badge" :class="getRoleBadgeClass(account.role)">
            {{ account.role }}
          </span>
        </div>
        <div class="accounts-table-cell">{{ account.email }}</div>
        <div class="accounts-table-cell">{{ account.password }}</div>
        <div class="accounts-table-cell">
          <button class="quick-login-btn" @click="quickLogin(account)" :disabled="loading">
            {{ loading ? '登录中...' : '快速登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import { useToast } from '@/composables/useToast';

  const authStore = useAuthStore();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const loading = ref(false);

  // 测试账号数据
  const testAccounts = ref([
    {
      role: 'ADMIN',
      email: 'admin@atomvideo.com',
      password: 'Admin@123',
    },
    {
      role: 'CREATOR',
      email: 'creator@atomvideo.com',
      password: 'Password123',
    },
    {
      role: 'USER',
      email: 'user@atomvideo.com',
      password: 'Password123',
    },
  ]);

  // 根据角色获取徽章样式
  function getRoleBadgeClass(role: string) {
    switch (role) {
      case 'ADMIN':
        return 'role-admin';
      case 'CREATOR':
        return 'role-creator';
      case 'USER':
        return 'role-user';
      default:
        return '';
    }
  }

  // 快速登录
  async function quickLogin(account: { email: string; password: string; role: string }) {
    if (loading.value) return;
    loading.value = true;

    try {
      console.log(`尝试使用账号 ${account.email} 登录...`);
      const success = await authStore.login(account.email, account.password);

      if (success) {
        console.log(`登录成功，角色: ${account.role}`);
        showSuccess(`以 ${account.role} 角色登录成功`);
        router.push('/');
      } else {
        console.error('登录失败，认证返回false');
        showError('登录失败，请检查账号密码是否正确');
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      showError('登录时发生错误，请稍后重试');
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped>
  .test-accounts-container {
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 8px;
    margin-top: 20px;
    max-width: 600px;
    width: 100%;
  }

  .test-accounts-title {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: #f1f1f1;
  }

  .test-accounts-description {
    font-size: 0.9rem;
    margin-bottom: 16px;
    color: #aaa;
  }

  .accounts-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .accounts-table-header {
    display: flex;
    background-color: #333;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
  }

  .accounts-table-row {
    display: flex;
    border-bottom: 1px solid #333;
  }

  .accounts-table-row:last-child {
    border-bottom: none;
  }

  .accounts-table-cell {
    padding: 10px;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .role-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .role-admin {
    background-color: #f44336;
    color: white;
  }

  .role-creator {
    background-color: #2196f3;
    color: white;
  }

  .role-user {
    background-color: #4caf50;
    color: white;
  }

  .quick-login-btn {
    background-color: #424242;
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s;
  }

  .quick-login-btn:hover:not(:disabled) {
    background-color: #616161;
  }

  .quick-login-btn:disabled {
    background-color: #333;
    color: #666;
    cursor: not-allowed;
  }
</style>