/**
* @file TheFooter.vue
* @description 页脚组件
* @features
* - 响应式布局
* - 主题适配
* - 链接导航
* - 版权信息
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <footer class="the-footer">
    <div class="footer-content">
      <!-- 链接区域 -->
      <div class="footer-links">
        <div class="link-group">
          <h3 class="link-title">关于我们</h3>
          <router-link to="/about" class="link-item">关于 Atom Video</router-link>
          <router-link to="/contact" class="link-item">联系我们</router-link>
          <router-link to="/careers" class="link-item">加入我们</router-link>
          <router-link to="/press" class="link-item">新闻中心</router-link>
        </div>

        <div class="link-group">
          <h3 class="link-title">帮助中心</h3>
          <router-link to="/help" class="link-item">帮助文档</router-link>
          <router-link to="/faq" class="link-item">常见问题</router-link>
          <router-link to="/feedback" class="link-item">意见反馈</router-link>
          <router-link to="/report" class="link-item">举报中心</router-link>
        </div>

        <div class="link-group">
          <h3 class="link-title">创作者</h3>
          <router-link to="/creator" class="link-item">创作者中心</router-link>
          <router-link to="/creator/guide" class="link-item">创作指南</router-link>
          <router-link to="/creator/studio" class="link-item">创作者工作室</router-link>
          <router-link to="/creator/analytics" class="link-item">数据分析</router-link>
        </div>

        <div class="link-group">
          <h3 class="link-title">法律</h3>
          <router-link to="/terms" class="link-item">服务条款</router-link>
          <router-link to="/privacy" class="link-item">隐私政策</router-link>
          <router-link to="/copyright" class="link-item">版权政策</router-link>
          <router-link to="/community" class="link-item">社区规范</router-link>
        </div>
      </div>

      <!-- 社交媒体 -->
      <div class="social-links">
        <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
          <n-icon size="20">
            <LogoGithubIcon />
          </n-icon>
        </a>
        <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
          <n-icon size="20">
            <LogoTwitterIcon />
          </n-icon>
        </a>
        <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
          <n-icon size="20">
            <LogoDiscordIcon />
          </n-icon>
        </a>
      </div>

      <!-- 版权信息 -->
      <div class="copyright">
        <p>© {{ currentYear }} Atom Video. All rights reserved.</p>
        <p class="copyright-links">
          <router-link to="/terms" class="copyright-link">服务条款</router-link>
          <span class="separator">·</span>
          <router-link to="/privacy" class="copyright-link">隐私政策</router-link>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NIcon } from 'naive-ui'
  import {
    LogoGithub as LogoGithubIcon,
    LogoTwitter as LogoTwitterIcon,
    LogoDiscord as LogoDiscordIcon
  } from '@vicons/ionicons5'

  const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
  .the-footer {
    background-color: var(--background-color);
    border-top: 1px solid var(--border-color);
    padding: var(--spacing-xl) 0 var(--spacing-lg);
    margin-top: auto;
  }

  .footer-content {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }

  .link-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .link-title {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: var(--spacing-xs);
  }

  .link-item {
    color: var(--text-color-secondary);
    text-decoration: none;
    font-size: var(--text-sm);
    transition: color var(--transition-duration);
  }

  .link-item:hover {
    color: var(--primary-color);
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  .social-link {
    color: var(--text-color-secondary);
    transition: color var(--transition-duration);
  }

  .social-link:hover {
    color: var(--primary-color);
  }

  .copyright {
    text-align: center;
    color: var(--text-color-secondary);
    font-size: var(--text-sm);
  }

  .copyright p {
    margin: 0;
  }

  .copyright-links {
    margin-top: var(--spacing-xs);
  }

  .copyright-link {
    color: var(--text-color-secondary);
    text-decoration: none;
    transition: color var(--transition-duration);
  }

  .copyright-link:hover {
    color: var(--primary-color);
  }

  .separator {
    margin: 0 var(--spacing-xs);
    color: var(--text-color-secondary);
  }

  @media (max-width: 1024px) {
    .footer-links {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .footer-links {
      grid-template-columns: 1fr;
    }

    .footer-content {
      padding: 0 var(--spacing-md);
    }
  }
</style>