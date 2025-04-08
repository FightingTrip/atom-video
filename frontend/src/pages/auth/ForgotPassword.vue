<!-- 忘记密码页面 -->
<template>
  <div class="forgot-password-page">
    <ForgotPassword />
  </div>
</template>

<script setup lang="ts">
  import ForgotPassword from '@/components/business/auth/ForgotPassword.vue';
</script>

<style scoped>
  .forgot-password-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>