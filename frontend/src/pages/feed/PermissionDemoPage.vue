<template>
  <div class="permission-demo-container">
    <n-card title="权限控制演示" class="demo-card">
      <n-space vertical size="large">
        <!-- 当前用户信息 -->
        <n-card title="当前用户信息" size="small">
          <n-descriptions bordered>
            <n-descriptions-item label="用户名">
              {{ authStore.username }}
            </n-descriptions-item>
            <n-descriptions-item label="角色">
              {{ authStore.userRole }}
            </n-descriptions-item>
            <n-descriptions-item label="登录状态">
              {{ authStore.isAuthenticated ? '已登录' : '未登录' }}
            </n-descriptions-item>
            <n-descriptions-item label="管理员">
              {{ authStore.isAdmin ? '是' : '否' }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>

        <!-- 权限指令演示 -->
        <n-card title="权限指令演示" size="small">
          <n-space vertical>
            <div>
              <n-text>1. v-permission 指令 (对特定角色可见):</n-text>
              <div class="directive-demo">
                <div v-permission="'ADMIN'" class="demo-box admin">
                  只对管理员可见
                </div>
                <div v-permission="'CREATOR'" class="demo-box creator">
                  只对创作者可见
                </div>
                <div v-permission="'USER'" class="demo-box user">
                  只对用户可见
                </div>
                <div v-permission="['ADMIN', 'CREATOR']" class="demo-box admin-creator">
                  对管理员和创作者可见
                </div>
              </div>
            </div>

            <div>
              <n-text>2. v-permission.not 取反指令 (对特定角色不可见):</n-text>
              <div class="directive-demo">
                <div v-permission.not="'ADMIN'" class="demo-box not-admin">
                  对管理员不可见
                </div>
                <div v-permission.not="'CREATOR'" class="demo-box not-creator">
                  对创作者不可见
                </div>
              </div>
            </div>

            <div>
              <n-text>3. v-permission-btn 权限按钮指令:</n-text>
              <div class="directive-demo">
                <n-button v-permission-btn="'ADMIN'" type="primary">
                  管理员按钮
                </n-button>
                <n-button v-permission-btn="'CREATOR'" type="info">
                  创作者按钮
                </n-button>
                <n-button v-permission-btn="'USER'" type="success">
                  用户按钮
                </n-button>
              </div>
            </div>
          </n-space>
        </n-card>

        <!-- 权限组件演示 -->
        <n-card title="权限组件演示" size="small">
          <n-space vertical>
            <div>
              <n-text>1. PermissionGuardComponent 组件:</n-text>
              <div class="component-demo">
                <permission-guard-component roles="ADMIN">
                  <n-alert type="success" title="管理员内容">
                    此内容仅对管理员可见
                  </n-alert>
                  
                  <template #fallback>
                    <n-alert type="warning">
                      您需要管理员权限才能查看此内容
                    </n-alert>
                  </template>
                </permission-guard-component>

                <permission-guard-component :roles="['CREATOR', 'ADMIN']">
                  <n-alert type="info" title="创作者内容" class="mt-3">
                    此内容对创作者和管理员可见
                  </n-alert>
                  
                  <template #fallback>
                    <n-alert type="warning" class="mt-3">
                      您需要创作者或管理员权限才能查看此内容
                    </n-alert>
                  </template>
                </permission-guard-component>
              </div>
            </div>

            <div>
              <n-text>2. PermissionButtonComponent 组件:</n-text>
              <div class="component-demo">
                <permission-button-component 
                  roles="ADMIN" 
                  type="primary"
                  icon="AdminIcon"
                >
                  管理员按钮
                </permission-button-component>
                
                <permission-button-component 
                  roles="CREATOR" 
                  type="info"
                  icon="CreateIcon"
                >
                  创作者按钮
                </permission-button-component>
                
                <permission-button-component 
                  roles="USER" 
                  type="success"
                  icon="UserIcon"
                >
                  用户按钮
                </permission-button-component>
                
                <permission-button-component 
                  :roles="['ADMIN', 'CREATOR']" 
                  type="warning"
                  no-permission-action="disable"
                >
                  禁用模式按钮
                </permission-button-component>
              </div>
            </div>
          </n-space>
        </n-card>

        <!-- 权限切换测试 -->
        <n-card title="角色模拟" size="small">
          <n-space>
            <n-button @click="simulateRole('ADMIN')" type="primary">
              模拟管理员
            </n-button>
            <n-button @click="simulateRole('CREATOR')" type="info">
              模拟创作者
            </n-button>
            <n-button @click="simulateRole('USER')" type="success">
              模拟普通用户
            </n-button>
            <n-button @click="simulateRole('GUEST')" type="warning">
              模拟游客
            </n-button>
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import PermissionGuardComponent from '@/components/business/auth/PermissionGuardComponent.vue';
import PermissionButtonComponent from '@/components/business/auth/PermissionButtonComponent.vue';
import { NCard, NSpace, NButton, NText, NAlert, NDescriptions, NDescriptionsItem } from 'naive-ui';

const authStore = useAuthStore();
const toast = useToast();

// 模拟不同角色
function simulateRole(role: string) {
  // 登出当前用户
  if (authStore.isAuthenticated) {
    authStore.logout();
  }
  
  // 模拟不同角色
  if (role === 'GUEST') {
    toast.success('已切换为游客模式');
    return;
  }
  
  // 使用demo模式模拟不同角色
  authStore.setUser({
    id: 'demo-user',
    username: role.toLowerCase(),
    email: `${role.toLowerCase()}@atomvideo.com`,
    avatar: `https://i.pravatar.cc/150?img=${role === 'ADMIN' ? 1 : role === 'CREATOR' ? 2 : 3}`,
    verified: true,
    nickname: `${role} User`,
    bio: `${role} simulation account`,
    subscribers: 0,
    subscribing: 0,
    totalViews: 0,
    joinedAt: new Date().toISOString(),
  });
  
  authStore.setToken('demo-token');
  authStore.enableDemoMode();
  
  toast.success(`已切换为${role === 'ADMIN' ? '管理员' : role === 'CREATOR' ? '创作者' : '普通用户'}模式`);
}
</script>

<style scoped>
.permission-demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.demo-card {
  margin-bottom: 24px;
}

.directive-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
}

.demo-box {
  padding: 12px;
  border-radius: 4px;
  min-width: 150px;
  text-align: center;
}

.admin {
  background-color: #f44336;
  color: white;
}

.creator {
  background-color: #2196f3;
  color: white;
}

.user {
  background-color: #4caf50;
  color: white;
}

.admin-creator {
  background-color: #9c27b0;
  color: white;
}

.not-admin {
  background-color: #ff9800;
  color: white;
}

.not-creator {
  background-color: #607d8b;
  color: white;
}

.component-demo {
  margin-top: 12px;
  margin-bottom: 12px;
}

.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
}

.mt-3 {
  margin-top: 12px;
}
</style> 