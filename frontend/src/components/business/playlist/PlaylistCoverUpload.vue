<template>
  <div class="playlist-cover-upload">
    <div class="current-cover" v-if="currentCover">
      <div class="cover-label">{{ label || '当前封面' }}</div>
      <div class="cover-preview">
        <img :src="currentCover" :alt="altText" class="cover-image" />
        <div class="cover-overlay" v-if="!disabled">
          <n-button quaternary circle class="change-btn" @click="triggerFileInput">
            <template #icon>
              <n-icon>
                <camera-outline />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <div v-else class="empty-cover" @click="triggerFileInput" v-if="!disabled">
      <n-icon size="48">
        <image-outline />
      </n-icon>
      <span class="upload-text">点击上传封面</span>
    </div>

    <input ref="fileInputRef" type="file" accept="image/*" class="file-input" @change="handleFileChange"
      :disabled="disabled || uploading" />

    <n-spin :show="uploading" class="upload-spinner">
      <template #description>{{ uploadingText }}</template>
    </n-spin>

    <div class="upload-instructions" v-if="!disabled && !uploading">
      <p class="instruction-text">
        {{ instructionText || '推荐尺寸：16:9，最大文件大小：5MB' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import { NIcon, NButton, NSpin } from 'naive-ui';
  import { ImageOutline, CameraOutline } from '@vicons/ionicons5';

  const props = defineProps({
    currentCover: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '当前封面'
    },
    altText: {
      type: String,
      default: '播放列表封面'
    },
    instructionText: {
      type: String,
      default: '推荐尺寸：16:9，最大文件大小：5MB'
    },
    uploadingText: {
      type: String,
      default: '正在上传...'
    },
    maxSizeMB: {
      type: Number,
      default: 5
    }
  });

  const emit = defineEmits<{
    (e: 'select-file', file: File): void;
    (e: 'upload-error', error: string): void;
  }>();

  const fileInputRef = ref<HTMLInputElement | null>(null);
  const uploading = ref(false);

  // 触发文件选择
  function triggerFileInput() {
    if (props.disabled || uploading.value) return;
    fileInputRef.value?.click();
  }

  // 处理文件选择
  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      emit('upload-error', '请选择图片文件');
      target.value = '';
      return;
    }

    // 检查文件大小
    if (file.size > props.maxSizeMB * 1024 * 1024) {
      emit('upload-error', `文件大小不能超过${props.maxSizeMB}MB`);
      target.value = '';
      return;
    }

    // 发送文件给父组件
    emit('select-file', file);
    target.value = '';
  }

  // 设置上传状态（供父组件调用）
  function setUploading(status: boolean) {
    uploading.value = status;
  }

  // 暴露方法给父组件
  defineExpose({
    triggerFileInput,
    setUploading
  });
</script>

<style scoped>
  .playlist-cover-upload {
    position: relative;
    width: 100%;
  }

  .current-cover {
    margin-bottom: 16px;
  }

  .cover-label {
    font-size: 14px;
    margin-bottom: 8px;
    color: var(--text-color-secondary);
  }

  .cover-preview {
    position: relative;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .cover-image {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .cover-preview:hover .cover-overlay {
    opacity: 1;
  }

  .change-btn {
    color: white;
    font-size: 24px;
  }

  .empty-cover {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 2px dashed var(--border-color);
    transition: all 0.3s;
    margin-bottom: 16px;
  }

  .empty-cover:hover {
    background-color: var(--hover-color);
  }

  .upload-text {
    margin-top: 12px;
    font-size: 14px;
    color: var(--text-color-secondary);
  }

  .file-input {
    display: none;
  }

  .upload-spinner {
    width: 100%;
    margin: 16px 0;
    text-align: center;
  }

  .upload-instructions {
    margin-top: 8px;
  }

  .instruction-text {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin: 0;
  }
</style>