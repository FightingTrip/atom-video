/**
* @file DefaultLayout.vue
* @description 默认布局组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="default-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <nav class="nav-container">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/logo.svg" alt="Atom Video" />
          </router-link>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/explore" class="nav-link">发现</router-link>
          <router-link to="/trending" class="nav-link">趋势</router-link>
          <router-link to="/upload" class="nav-link">上传</router-link>
        </div>
        <div class="user-actions">
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="user-profile">
              <img :src="userAvatar" :alt="username" class="avatar" />
              <span class="username">{{ username }}</span>
            </router-link>
            <button @click="handleLogout" class="logout-btn">退出</button>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </template>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <slot></slot>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>Atom Video 是一个现代化的视频分享平台</p>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><router-link to="/about">关于</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
            <li><router-link to="/terms">服务条款</router-link></li>
            <li><router-link to="/privacy">隐私政策</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>关注我们</h3>
          <div class="social-links">
            <a href="#" target="_blank" rel="noopener">Twitter</a>
            <a href="#" target="_blank" rel="noopener">Facebook</a>
            <a href="#" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Atom Video. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';

  const router = useRouter();
  const userStore = useUserStore();

  // 计算属性
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  const username = computed(() => userStore.currentUser?.username || '');
  const userAvatar = computed(() => userStore.currentUser?.avatar || '');
  const currentYear = computed(() => new Date().getFullYear());

  // 方法
  const handleLogout = async () => {
    try {
      await userStore.logout();
      router.push('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };
</script>

<style scoped>
  .default-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    z-index: 100;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo img {
    height: 32px;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: var(--primary-color);
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--text-color);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .main-content {
    flex: 1;
    margin-top: 64px;
    padding: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }

  .footer {
    background-color: var(--bg-color);
    border-top: 1px solid var(--border-color);
    padding: 3rem 0 1rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .footer-section h3 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
  }

  .footer-section ul li {
    margin-bottom: 0.5rem;
  }

  .footer-section a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-section a:hover {
    color: var(--primary-color);
  }

  .social-links {
    display: flex;
    gap: 1rem;
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 2rem auto 0;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid var(--border-color);
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }

    .footer-content {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .social-links {
      justify-content: center;
    }
  }
</style>