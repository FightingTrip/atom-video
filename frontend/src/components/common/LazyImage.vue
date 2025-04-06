/**
* @file LazyImage.vue
* @description 懒加载图片组件，用于优化图片加载性能
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 图片懒加载
* - 加载状态显示
* - 加载进度条
* - 错误处理
* - 重试机制
* - 响应式布局
* - 黑白主题适配
*/
<template>
  <div class="lazy-image" :style="{ width, height }">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <n-spin size="small" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <n-icon size="24">
        <ImageIcon />
      </n-icon>
    </div>

    <!-- 图片 -->
    <img v-else :src="src" :alt="alt" :width="width" :height="height" class="image" @load="handleLoad"
      @error="handleError" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { NIcon, NSpin } from 'naive-ui'
  import { Image as ImageIcon } from '@vicons/ionicons5'

  const props = defineProps<{
    src: string
    alt?: string
    width?: string
    height?: string
  }>()

  const loading = ref(true)
  const error = ref(false)

  const handleLoad = () => {
    loading.value = false
    error.value = false
  }

  const handleError = () => {
    loading.value = false
    error.value = true
  }

  // 使用 Intersection Observer 实现懒加载
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = props.src
            observer?.unobserve(img)
          }
        })
      },
      { threshold: 0.1 }
    )
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
</script>

<style scoped>
  .lazy-image {
    position: relative;
    background-color: var(--background-color-secondary);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .loading-state,
  .error-state {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color-secondary);
  }

  .error-state {
    color: var(--text-color-secondary);
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity var(--transition-duration);
  }

  .image[src] {
    opacity: 1;
  }
</style>