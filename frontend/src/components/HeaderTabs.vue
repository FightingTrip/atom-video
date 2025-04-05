<template>
  <div class="header-tabs">
    <!-- 主要分类 -->
    <n-tabs v-model:value="selectedCategory" type="line" :justify-content="'start'"
      @update:value="handleCategoryChange">
      <n-tab name="all">{{ t('category.all') }}</n-tab>
      <n-tab v-for="category in categories" :key="category.value" :name="category.value">
        {{ category.label }}
      </n-tab>
    </n-tabs>

    <!-- 子分类 -->
    <div v-if="selectedCategory !== 'all'" class="subcategories mt-2">
      <n-space>
        <n-tag v-for="tag in currentSubcategories" :key="tag.value"
          :type="selectedTags.includes(tag.value) ? 'primary' : 'default'" :bordered="false" size="small" round
          clickable @click="toggleTag(tag.value)">
          {{ tag.label }}
        </n-tag>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { NTabs, NTab, NSpace, NTag } from 'naive-ui'

  const router = useRouter()
  const { t } = useI18n()

  const selectedCategory = ref('all')
  const selectedTags = ref<string[]>([])

  // 主分类
  const categories = [
    {
      label: t('category.programming'),
      value: 'programming',
      subcategories: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
        { label: 'C++', value: 'cpp' }
      ]
    },
    {
      label: t('category.framework'),
      value: 'framework',
      subcategories: [
        { label: 'Vue.js', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'Spring', value: 'spring' }
      ]
    },
    {
      label: t('category.topic'),
      value: 'topic',
      subcategories: [
        { label: t('topic.frontend'), value: 'frontend' },
        { label: t('topic.backend'), value: 'backend' },
        { label: t('topic.database'), value: 'database' },
        { label: t('topic.devops'), value: 'devops' },
        { label: t('topic.security'), value: 'security' }
      ]
    },
    {
      label: t('category.level'),
      value: 'level',
      subcategories: [
        { label: t('level.beginner'), value: 'beginner' },
        { label: t('level.intermediate'), value: 'intermediate' },
        { label: t('level.advanced'), value: 'advanced' }
      ]
    }
  ]

  // 当前分类的子分类
  const currentSubcategories = computed(() => {
    if (selectedCategory.value === 'all') return []
    return categories.find(c => c.value === selectedCategory.value)?.subcategories || []
  })

  // 处理分类变化
  const handleCategoryChange = (value: string) => {
    selectedCategory.value = value
    selectedTags.value = []
    updateRoute()
  }

  // 切换标签
  const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    } else {
      selectedTags.value.push(tag)
    }
    updateRoute()
  }

  // 更新路由
  const updateRoute = () => {
    router.push({
      name: 'Home',
      query: {
        category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
        tags: selectedTags.value.length ? selectedTags.value.join(',') : undefined
      }
    })
  }
</script>

<style scoped>
  .header-tabs {
    @apply w-full;
  }

  .subcategories {
    @apply flex flex-wrap gap-2;
  }
</style>