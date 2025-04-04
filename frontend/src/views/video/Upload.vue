<template>
  <div class="video-upload-page">
    <h1>上传视频</h1>

    <div class="upload-container">
      <VideoUpload @upload-success="handleUploadSuccess" />

      <div v-if="videoData" class="video-form">
        <form @submit.prevent="submitVideo">
          <div class="form-group">
            <label for="title">视频标题</label>
            <input type="text" id="title" v-model="videoData.title" required placeholder="输入视频标题" />
          </div>

          <div class="form-group">
            <label for="description">视频描述</label>
            <textarea id="description" v-model="videoData.description" rows="4" placeholder="输入视频描述"></textarea>
          </div>

          <div class="form-group">
            <label for="tags">标签</label>
            <input type="text" id="tags" v-model="videoData.tags" placeholder="输入标签，用逗号分隔" />
          </div>

          <div class="form-group">
            <label>可见性</label>
            <div class="visibility-options">
              <label>
                <input type="radio" v-model="videoData.visibility" value="public" />
                公开
              </label>
              <label>
                <input type="radio" v-model="videoData.visibility" value="private" />
                私密
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : '发布视频' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelUpload">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  import VideoUpload from '@/components/VideoUpload.vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const isSubmitting = ref(false);
  const videoData = ref<any>(null);

  const handleUploadSuccess = (data: any) => {
    videoData.value = {
      title: '',
      description: '',
      tags: '',
      visibility: 'public',
      videoId: data.id
    };
  };

  const submitVideo = async () => {
    if (!videoData.value) return;

    try {
      isSubmitting.value = true;
      await axios.post('/api/videos', {
        ...videoData.value,
        tags: videoData.value.tags.split(',').map((tag: string) => tag.trim())
      }, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });

      router.push('/videos/my');
    } catch (err: any) {
      console.error('提交视频失败:', err);
      alert(err.response?.data?.message || '提交失败，请重试');
    } finally {
      isSubmitting.value = false;
    }
  };

  const cancelUpload = () => {
    router.push('/videos/my');
  };
</script>

<style scoped>
  .video-upload-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .upload-container {
    margin-top: 30px;
  }

  .video-form {
    margin-top: 30px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .form-group input[type="text"],
  .form-group textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  .form-group textarea {
    resize: vertical;
  }

  .visibility-options {
    display: flex;
    gap: 20px;
  }

  .visibility-options label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>