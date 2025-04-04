<template>
  <footer class="footer py-3 px-6 border-t text-sm flex justify-between items-center">
    <div class="flex space-x-4">
      <a href="#" class="hover:underline">{{ t('footer.terms') }}</a>
      <a href="#" class="hover:underline">{{ t('footer.privacy') }}</a>
      <a href="#" class="hover:underline">{{ t('footer.help') }}</a>
    </div>

    <div class="flex space-x-4">
      <a href="#" class="hover:underline">
        <i class="fab fa-weixin"></i>
      </a>
      <a href="#" class="hover:underline">
        <i class="fab fa-github"></i>
      </a>
      <a href="#" class="hover:underline">
        <i class="fab fa-twitter"></i>
      </a>
    </div>

    <div>
      © 2025 Atom Video. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>