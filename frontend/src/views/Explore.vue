<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">{{ t('explore.title') }}</h1>

    <!-- 探索页面内容 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        {{ t('explore.description') }}
      </p>

      <!-- 示例内容 - 可以根据需要扩展 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div v-for="category in categories" :key="category.id"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-3">
            <i :class="['fas', category.icon, 'text-xl text-blue-500 mr-3']"></i>
            <h3 class="text-lg font-medium">{{ category.name }}</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">{{ category.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // 示例分类数据
  const categories = ref([
    {
      id: 1,
      name: t('explore.categories.webDev'),
      icon: 'fa-code',
      description: t('explore.categories.webDevDesc')
    },
    {
      id: 2,
      name: t('explore.categories.mobileDev'),
      icon: 'fa-mobile-alt',
      description: t('explore.categories.mobileDevDesc')
    },
    {
      id: 3,
      name: t('explore.categories.dataScience'),
      icon: 'fa-chart-bar',
      description: t('explore.categories.dataScienceDesc')
    },
    {
      id: 4,
      name: t('explore.categories.devOps'),
      icon: 'fa-server',
      description: t('explore.categories.devOpsDesc')
    },
    {
      id: 5,
      name: t('explore.categories.gameDev'),
      icon: 'fa-gamepad',
      description: t('explore.categories.gameDevDesc')
    },
    {
      id: 6,
      name: t('explore.categories.machineLearning'),
      icon: 'fa-brain',
      description: t('explore.categories.machineLearningDesc')
    }
  ])
</script>