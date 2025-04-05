<template>
  <footer class="footer py-3 px-6 border-t text-sm flex justify-between items-center">
    <div class="flex space-x-4">
      <router-link to="/terms" class="hover:underline">{{ t('footer.terms') }}</router-link>
      <router-link to="/privacy" class="hover:underline">{{ t('footer.privacy') }}</router-link>
      <router-link to="/help" class="hover:underline">{{ t('footer.help') }}</router-link>
    </div>

    <div class="flex space-x-4">
      <a href="https://github.com/zjtdzyx/atom-video" target="_blank" rel="noopener noreferrer" class="hover:underline">
        <i class="fab fa-github"></i>
      </a>
      <a href="https://twitter.com/atomvideo" target="_blank" rel="noopener noreferrer" class="hover:underline">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="mailto:yuxiangzhang040727@gmail.com" class="hover:underline">
        <i class="fas fa-envelope"></i>
      </a>
    </div>  

    <div class="flex items-center space-x-1">
      <span>© {{ currentYear }}</span>
      <router-link to="/" class="hover:underline">Atom Video</router-link>
      <span>{{ t('footer.rights') }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
  .footer {
    background-color: var(--surface-color);
    border-color: var(--border-color);
  }

  .footer a {
    color: var(--text-color);
    transition: color 0.2s ease;
  }

  .footer a:hover {
    color: var(--primary-color);
  }
</style>