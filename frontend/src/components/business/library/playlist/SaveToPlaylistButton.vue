<template>
  <div class="save-to-playlist-button">
    <!-- 按钮 -->
    <Button :class="buttonClass" @click="openPlaylistSelector" :aria-label="label" :title="label" :disabled="disabled">
      <template #icon>
        <i class="pi pi-list mr-2"></i>
      </template>
      <span v-if="showLabel">{{ label }}</span>
    </Button>

    <!-- 播放列表选择器对话框 -->
    <PlaylistSelector v-model:visible="showSelector" :videoId="videoId" @added="onVideoAdded" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useToast } from '@/composables/useToast';
  import PlaylistSelector from './PlaylistSelector.vue';

  const authStore = useAuthStore();
  const toast = useToast();

  // 组件属性
  const props = defineProps({
    videoId: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'default', // 'default', 'text', 'outlined'
      validator: (value: string) => ['default', 'text', 'outlined'].includes(value)
    },
    size: {
      type: String,
      default: 'normal', // 'small', 'normal', 'large'
      validator: (value: string) => ['small', 'normal', 'large'].includes(value)
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: '保存'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  // 组件事件
  const emit = defineEmits(['added']);

  // 状态
  const showSelector = ref(false);

  // 计算属性
  const buttonClass = computed(() => {
    const classes = ['save-button'];

    // 变体样式
    if (props.variant === 'text') {
      classes.push('p-button-text');
    } else if (props.variant === 'outlined') {
      classes.push('p-button-outlined');
    }

    // 尺寸
    if (props.size === 'small') {
      classes.push('p-button-sm');
    } else if (props.size === 'large') {
      classes.push('p-button-lg');
    }

    // 如果不显示标签，则使用圆形按钮
    if (!props.showLabel) {
      classes.push('p-button-rounded');
    }

    return classes.join(' ');
  });

  // 方法
  function openPlaylistSelector() {
    // 检查用户是否已登录
    if (!authStore.isLoggedIn) {
      toast.info('请先登录后再添加视频到播放列表');

      // 可以在这里触发登录对话框
      // authStore.showLoginDialog();
      return;
    }

    showSelector.value = true;
  }

  function onVideoAdded(playlistId: string) {
    emit('added', { videoId: props.videoId, playlistId });
  }
</script>

<style scoped>
  .save-to-playlist-button {
    display: inline-block;
  }
</style>