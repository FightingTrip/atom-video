<template>
  <div class="lazy-image relative overflow-hidden bg-[#272727]" :class="{ 'loaded': isLoaded }" :style="{
    paddingBottom: `${(height / width) * 100}%`,
  }">
    <!-- 占位图 -->
    <div v-if="!isLoaded" class="absolute inset-0 animate-pulse bg-[#272727]" :class="{ 'rounded-full': circle }"></div>

    <!-- 实际图片 -->
    <img :src="src" :alt="alt" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      :class="{
        'opacity-0': !isLoaded,
        'opacity-100': isLoaded,
        'rounded-full': circle,
      }" @load="handleLoad" @error="handleError" loading="lazy" />

    <!-- 错误状态 -->
    <div v-if="hasError" class="absolute inset-0 flex items-center justify-center bg-[#272727] text-gray-400"
      :class="{ 'rounded-full': circle }">
      <i class="fas fa-image text-2xl"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  interface Props {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    circle?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    alt: '',
    width: 16,
    height: 9,
    circle: false,
  });

  const isLoaded = ref(false);
  const hasError = ref(false);

  const handleLoad = () => {
    isLoaded.value = true;
    hasError.value = false;
  };

  const handleError = () => {
    isLoaded.value = false;
    hasError.value = true;
  };
</script>