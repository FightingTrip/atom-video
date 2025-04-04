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
    @apply p-4 bg-white rounded-lg shadow;
  }

  .category-button {
    @apply px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors;
  }

  .category-button.active {
    @apply bg-blue-500 text-white;
  }

  .category-section {
    @apply mb-4;
  }

  .category-title {
    @apply text-lg font-semibold mb-2;
  }

  .tag-button {
    @apply px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors;
  }

  .tag-button.active {
    @apply bg-blue-500 text-white;
  }

  .selected-tag {
    @apply px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 flex items-center gap-1;
  }

  .remove-tag {
    @apply text-lg hover:text-red-500 transition-colors;
  }
</style>