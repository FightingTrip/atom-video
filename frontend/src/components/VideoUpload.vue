<template>
  <div class="video-upload">
    <div class="upload-area" :class="{ 'is-dragover': isDragover }" @dragenter.prevent="isDragover = true"
      @dragleave.prevent="isDragover = false" @dragover.prevent @drop.prevent="handleDrop">
      <div class="upload-content">
        <i class="fas fa-cloud-upload-alt"></i>
        <h3>拖拽视频文件到此处</h3>
        <p>或</p>
        <button class="btn btn-primary" @click="triggerFileInput">
          选择文件
        </button>
        <input type="file" ref="fileInput" accept="video/*" @change="handleFileSelect" style="display: none" />
      </div>
    </div>

    <div v-if="uploadProgress > 0" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p>{{ uploadProgress }}%</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="videoInfo" class="video-info">
      <h4>视频信息</h4>
      <p>文件名：{{ videoInfo.name }}</p>
      <p>大小：{{ formatFileSize(videoInfo.size) }}</p>
      <p>时长：{{ formatDuration(videoInfo.duration) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';

  const authStore = useAuthStore();
  const isDragover = ref(false);
  const uploadProgress = ref(0);
  const error = ref('');
  const videoInfo = ref<any>(null);
  const fileInput = ref<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleDrop = (e: DragEvent) => {
    isDragover.value = false;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      handleFile(input.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      error.value = '请选择视频文件';
      return;
    }

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authStore.token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        }
      });

      videoInfo.value = {
        name: file.name,
        size: file.size,
        duration: response.data.duration
      };

      // 触发上传成功事件
      emit('upload-success', response.data);
    } catch (err: any) {
      error.value = err.response?.data?.message || '上传失败，请重试';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const emit = defineEmits(['upload-success']);
</script>

<style scoped>
  .video-upload {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .upload-area {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
  }

  .upload-area.is-dragover {
    border-color: #007bff;
    background-color: #e9ecef;
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .upload-content i {
    font-size: 48px;
    color: #007bff;
  }

  .upload-progress {
    margin-top: 20px;
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
  }

  .error-message {
    color: #dc3545;
    margin-top: 10px;
  }

  .video-info {
    margin-top: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .video-info h4 {
    margin-bottom: 10px;
    color: #212529;
  }
</style>