/**
* @file LoginPage.vue
* @description 登录页面，使用 Login 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="login-page">
    <Login />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import Login from '@/components/business/auth/Login.vue'

  onMounted(() => {
    console.log('[LoginPage] 组件已挂载')
  })
</script>

<style scoped>
  .login-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000;
    color: var(--text-primary);
  }
</style>