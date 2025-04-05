/**
* @file FontLoader.vue
* @description 字体加载器组件，用于异步加载自定义字体
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 异步加载字体文件
* - 加载进度显示
* - 加载状态管理
* - 错误处理
* - 重试机制
* - 响应式布局
* - 黑白主题适配
*/

<!--
  FontLoader.vue
  字体加载组件
  功能：
  - 字体文件加载
  - 加载状态显示
  - 错误处理
  - 加载进度显示
-->
<template>
  <div class="font-loader">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <n-spin size="small" />
      <p class="loading-text">加载字体中...</p>
      <n-progress type="line" :percentage="progress" :processing="true" :indicator-placement="'inside'" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <n-icon size="24">
        <WarningIcon />
      </n-icon>
      <p class="error-text">{{ error }}</p>
      <n-button @click="retry">
        重试
      </n-button>
    </div>

    <!-- 加载完成 -->
    <div v-else class="success-state">
      <n-icon size="24">
        <CheckmarkIcon />
      </n-icon>
      <p class="success-text">字体加载完成</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { NIcon, NSpin, NProgress, NButton } from 'naive-ui'
  import {
    Warning as WarningIcon,
    Checkmark as CheckmarkIcon
  } from '@vicons/ionicons5'

  const props = defineProps<{
    fontFamily: string
    fontUrl: string
  }>()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const progress = ref(0)

  const loadFont = async () => {
    try {
      loading.value = true
      error.value = null
      progress.value = 0

      // 创建字体加载对象
      const font = new FontFace(props.fontFamily, `url(${props.fontUrl})`)

      // 监听加载进度
      const xhr = new XMLHttpRequest()
      xhr.open('GET', props.fontUrl)
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          progress.value = Math.round((event.loaded / event.total) * 100)
        }
      }

      // 加载字体
      await font.load()
      document.fonts.add(font)

      loading.value = false
    } catch (err) {
      error.value = '字体加载失败'
      console.error('Font loading error:', err)
      loading.value = false
    }
  }

  const retry = () => {
    loadFont()
  }

  onMounted(() => {
    loadFont()
  })
</script>

<style scoped>
  .font-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--background-color);
    border-radius: var(--border-radius);
  }

  .loading-state,
  .error-state,
  .success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .loading-text,
  .error-text,
  .success-text {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-color);
  }

  .error-state {
    color: var(--error-color);
  }

  .success-state {
    color: var(--success-color);
  }

  .n-progress {
    width: 100%;
    max-width: 200px;
  }
</style>