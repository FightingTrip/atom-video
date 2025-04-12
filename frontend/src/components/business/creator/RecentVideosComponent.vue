<template>
  <n-card :title="title || '最近上传'" class="recent-uploads">
    <div v-if="videos.length === 0" class="empty-state">
      <n-empty description="还没有上传视频" />
    </div>
    <div v-else class="recent-video-list">
      <div v-for="video in videos" :key="video.id" class="recent-video-item">
        <img :src="video.coverUrl" :alt="video.title" class="video-thumbnail" />
        <div class="video-info">
          <div class="video-title">{{ video.title }}</div>
          <div class="video-meta">
            <span class="meta-item">
              <n-icon size="14" class="meta-icon">
                <CalendarOutline />
              </n-icon>
              {{ formatDate(video.createdAt) }}
            </span>
            <span class="meta-item">
              <n-icon size="14" class="meta-icon">
                <EyeOutline />
              </n-icon>
              {{ formatNumber(video.views) }}
            </span>
          </div>
        </div>
        <div class="video-actions">
          <n-button size="small" secondary circle @click="handleEditVideo(video.id)">
            <template #icon>
              <n-icon>
                <CreateOutline />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import { NCard, NEmpty, NButton, NIcon } from 'naive-ui';
  import { CalendarOutline, EyeOutline, CreateOutline } from '@vicons/ionicons5';

  export interface Video {
    id: string;
    title: string;
    coverUrl: string;
    createdAt: string;
    views: number;
  }

  interface Props {
    title?: string;
    videos?: Video[];
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '最近上传',
    videos: () => []
  });

  const emit = defineEmits<{
    (e: 'edit', videoId: string): void
  }>();

  // 格式化函数
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN');
  };

  // 处理视频编辑
  const handleEditVideo = (videoId: string) => {
    emit('edit', videoId);
  };
</script>

<style scoped>
  .recent-uploads {
    background: rgba(36, 41, 47, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    height: 100%;
  }

  .empty-state {
    color: rgba(230, 237, 243, 0.5);
    text-align: center;
    padding: 40px 0;
  }

  /* 最近视频样式 */
  .recent-video-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .recent-video-item {
    display: flex;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s ease;
  }

  .recent-video-item:hover {
    transform: translateX(4px);
  }

  .recent-video-item:last-child {
    border-bottom: none;
  }

  .video-thumbnail {
    width: 140px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .recent-video-item:hover .video-thumbnail {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .video-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .video-title {
    font-weight: 500;
    line-height: 1.4;
    color: #e6edf3;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .video-meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: rgba(230, 237, 243, 0.6);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .meta-icon {
    opacity: 0.7;
  }

  .video-actions {
    display: flex;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  .recent-video-item:hover .video-actions {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .video-thumbnail {
      width: 100px;
      height: 56px;
    }
  }
</style>