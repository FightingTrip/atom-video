<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#272727]">
      <i class="fas fa-globe text-xl"></i>
      <span>{{ currentLanguageLabel }}</span>
      <i class="fas fa-chevron-down text-sm"></i>
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-lg py-2 z-50">
      <button v-for="lang in languages" :key="lang.code" @click="selectLanguage(lang.code)"
        class="w-full px-4 py-2 text-left hover:bg-[#3f3f3f] flex items-center gap-2"
        :class="{ 'text-blue-500': currentLanguage === lang.code }">
        <i v-if="currentLanguage === lang.code" class="fas fa-check text-sm"></i>
        <span v-else class="w-4"></span>
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { setLanguage } from '@/plugins/i18n';

  const { locale } = useI18n();
  const isOpen = ref(false);

  const languages = [
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en-US', label: 'English' },
  ];

  const currentLanguage = computed(() => locale.value);
  const currentLanguageLabel = computed(() => {
    return languages.find(lang => lang.code === currentLanguage.value)?.label;
  });

  const selectLanguage = (lang: string) => {
    setLanguage(lang as 'en-US' | 'zh-CN');
    isOpen.value = false;
  };

  // 点击外部关闭下拉菜单
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>