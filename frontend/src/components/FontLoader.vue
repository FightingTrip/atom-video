<template>
  <div class="font-loader" aria-hidden="true">
    <!-- 预加载字体的隐藏文本 -->
    <div class="opacity-0 h-0 overflow-hidden">
      <span class="font-normal">Aa</span>
      <span class="font-medium">Aa</span>
      <span class="font-semibold">Aa</span>
      <span class="font-bold">Aa</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  // 字体文件 URL
  const fonts = {
    normal: '/fonts/inter-regular.woff2',
    medium: '/fonts/inter-medium.woff2',
    semibold: '/fonts/inter-semibold.woff2',
    bold: '/fonts/inter-bold.woff2',
  };

  // 预加载字体
  const preloadFonts = () => {
    Object.values(fonts).forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  onMounted(() => {
    // 使用 requestIdleCallback 在浏览器空闲时加载字体
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadFonts);
    } else {
      setTimeout(preloadFonts, 1);
    }
  });
</script>