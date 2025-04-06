/**
* @file LoginPage.vue
* @description 登录页面，使用 Login 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="login-page">
    <div class="debug-info">LoginPage组件已加载 - {{ new Date().toLocaleTimeString() }}</div>
    <Login />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeMount, onBeforeUnmount, getCurrentInstance } from 'vue'
  import Login from '@/components/business/auth/Login.vue'

  // 调试信息
  console.log('[LoginPage] 组件定义阶段', { importPath: '@/components/business/auth/Login.vue', componentExists: !!Login })

  onBeforeMount(() => {
    console.log('[LoginPage] onBeforeMount 触发')
  })

  onMounted(() => {
    console.log('[LoginPage] onMounted 触发', {
      componentInstance: getCurrentInstance(),
      loginComponent: Login
    })
  })

  onBeforeUnmount(() => {
    console.log('[LoginPage] onBeforeUnmount 触发')
  })
</script>

<style scoped>
  .login-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .debug-info {
    position: fixed;
    top: 100px;
    left: 0;
    background: rgba(255, 0, 0, 0.7);
    color: white;
    padding: 10px;
    z-index: 9999;
    font-size: 14px;
  }
</style>