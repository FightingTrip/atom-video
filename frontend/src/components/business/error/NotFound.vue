<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="text-6xl font-bold text-gray-300 dark:text-gray-700">404</div>
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ t('notFound.title') }}
      </h2>
      <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
        {{ t('notFound.message') }}
      </p>
      <div class="mt-8">
        <router-link to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          <i class="fas fa-home mr-2"></i>
          {{ t('notFound.backToHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<style scoped>
  .bg-primary {
    background-color: var(--primary-color);
  }

  .hover\:bg-primary-dark:hover {
    background-color: var(--primary-dark);
  }

  .focus\:ring-primary:focus {
    --tw-ring-color: var(--primary-color);
  }
</style>