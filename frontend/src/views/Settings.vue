<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-8 py-12">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">系统设置</h1>
        <p class="text-gray-500 dark:text-gray-400">自定义您的使用体验</p>
      </div>

      <!-- 设置内容 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧导航 -->
        <div class="lg:col-span-1">
          <n-menu v-model:value="activeKey" :options="menuOptions"
            class="rounded-lg bg-white dark:bg-gray-800 shadow-sm" />
        </div>

        <!-- 右侧内容 -->
        <div class="lg:col-span-2">
          <n-card class="shadow-sm">
            <!-- 外观设置 -->
            <template v-if="activeKey === 'appearance'">
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-medium mb-4">主题设置</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="theme in themes" :key="theme.value"
                      class="relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200" :class="[
                        currentTheme === theme.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                      ]" @click="handleThemeChange(theme.value)">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="theme.iconBg">
                            <i :class="['fas', theme.icon, theme.iconColor]"></i>
                          </div>
                          <div>
                            <h4 class="font-medium">{{ theme.label }}</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ theme.description }}
                            </p>
                          </div>
                        </div>
                        <div v-if="currentTheme === theme.value" class="absolute top-2 right-2 text-blue-500">
                          <i class="fas fa-check-circle"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <n-divider />

                <div>
                  <h3 class="text-lg font-medium mb-4">界面设置</h3>
                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">紧凑模式</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          减小界面元素间距，显示更多内容
                        </p>
                      </div>
                      <n-switch v-model:value="uiSettings.compact" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">动画效果</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          控制界面过渡动画
                        </p>
                      </div>
                      <n-switch v-model:value="uiSettings.animations" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">自动播放</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          浏览时自动播放视频预览
                        </p>
                      </div>
                      <n-switch v-model:value="uiSettings.autoplay" />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 语言设置 -->
            <template v-if="activeKey === 'language'">
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-medium mb-4">界面语言</h3>
                  <n-select v-model:value="currentLanguage" :options="languageOptions" class="max-w-xs" />
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    选择您偏好的界面显示语言
                  </p>
                </div>

                <n-divider />

                <div>
                  <h3 class="text-lg font-medium mb-4">时区设置</h3>
                  <n-select v-model:value="currentTimezone" :options="timezoneOptions" class="max-w-xs" />
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    选择您所在的时区，以正确显示时间信息
                  </p>
                </div>
              </div>
            </template>

            <!-- 通知设置 -->
            <template v-if="activeKey === 'notifications'">
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-medium mb-4">通知偏好</h3>
                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">视频更新提醒</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          关注的创作者发布新视频时通知我
                        </p>
                      </div>
                      <n-switch v-model:value="notificationSettings.videoUpdates" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">评论回复</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          收到新的评论回复时通知我
                        </p>
                      </div>
                      <n-switch v-model:value="notificationSettings.comments" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">系统通知</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          接收系统更新和维护相关通知
                        </p>
                      </div>
                      <n-switch v-model:value="notificationSettings.system" />
                    </div>
                  </div>
                </div>

                <n-divider />

                <div>
                  <h3 class="text-lg font-medium mb-4">通知方式</h3>
                  <div class="space-y-4">
                    <n-checkbox v-model:checked="notificationMethods.email">
                      电子邮件通知
                    </n-checkbox>
                    <n-checkbox v-model:checked="notificationMethods.push">
                      浏览器推送通知
                    </n-checkbox>
                    <n-checkbox v-model:checked="notificationMethods.site">
                      站内消息通知
                    </n-checkbox>
                  </div>
                </div>
              </div>
            </template>

            <!-- 隐私设置 -->
            <template v-if="activeKey === 'privacy'">
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-medium mb-4">数据收集</h3>
                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">使用数据分析</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          允许收集使用数据以改善服务
                        </p>
                      </div>
                      <n-switch v-model:value="privacySettings.analytics" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">个性化推荐</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          根据观看历史推荐内容
                        </p>
                      </div>
                      <n-switch v-model:value="privacySettings.personalization" />
                    </div>
                  </div>
                </div>

                <n-divider />

                <div>
                  <h3 class="text-lg font-medium mb-4">隐私控制</h3>
                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">观看历史</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          记录观看过的视频
                        </p>
                      </div>
                      <n-switch v-model:value="privacySettings.watchHistory" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium mb-1">搜索历史</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          保存搜索记录
                        </p>
                      </div>
                      <n-switch v-model:value="privacySettings.searchHistory" />
                    </div>
                  </div>
                </div>

                <n-divider />

                <div>
                  <h3 class="text-lg font-medium mb-4">数据管理</h3>
                  <div class="space-y-4">
                    <n-button secondary @click="handleClearHistory">
                      <template #icon>
                        <i class="fas fa-eraser mr-2"></i>
                      </template>
                      清除浏览记录
                    </n-button>
                    <n-button secondary @click="handleExportData">
                      <template #icon>
                        <i class="fas fa-download mr-2"></i>
                      </template>
                      导出个人数据
                    </n-button>
                  </div>
                </div>
              </div>
            </template>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, h } from 'vue'
  import { useMessage } from 'naive-ui'
  import { useThemeStore } from '../stores/theme'
  import { useI18nStore } from '../stores/i18n'
  import {
    NCard,
    NMenu,
    NSwitch,
    NDivider,
    NSelect,
    NCheckbox,
    NButton,
    NIcon
  } from 'naive-ui'
  import {
    ColorPalette as IconPalette,
    Language as IconLanguage,
    Notifications as IconNotification,
    Shield as IconSecurity
  } from '@vicons/ionicons5'

  const message = useMessage()
  const themeStore = useThemeStore()
  const i18nStore = useI18nStore()

  // 当前激活的菜单项
  const activeKey = ref('appearance')

  // 菜单选项
  const menuOptions = [
    {
      label: '外观设置',
      key: 'appearance',
      icon: renderIcon(IconPalette)
    },
    {
      label: '语言和地区',
      key: 'language',
      icon: renderIcon(IconLanguage)
    },
    {
      label: '通知设置',
      key: 'notifications',
      icon: renderIcon(IconNotification)
    },
    {
      label: '隐私设置',
      key: 'privacy',
      icon: renderIcon(IconSecurity)
    }
  ]

  // 主题设置
  const currentTheme = ref(themeStore.theme)
  const themes = [
    {
      label: '跟随系统',
      value: 'system',
      icon: 'fa-desktop',
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-300',
      description: '自动适应系统主题'
    },
    {
      label: '浅色模式',
      value: 'light',
      icon: 'fa-sun',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      description: '始终使用浅色主题'
    },
    {
      label: '深色模式',
      value: 'dark',
      icon: 'fa-moon',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      description: '始终使用深色主题'
    }
  ]

  // 界面设置
  const uiSettings = ref({
    compact: false,
    animations: true,
    autoplay: true
  })

  // 语言设置
  const currentLanguage = ref(i18nStore.locale)
  const languageOptions = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
    { label: '日本語', value: 'ja-JP' }
  ]

  // 时区设置
  const currentTimezone = ref('Asia/Shanghai')
  const timezoneOptions = [
    { label: '(GMT+08:00) 北京', value: 'Asia/Shanghai' },
    { label: '(GMT+09:00) 东京', value: 'Asia/Tokyo' },
    { label: '(GMT+00:00) 伦敦', value: 'Europe/London' }
  ]

  // 通知设置
  const notificationSettings = ref({
    videoUpdates: true,
    comments: true,
    system: true
  })

  const notificationMethods = ref({
    email: true,
    push: false,
    site: true
  })

  // 隐私设置
  const privacySettings = ref({
    analytics: true,
    personalization: true,
    watchHistory: true,
    searchHistory: true
  })

  // 处理主题切换
  const handleThemeChange = (theme: string) => {
    currentTheme.value = theme
    themeStore.setTheme(theme)
    message.success(`已切换到${themes.find(t => t.value === theme)?.label}`)
  }

  // 处理语言切换
  const handleLanguageChange = (locale: string) => {
    currentLanguage.value = locale
    i18nStore.setLocale(locale)
    message.success(`已切换到${languageOptions.find(l => l.value === locale)?.label}`)
  }

  // 处理清除历史记录
  const handleClearHistory = () => {
    message.success('历史记录已清除')
  }

  // 处理导出数据
  const handleExportData = () => {
    message.success('数据导出请求已提交，稍后将发送到您的邮箱')
  }

  // 初始化设置
  onMounted(() => {
    // 从本地存储或API加载设置
    currentTheme.value = themeStore.theme
    currentLanguage.value = i18nStore.locale
  })

  function renderIcon(icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
</script>

<style scoped>
  :deep(.n-menu) {
    --n-item-height: 54px;
    border-radius: 8px;
    overflow: hidden;
    background-color: rgb(17, 24, 39) !important;
  }

  :deep(.n-menu-item) {
    @apply transition-colors duration-200;
    padding: 12px 16px !important;
    margin: 4px !important;
  }

  :deep(.n-menu-item-content) {
    color: rgb(209, 213, 219) !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    display: flex !important;
    align-items: center !important;
  }

  :deep(.n-menu-item-content__icon) {
    width: 18px !important;
    height: 18px !important;
    margin-right: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: rgb(156, 163, 175) !important;
  }

  :deep(.n-icon) {
    width: 18px !important;
    height: 18px !important;
  }

  :deep(.n-menu-item:hover) {
    @apply bg-gray-800;
    border-radius: 6px;

    .n-menu-item-content__icon {
      color: rgb(209, 213, 219) !important;
    }
  }

  :deep(.n-menu-item-content--selected) {
    background-color: rgb(30, 41, 59) !important;
    color: rgb(255, 255, 255) !important;
    font-weight: 500;
    border-radius: 6px;

    .n-menu-item-content__icon {
      color: rgb(96, 165, 250) !important;
    }
  }

  :deep(.n-card) {
    transition: all 0.3s ease;
    border-radius: 8px;
    background-color: rgb(17, 24, 39) !important;
  }

  :deep(.n-button) {
    transition: all 0.2s ease;
    border-radius: 6px;
  }

  :deep(.n-switch) {
    --n-button-border-radius: 999px;
  }

  :deep(.n-select) {
    width: 100%;
    max-width: 320px;
  }

  .theme-card {
    @apply relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200;
    background-color: rgb(30, 41, 59) !important;
    border-color: rgb(55, 65, 81) !important;

    &:hover {
      border-color: rgb(96, 165, 250) !important;
      transform: translateY(-2px);
    }

    &.active {
      border-color: rgb(96, 165, 250) !important;
      background-color: rgba(96, 165, 250, 0.1) !important;
    }
  }

  .theme-icon {
    @apply w-10 h-10 rounded-full flex items-center justify-center;

    &.system {
      background-color: rgb(55, 65, 81) !important;
      color: rgb(209, 213, 219) !important;
    }

    &.light {
      background-color: rgb(251, 191, 36) !important;
      color: rgb(120, 53, 15) !important;
    }

    &.dark {
      background-color: rgb(79, 70, 229) !important;
      color: rgb(199, 210, 254) !important;
    }
  }

  /* 修复文字颜色对比度 */
  h1,
  h2,
  h3,
  h4 {
    color: rgb(255, 255, 255) !important;
  }

  p,
  .text-description {
    color: rgb(209, 213, 219) !important;
  }

  .text-muted {
    color: rgb(156, 163, 175) !important;
  }
</style>