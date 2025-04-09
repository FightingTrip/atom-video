/**
* @file VideoUploadComponent.vue
* @description 视频上传组件 - 提供视频文件上传和信息填写功能的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/

<!--
 * @description 视频上传组件
 * @features
 * - 视频文件上传：支持拖拽和点击上传
 * - 文件验证：类型、大小、格式检查
 * - 上传进度：实时显示上传进度
 * - 视频信息：标题、描述、标签编辑
 * - 封面设置：支持自定义封面
 * - 错误处理：完整的错误提示和处理
 * @dependencies
 * - naive-ui: UI组件库
 * - @vueuse/core: 实用工具集
 * - tailwindcss: 样式框架
 * @props
 * - maxSize: 最大文件大小（MB）
 * - allowedTypes: 允许的文件类型
 * @emits
 * - upload-success: 上传成功事件
 * - upload-error: 上传错误事件
 * - upload-progress: 上传进度事件
-->
<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">上传视频</h3>
          <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">标题</label>
            <input id="title" v-model="title" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
            <textarea id="description" v-model="description" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">视频文件</label>
            <div @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput"
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500">
              <div class="space-y-1 text-center">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>点击上传</span>
                    <input ref="fileInput" type="file" accept="video/*" class="sr-only" @change="handleFileChange" />
                  </label>
                  <p class="pl-1">或拖拽文件到此处</p>
                </div>
                <p class="text-xs text-gray-500">支持 MP4, WebM, MOV 格式，最大 500MB</p>
              </div>
            </div>
            <div v-if="selectedFile" class="mt-2">
              <p class="text-sm text-gray-600">
                已选择: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
              </p>
            </div>
          </div>

          <!-- 视频预览 -->
          <div v-if="videoPreviewUrl" class="mt-4">
            <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref="previewVideo" :src="videoPreviewUrl" class="w-full h-full"
                @loadedmetadata="onPreviewLoadedMetadata"></video>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div class="flex items-center justify-between text-white text-sm">
                  <span>{{ formatDuration(videoDuration) }}</span>
                  <span>{{ videoResolution }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 上传进度 -->
          <div v-if="uploadProgress > 0" class="mt-4">
            <div class="relative pt-1">
              <div class="flex mb-2 items-center justify-between">
                <div>
                  <span
                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    上传进度
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-semibold inline-block text-indigo-600">
                    {{ uploadProgress }}%
                  </span>
                </div>
              </div>
              <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div :style="{ width: uploadProgress + '%' }"
                  class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500">
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-600">
                <span>{{ formatFileSize(uploadedBytes) }}</span>
                <span>{{ formatFileSize(selectedFile?.size || 0) }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-600 mt-1">
                <span>上传速度: {{ formatSpeed(uploadSpeed) }}</span>
                <span>预计剩余时间: {{ formatTimeRemaining(timeRemaining) }}</span>
              </div>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="$emit('cancel')"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              取消
            </button>
            <button type="submit" :disabled="!selectedFile || isLoading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '上传中...' : '上传' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

/**
* @file VideoUpload.vue
* @description 视频上传业务组件，处理视频文件上传相关逻辑
* @author Atom Video Team
* @date 2025-04-06
*/
<script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useToast } from '@/composables/useToast';
  import api from '@/utils/api';

  // 状态管理
  const authStore = useAuthStore();
  const toast = useToast();

  // 响应式数据
  const title = ref('');
  const description = ref('');
  const selectedFile = ref<File | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);
  const previewVideo = ref<HTMLVideoElement | null>(null);
  const videoPreviewUrl = ref<string>('');
  const videoDuration = ref(0);
  const videoResolution = ref('');
  const uploadProgress = ref(0);
  const uploadedBytes = ref(0);
  const uploadSpeed = ref(0);
  const timeRemaining = ref(0);
  const isLoading = ref(false);
  const error = ref('');
  const uploadController = ref<AbortController | null>(null);
  const lastUploadedBytes = ref(0);
  const lastTime = ref(0);

  // 方法定义
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      selectedFile.value = input.files[0];
      if (validateFile(selectedFile.value)) {
        await createVideoPreview(selectedFile.value);
      }
    }
  };

  const handleDrop = async (event: DragEvent) => {
    if (event.dataTransfer?.files.length) {
      selectedFile.value = event.dataTransfer.files[0];
      if (validateFile(selectedFile.value)) {
        await createVideoPreview(selectedFile.value);
      }
    }
  };

  const createVideoPreview = (file: File) => {
    if (videoPreviewUrl.value) {
      URL.revokeObjectURL(videoPreviewUrl.value);
    }
    videoPreviewUrl.value = URL.createObjectURL(file);
  };

  const onPreviewLoadedMetadata = () => {
    if (!previewVideo.value) return;
    videoDuration.value = previewVideo.value.duration;
    videoResolution.value = `${previewVideo.value.videoWidth}x${previewVideo.value.videoHeight}`;
  };

  const validateFile = (file: File) => {
    error.value = '';
    const maxSize = 500 * 1024 * 1024; // 500MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (file.size > maxSize) {
      error.value = '文件大小不能超过 500MB';
      selectedFile.value = null;
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      error.value = '不支持的文件类型，请上传 MP4、WebM 或 MOV 格式';
      selectedFile.value = null;
      return false;
    }

    return true;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return '计算中...';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const updateUploadProgress = (loaded: number, total: number) => {
    const now = Date.now();
    const timeDiff = (now - lastTime.value) / 1000; // 转换为秒

    if (timeDiff > 0) {
      const bytesDiff = loaded - lastUploadedBytes.value;
      uploadSpeed.value = bytesDiff / timeDiff;

      const remainingBytes = total - loaded;
      timeRemaining.value = remainingBytes / uploadSpeed.value;
    }

    lastUploadedBytes.value = loaded;
    lastTime.value = now;
    uploadedBytes.value = loaded;
    uploadProgress.value = (loaded / total) * 100;
  };

  const handleSubmit = async () => {
    if (!selectedFile.value || !validateFile(selectedFile.value)) return;

    isLoading.value = true;
    error.value = '';
    uploadProgress.value = 0;
    uploadedBytes.value = 0;
    uploadSpeed.value = 0;
    timeRemaining.value = 0;
    lastUploadedBytes.value = 0;
    lastTime.value = Date.now();

    // 创建新的 AbortController
    uploadController.value = new AbortController();

    try {
      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('description', description.value);
      formData.append('video', selectedFile.value);
      formData.append('duration', videoDuration.value.toString());
      formData.append('resolution', videoResolution.value);

      const response = await api.post('/videos/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            updateUploadProgress(progressEvent.loaded, progressEvent.total);
          }
        },
        signal: uploadController.value.signal,
      });

      toast.success('视频上传成功');
      emit('success', response.data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        error.value = '上传已取消';
      } else {
        error.value = err.response?.data?.message || '上传失败，请重试';
      }
      toast.error(error.value);
    } finally {
      isLoading.value = false;
      uploadController.value = null;
    }
  };

  // 组件卸载时清理
  onUnmounted(() => {
    if (videoPreviewUrl.value) {
      URL.revokeObjectURL(videoPreviewUrl.value);
    }
    if (uploadController.value) {
      uploadController.value.abort();
    }
  });

  // 事件发射
  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'cancel'): void;
  }>();
