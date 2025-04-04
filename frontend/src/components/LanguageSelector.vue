<template>
  <div class="relative" ref="selectorRef">
    <button class="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      @click="isOpen = !isOpen">
      <i class="fas fa-globe text-gray-700 dark:text-gray-200"></i>
      <span class="text-gray-700 dark:text-gray-200">{{ currentLanguage }}</span>
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
      <button v-for="lang in languages" :key="lang.code" @click="handleLanguageChange(lang.code)"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();
  const isOpen = ref(false);
  const selectorRef = ref<HTMLElement | null>(null);

  const languages = [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' },
  ];

  const currentLanguage = computed(() => {
    return languages.find(lang => lang.code === locale.value)?.name || '简体中文';
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const handleLanguageChange = (code: string) => {
    locale.value = code;
    isOpen.value = false;
  };
</script>