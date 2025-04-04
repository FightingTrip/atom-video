<template>
  <n-dropdown trigger="click" :options="languageOptions" @select="handleLanguageChange">
    <n-button quaternary class="flex items-center gap-2">
      <i class="fas fa-globe"></i>
      <span class="hidden sm:inline">{{ currentLanguage.label }}</span>
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NButton, NDropdown } from 'naive-ui';

  const { locale } = useI18n();

  interface LanguageOption {
    key: string;
    label: string;
    icon: string;
  }

  const languages: LanguageOption[] = [
    { key: 'zh', label: '简体中文', icon: '🇨🇳' },
    { key: 'en', label: 'English', icon: '🇺🇸' }
  ];

  const languageOptions = computed(() => languages.map(lang => ({
    key: lang.key,
    label: () => h('div', { class: 'flex items-center gap-2' }, [
      h('span', lang.icon),
      h('span', lang.label)
    ])
  })));

  const currentLanguage = computed(() =>
    languages.find(lang => lang.key === locale.value) || languages[0]
  );

  const handleLanguageChange = (key: string) => {
    locale.value = key;
    localStorage.setItem('locale', key);
  };
</script>

<style scoped>
  .n-dropdown-option {
    padding: 8px 12px !important;
  }
</style>