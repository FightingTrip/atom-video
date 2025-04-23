<template>
  <!-- No changes to template section -->
</template>

<script>
  import { useToast } from '@/composables/useToast';

  export default {
    setup() {
      const { showSuccess, showError } = useToast();

      return {
        showSuccess,
        showError
      };
    }
  };
</script>

<style>
  /* No changes to style section */
</style>