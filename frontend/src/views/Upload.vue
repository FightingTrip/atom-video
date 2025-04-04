<template>
  <div class="upload-page">
    <h1 class="page-title">上传视频</h1>

    <div class="upload-container">
      <div class="upload-area" 
        @dragover.prevent 
        @drop.prevent="handleDrop"
        :class="{ 'dragging': isDragging }"
        @dragenter="isDragging = true"
        @dragleave="isDragging = false"
      >
        <div v-if="!videoFile" class="upload-placeholder">
          <i class="upload-icon">📁</i>
          <p class="upload-text">拖放视频文件到此处或</p>
          <label class="upload-button">
            选择文件
            <input 
              type="file" 
              accept="video/*" 
              class="hidden" 
              @change="handleFileSelect"
            >
          </label>
        </div>
        <div v-else class="file-info">
          <div class="file-name">{{ videoFile.name }}</div>
          <div class="file-size">{{ formatFileSize(videoFile.size) }}</div>
          <button class="remove-button" @click="removeFile">移除</button>
        </div>
      </div>

      <form v-if="videoFile" @submit.prevent="handleSubmit" class="upload-form">
        <div class="form-group">
          <label for="title">标题</label>
          <input 
            id="title" 
            v-model="formData.title" 
            type="text" 
            class="form-input"
            required
          >
        </div>

        <div class="form-group">
          <label for="description">描述</label>
          <textarea 
            id="description" 
            v-model="formData.description" 
            class="form-input"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="thumbnail">缩略图</label>
          <div class="thumbnail-upload">
            <img 
              v-if="formData.thumbnail" 
              :src="formData.thumbnail" 
              alt="缩略图预览"
              class="thumbnail-preview"
            >
            <label class="thumbnail-button">
              {{ formData.thumbnail ? '更换缩略图' : '上传缩略图' }}
              <input 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleThumbnailSelect"
              >
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="visibility">可见性</label>
          <select 
            id="visibility" 
            v-model="formData.visibility" 
            class="form-input"
          >
            <option value="public">公开</option>
            <option value="unlisted">不公开</option>
            <option value="private">私密</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="cancelUpload">
            取消
          </button>
          <button type="submit" class="btn-primary">
            发布视频
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isDragging = ref(false);
const videoFile = ref<File | null>(null);

const formData = ref({
  title: '',
  description: '',
  thumbnail: '',
  visibility: 'public'
});

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFile(files[0]);
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    handleFile(input.files[0]);
  }
};

const handleFile = (file: File) => {
  if (file.type.startsWith('video/')) {
    videoFile.value = file;
  } else {
    alert('请上传视频文件');
  }
};

const handleThumbnailSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.value.thumbnail = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('请上传图片文件');
    }
  }
};

const removeFile = () => {
  videoFile.value = null;
  formData.value = {
    title: '',
    description: '',
    thumbnail: '',
    visibility: 'public'
  };
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleSubmit = () => {
  // 处理视频上传逻辑
  console.log('上传视频:', {
    file: videoFile.value,
    ...formData.value
  });
};

const cancelUpload = () => {
  removeFile();
};
</script>

<style scoped>
.upload-page {
  @apply max-w-3xl mx-auto px-4 py-8;
}

.page-title {
  @apply text-2xl font-bold mb-8;
}

.upload-container {
  @apply space-y-8;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200;
}

.upload-area.dragging {
  @apply border-blue-500 bg-blue-50;
}

.upload-placeholder {
  @apply space-y-4;
}

.upload-icon {
  @apply text-4xl;
}

.upload-text {
  @apply text-gray-600;
}

.upload-button {
  @apply inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer;
}

.file-info {
  @apply flex items-center justify-between;
}

.file-name {
  @apply font-medium;
}

.file-size {
  @apply text-sm text-gray-500;
}

.remove-button {
  @apply text-red-600 hover:text-red-700;
}

.upload-form {
  @apply space-y-6 bg-white rounded-lg shadow p-6;
}

.form-group {
  @apply space-y-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.thumbnail-upload {
  @apply space-y-4;
}

.thumbnail-preview {
  @apply w-full max-w-xs h-40 object-cover rounded-lg;
}

.thumbnail-button {
  @apply inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer;
}

.form-actions {
  @apply flex justify-end gap-4 pt-4;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700;
}

.hidden {
  @apply hidden;
}
</style> 