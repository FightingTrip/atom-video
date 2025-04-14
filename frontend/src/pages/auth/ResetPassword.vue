<template>
  <div class="reset-password-page">
    <div class="container">
      <div class="reset-password-form-container">
        <div class="logo-container">
          <router-link to="/">
            <img src="@/assets/logo.png" alt="Atom Video Logo" class="logo" />
          </router-link>
        </div>
        
        <reset-password-form />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResetPasswordForm from '@/components/business/auth/ResetPasswordForm.vue';
</script>

<style scoped>
.reset-password-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-background);
}

.container {
  width: 100%;
  max-width: 460px;
  padding: 0 20px;
}

.reset-password-form-container {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.logo-container {
  text-align: center;
  padding: 24px 0;
}

.logo {
  height: 40px;
}
</style>