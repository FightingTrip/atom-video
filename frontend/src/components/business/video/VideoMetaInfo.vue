<!-- 视频元信息组件 -->
<template>
  <div class="video-meta-info">
    <div class="meta-item">
      <span class="label">难度等级：</span>
      <el-tag :type="getDifficultyTagType(video?.difficultyLevel)">
        {{ getDifficultyLabel(video?.difficultyLevel) }}
      </el-tag>
    </div>
    <div class="meta-item">
      <span class="label">视频类型：</span>
      <el-tag>{{ getVideoTypeLabel(video?.videoType) }}</el-tag>
    </div>
    <div class="meta-item">
      <span class="label">标签：</span>
      <el-tag v-for="tag in video?.tags" :key="tag" size="small" class="tag">
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IVideo, VideoType, DifficultyLevel } from '@atom-video/shared-types';

  defineProps<{
    video: IVideo | null;
  }>();

  const getDifficultyTagType = (level?: DifficultyLevel): string => {
    switch (level) {
      case 'BEGINNER':
        return 'success';
      case 'INTERMEDIATE':
        return 'warning';
      case 'ADVANCED':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getDifficultyLabel = (level?: DifficultyLevel): string => {
    switch (level) {
      case 'BEGINNER':
        return '入门';
      case 'INTERMEDIATE':
        return '中级';
      case 'ADVANCED':
        return '高级';
      default:
        return '未知';
    }
  };

  const getVideoTypeLabel = (type?: VideoType): string => {
    switch (type) {
      case 'TUTORIAL':
        return '教程';
      case 'CODE_REVIEW':
        return '代码评审';
      case 'LIVE_CODING':
        return '实时编程';
      case 'TECH_TALK':
        return '技术讲座';
      default:
        return '未知';
    }
  };
</script>

<style scoped>
  .video-meta-info {
    margin-top: 16px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .label {
    margin-right: 8px;
    color: #666;
  }

  .tag {
    margin-right: 8px;
  }
</style>