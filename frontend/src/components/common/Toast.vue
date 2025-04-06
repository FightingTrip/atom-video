<template>
  <div v-if="visible" class="toast-container" :class="type">
    <div class="toast-content">
      <i v-if="type === 'success'" class="fas fa-check-circle"></i>
      <i v-else-if="type === 'error'" class="fas fa-exclamation-circle"></i>
      <i v-else-if="type === 'warning'" class="fas fa-exclamation-triangle"></i>
      <i v-else class="fas fa-info-circle"></i>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps<{
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    visible: boolean;
  }>();

  const emit = defineEmits(['close']);

  const visible = ref(props.visible);

  watch(() => props.visible, (newValue) => {
    visible.value = newValue;
    if (newValue && props.duration) {
      setTimeout(() => {
        visible.value = false;
        emit('close');
      }, props.duration);
    }
  });
</script>

<style scoped>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 250px;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: slide-in 0.3s ease-out;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .toast-content i {
    font-size: 18px;
  }

  .success {
    background-color: #10b981;
    color: white;
  }

  .error {
    background-color: #ef4444;
    color: white;
  }

  .warning {
    background-color: #f59e0b;
    color: white;
  }

  .info {
    background-color: #3b82f6;
    color: white;
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>