</script>

<style scoped>
  .upload-modal {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: var(--container-md);
    width: 100%;
    margin: var(--spacing-md);
  }

  .modal-header {
    padding: var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-light);
  }

  .modal-title {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .close-button {
    color: var(--text-secondary);
    cursor: pointer;
    transition: color var(--transition-normal);
  }

  .close-button:hover {
    color: var(--text-primary);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-label {
    display: block;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .form-input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    transition: border-color var(--transition-normal);
  }

  .form-input:focus {
    border-color: var(--primary-color);
    outline: none;
  }

  .upload-area {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-lg);
    border: 2px dashed var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: border-color var(--transition-normal);
  }

  .upload-area:hover {
    border-color: var(--primary-color);
  }

  .upload-content {
    text-align: center;
  }

  .upload-icon {
    font-size: var(--text-4xl);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }

  .upload-text {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .upload-hint {
    color: var(--text-tertiary);
    font-size: var(--text-xs);
    margin-top: var(--spacing-xs);
  }

  .file-info {
    margin-top: var(--spacing-sm);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .video-preview {
    margin-top: var(--spacing-lg);
    position: relative;
    aspect-ratio: 16 / 9;
    background-color: var(--secondary-bg);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .preview-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .preview-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-md);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: var(--text-inverse);
    font-size: var(--text-sm);
    display: flex;
    justify-content: space-between;
  }

  .upload-progress {
    margin-top: var(--spacing-lg);
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
  }

  .progress-label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--primary-color);
    background-color: var(--primary-bg-light);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
  }

  .progress-percentage {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--primary-color);
  }

  .progress-bar {
    height: var(--spacing-xs);
    background-color: var(--primary-bg-light);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: var(--spacing-md);
  }

  .progress-fill {
    height: 100%;
    background-color: var(--primary-color);
    transition: width var(--transition-normal);
  }

  .progress-stats {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .error-message {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    background-color: var(--error-bg);
    border-radius: var(--radius-md);
    color: var(--error-color);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .error-icon {
    flex-shrink: 0;
  }

  .modal-footer {
    padding: var(--spacing-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    border-top: 1px solid var(--border-light);
  }

  .cancel-button {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-normal);
  }

  .cancel-button:hover {
    background-color: var(--secondary-bg);
  }

  .upload-button {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    background-color: var(--primary-color);
    color: var(--text-inverse);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--transition-normal);
  }

  .upload-button:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
  }

  .upload-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .modal-content {
      margin: var(--spacing-sm);
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--spacing-md);
    }

    .upload-area {
      padding: var(--spacing-md);
    }
  }
</style>