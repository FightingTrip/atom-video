<template>
  <div class="animate-pulse" :class="{
    'rounded-full': type === 'circle',
    'rounded-lg': type === 'rect',
    'rounded-xl': type === 'video',
  }" :style="{
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }">
    <div class="w-full h-full bg-[#272727]" :class="{
      'rounded-full': type === 'circle',
      'rounded-lg': type === 'rect',
      'rounded-xl': type === 'video',
    }"></div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    type?: 'circle' | 'rect' | 'video';
    width?: number | string;
    height?: number | string;
  }

  withDefaults(defineProps<Props>(), {
    type: 'rect',
    width: '100%',
    height: '100%',
  });
</script>