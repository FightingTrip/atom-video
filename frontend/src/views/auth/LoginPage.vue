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
import Login from '@/components/business/auth/Login.vue'
</script>

<style scoped>
.login-page {
  min-height: 100vh;
}
</style> 