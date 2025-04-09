/**
* @file TheFooter.vue
* @description 页脚组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <div class="footer-section">
          <a href="/about" class="footer-link">关于我们</a>
          <a href="/terms" class="footer-link">服务条款</a>
          <a href="/privacy" class="footer-link">隐私政策</a>
        </div>
        <div class="footer-section">
          <a href="https://github.com/FightingTrip/atom-video/" target="_blank" rel="noopener noreferrer" class="footer-link">
            <n-icon class="footer-icon">
              <LogoGithub />
            </n-icon>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="footer-link">
            <n-icon class="footer-icon">
              <LogoTwitter />
            </n-icon>
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" class="footer-link">
            <n-icon class="footer-icon">
              <ChatbubblesOutline />
            </n-icon>
          </a>
        </div>
      </div>
      <div class="footer-copyright">
        © {{ currentYear }} Atom Video. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { NIcon } from 'naive-ui';
  import { LogoGithub, LogoTwitter, ChatbubblesOutline } from '@vicons/ionicons5';

  const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
  .footer {
    background-color: var(--bg-color);
    border-top: 1px solid var(--border-color);
    height: 40px;
    width: 100%;
    z-index: 10;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 16px;
    height: 100%;
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .footer-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .footer-link {
    color: var(--text-color-secondary);
    text-decoration: none;
    font-size: 12px;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: var(--primary-color);
  }

  .footer-icon {
    width: 16px;
    height: 16px;
  }

  .footer-copyright {
    color: var(--text-color-secondary);
    font-size: 12px;
  }

  @media (max-width: 768px) {
    .footer {
      height: 32px;
    }

    .footer-content {
      padding: 0 12px;
    }

    .footer-section {
      gap: 8px;
    }

    .footer-link {
      font-size: 11px;
    }

    .footer-copyright {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    .footer-section:first-child {
      display: none;
    }
  }
</style>