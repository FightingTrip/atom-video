<!-- 
  技术栈说明：
  - Vue 3: 使用 Composition API 和 <script setup> 语法
  - TypeScript: 强类型支持
  - Tailwind CSS: 样式框架
  - Vite: 构建工具

  组件功能：
  - 视频上传表单
  - 支持拖拽上传
  - 文件类型和大小验证
  - 上传进度显示
  - 错误处理和提示
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

<script setup lang="ts">
  // 导入 Vue 3 和 TypeScript 相关
  import { ref, computed } from 'vue';
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
  const uploadProgress = ref(0);
  const isLoading = ref(false);
  const error = ref('');

  // 计算属性
  const videoInfo = computed(() => {
    if (!selectedFile.value) return null;
    return {
      name: selectedFile.value.name,
      size: selectedFile.value.size,
      type: selectedFile.value.type,
    };
  });

  // 方法定义
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      selectedFile.value = input.files[0];
      validateFile(selectedFile.value);
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files.length) {
      selectedFile.value = event.dataTransfer.files[0];
      validateFile(selectedFile.value);
    }
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

  const handleSubmit = async () => {
    if (!selectedFile.value || !validateFile(selectedFile.value)) return;

    isLoading.value = true;
    error.value = '';

    try {
      const formData = new FormData();
      formData.append('title', title.value);
      formData.append('description', description.value);
      formData.append('video', selectedFile.value);

      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        },
      });

      toast.success('视频上传成功');
      emit('upload-success', response.data);
    } catch (err: any) {
      error.value = err.response?.data?.message || '上传失败，请重试';
      toast.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // 事件发射
  const emit = defineEmits<{
    (e: 'upload-success', data: any): void;
    (e: 'cancel'): void;
  }>();
</script>