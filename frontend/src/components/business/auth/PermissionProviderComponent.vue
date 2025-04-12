<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, readonly, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePermission } from '@/composables/usePermission';

// 权限相关上下文键名
export const PERMISSION_CONTEXT_KEY = Symbol('permission-context');

const authStore = useAuthStore();
const permissionContext = usePermission();

// 将权限上下文提供给子组件
provide(PERMISSION_CONTEXT_KEY, readonly(permissionContext));

// 监听路由变化时检查权限
onMounted(async () => {
  // 初始化时检查认证状态
  await authStore.checkAuth();
});

// 监听用户变化，更新权限状态
watch(
  () => authStore.user,
  async () => {
    // 用户变更时触发权限更新，这里不需要做额外操作
    // 因为usePermission中的计算属性会自动更新
    console.log('[PermissionProvider] User changed, permissions updated');
  }
);
</script>

<style scoped></style> 