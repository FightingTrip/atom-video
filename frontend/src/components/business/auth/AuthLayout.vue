/**
* @file AuthLayout.vue
* @description 认证页面的布局组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="auth-layout">
    <nav class="auth-nav">
      <div class="auth-nav-container">
        <div class="auth-nav-content">
          <div class="auth-logo">
            <router-link to="/">
              <img class="auth-logo-img" src="/logo-192.png" alt="Atom Video" />
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
  // 认证页面的布局组件
</script>

<style scoped>
  .auth-layout {
    min-height: 100vh;
    background-color: var(--primary-bg);
  }

  .auth-nav {
    background-color: var(--secondary-bg);
    box-shadow: var(--shadow-sm);
  }

  .auth-nav-container {
    max-width: var(--container-lg);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .auth-nav-content {
    display: flex;
    justify-content: space-between;
    height: 4rem;
  }

  .auth-logo {
    display: flex;
    align-items: center;
  }

  .auth-logo-img {
    height: 2rem;
    width: auto;
  }
</style>