/**
* @file RegisterPage.vue
* @description 注册页面，使用 Register 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="register-page">
    <Register />
  </div>
</template>

<script setup lang="ts">
  import Register from '@/components/business/auth/Register.vue'
</script>

<style scoped>
  .register-page {
    min-height: 100vh;
  }
</style>