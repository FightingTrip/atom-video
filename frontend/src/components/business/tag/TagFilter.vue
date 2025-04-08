/**
* @file TagFilter.vue
* @description 标签筛选业务组件，提供内容标签过滤功能
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="tag-filter">
    <div class="flex flex-wrap gap-2 mb-4">
      <button v-for="category in categories" :key="category.name" @click="toggleCategory(category.name)"
        class="category-button" :class="{ active: selectedCategories.includes(category.name) }">
        {{ category.label }}
      </button>
    </div>

    <div class="selected-tags mb-4" v-if="selectedTags.length > 0">
      <div class="flex flex-wrap gap-2">
        <div v-for="tag in selectedTags" :key="tag" class="selected-tag">
          {{ formatTagName(tag) }}
          <button @click="removeTag(tag)" class="remove-tag">
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="tag-categories">
      <div v-for="category in filteredCategories" :key="category.name" class="category-section">
        <h3 class="category-title">{{ category.label }}</h3>
        <div class="flex flex-wrap gap-2">
          <button v-for="tag in category.tags" :key="tag" @click="toggleTag(tag)" class="tag-button"
            :class="{ active: selectedTags.includes(tag) }">
            {{ formatTagName(tag) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { TechTag } from '@/types/tags';

  const props = defineProps<{
    modelValue: string[];
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
  }>();

  const categories = [
    {
      name: 'languages',
      label: '编程语言',
      tags: [
        'JAVASCRIPT',
        'TYPESCRIPT',
        'PYTHON',
        'JAVA',
        'C_SHARP',
        'C_PLUS_PLUS',
        'GO',
        'RUST',
        'SWIFT',
        'KOTLIN',
        'PHP',
        'RUBY'
      ]
    },
    {
      name: 'frontend',
      label: '前端技术',
      tags: [
        'REACT',
        'VUE',
        'ANGULAR',
        'SVELTE',
        'HTML',
        'CSS',
        'SASS',
        'WEBPACK',
        'VITE'
      ]
    },
    {
      name: 'backend',
      label: '后端技术',
      tags: [
        'NODEJS',
        'EXPRESS',
        'NESTJS',
        'SPRING',
        'DJANGO',
        'FLASK',
        'LARAVEL',
        'GRAPHQL',
        'REST'
      ]
    },
    {
      name: 'database',
      label: '数据库',
      tags: [
        'POSTGRESQL',
        'MYSQL',
        'MONGODB',
        'REDIS',
        'SQLITE'
      ]
    },
    {
      name: 'cloud',
      label: '云服务',
      tags: [
        'AWS',
        'AZURE',
        'GCP',
        'DOCKER',
        'KUBERNETES'
      ]
    },
    {
      name: 'tools',
      label: '开发工具',
      tags: [
        'GIT',
        'VSCODE',
        'JETBRAINS',
        'POSTMAN'
      ]
    },
    {
      name: 'cs',
      label: '计算机科学',
      tags: [
        'ALGORITHMS',
        'DATA_STRUCTURES',
        'DESIGN_PATTERNS',
        'SYSTEM_DESIGN',
        'COMPILER',
        'OPERATING_SYSTEM'
      ]
    },
    {
      name: 'other',
      label: '其他',
      tags: [
        'TUTORIAL',
        'BEST_PRACTICES',
        'PERFORMANCE',
        'SECURITY',
        'TESTING',
        'DEVOPS'
      ]
    }
  ];

  const selectedCategories = ref<string[]>([]);
  const selectedTags = ref<string[]>(props.modelValue);

  const filteredCategories = computed(() => {
    if (selectedCategories.value.length === 0) {
      return categories;
    }
    return categories.filter(category =>
      selectedCategories.value.includes(category.name)
    );
  });

  const toggleCategory = (category: string) => {
    const index = selectedCategories.value.indexOf(category);
    if (index === -1) {
      selectedCategories.value.push(category);
    } else {
      selectedCategories.value.splice(index, 1);
    }
  };

  const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag);
    if (index === -1) {
      selectedTags.value.push(tag);
    } else {
      selectedTags.value.splice(index, 1);
    }
    emit('update:modelValue', selectedTags.value);
  };

  const removeTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag);
    if (index !== -1) {
      selectedTags.value.splice(index, 1);
      emit('update:modelValue', selectedTags.value);
    }
  };

  const formatTagName = (tag: string) => {
    return tag.toLowerCase().replace(/_/g, ' ');
  };
</script>

<style scoped>
  .tag-filter {
    padding: var(--spacing-md);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .category-button {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    transition: background-color var(--transition-normal);
  }

  .category-button:hover {
    background-color: var(--tertiary-bg);
  }

  .category-button.active {
    background-color: var(--primary-color);
    color: var(--text-inverse);
  }

  .category-section {
    margin-bottom: var(--spacing-md);
  }

  .category-title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }

  .tag-button {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    transition: background-color var(--transition-normal);
  }

  .tag-button:hover {
    background-color: var(--tertiary-bg);
  }

  .tag-button.active {
    background-color: var(--primary-color);
    color: var(--text-inverse);
  }

  .selected-tag {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .remove-tag {
    font-size: var(--text-lg);
    transition: color var(--transition-normal);
  }

  .remove-tag:hover {
    color: var(--error-color);
  }
</style>