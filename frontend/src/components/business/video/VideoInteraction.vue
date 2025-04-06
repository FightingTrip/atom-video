<!--
 * @description 视频互动组件
 * @features
 * - 视频信息展示：标题、描述、上传时间等
 * - 作者信息：头像、昵称、关注状态
 * - 互动功能：点赞、收藏、分享
 * - 数据统计：播放量、点赞数、收藏数
 * - 响应式布局
 * - 主题适配
 * @dependencies
 * - naive-ui: UI组件库
 * - dayjs: 日期处理
 * @props
 * - videoId: 视频ID
 * - initialStats: 初始统计数据
 * @emits
 * - like: 点赞事件
 * - favorite: 收藏事件
 * - share: 分享事件
 -->

<template>
  <div class="video-interaction">
    <!-- 视频信息 -->
    <div class="video-info">
      <h1 class="video-title">{{ video?.title }}</h1>
      <div class="video-stats">
        <span>{{ formatNumber(video?.views || 0) }} 次观看</span>
        <span class="dot">•</span>
        <span>{{ formatDate(video?.createdAt) }}</span>
      </div>
    </div>

    <!-- 互动按钮 -->
    <div class="interaction-buttons">
      <n-button-group>
        <n-button :type="isLiked ? 'primary' : 'default'" @click="handleLike">
          <template #icon>
            <n-icon>
              <ThumbsUp v-if="isLiked" />
              <ThumbsUpOutline v-else />
            </n-icon>
          </template>
          {{ formatNumber(video?.likes || 0) }}
        </n-button>

        <n-button :type="isFavorited ? 'primary' : 'default'" @click="handleFavorite">
          <template #icon>
            <n-icon>
              <Bookmark v-if="isFavorited" />
              <BookmarkOutline v-else />
            </n-icon>
          </template>
          {{ formatNumber(video?.favorites || 0) }}
        </n-button>

        <n-button @click="handleShare">
          <template #icon>
            <n-icon>
              <Share />
            </n-icon>
          </template>
          分享
        </n-button>
      </n-button-group>
    </div>

    <!-- 作者信息 -->
    <div class="author-info">
      <div class="author-profile">
        <n-avatar round :size="48" :src="video?.author.avatar" @click="handleAuthorClick" />
        <div class="author-meta">
          <h3 class="author-name" @click="handleAuthorClick">
            {{ video?.author.nickname }}
          </h3>
          <p class="author-stats">
            {{ formatNumber(video?.author.followers || 0) }} 位订阅者
          </p>
        </div>
      </div>

      <n-button :type="video?.author.isFollowed ? 'default' : 'primary'" :ghost="video?.author.isFollowed"
        @click="handleFollow">
        {{ video?.author.isFollowed ? '已关注' : '关注' }}
      </n-button>
    </div>

    <!-- 视频描述 -->
    <div class="video-description">
      <n-collapse>
        <n-collapse-item name="description">
          <template #header>
            <span class="description-header">视频简介</span>
          </template>
          <div class="description-content">
            {{ video?.description || '暂无简介' }}
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { NButton, NButtonGroup, NIcon, NAvatar, NCollapse, NCollapseItem } from 'naive-ui';
  import {
    ThumbsUp,
    ThumbsUpOutline,
    Bookmark,
    BookmarkOutline,
    Share
  } from '@vicons/ionicons5';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';
  import type { Video } from '@/types';

  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');

  // Props 定义
  interface Props {
    video: Video | null;
    isLiked: boolean;
    isFavorited: boolean;
  }

  const props = defineProps<Props>();

  // Emits 定义
  const emit = defineEmits<{
    (e: 'like'): void;
    (e: 'favorite'): void;
    (e: 'share'): void;
    (e: 'follow'): void;
  }>();

  const router = useRouter();

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 格式化日期
  const formatDate = (date?: string) => {
    if (!date) return '';
    return dayjs(date).fromNow();
  };

  // 处理点击作者
  const handleAuthorClick = () => {
    if (props.video?.author.id) {
      router.push(`/user/${props.video.author.id}`);
    }
  };

  // 处理互动
  const handleLike = () => {
    emit('like');
  };

  const handleFavorite = () => {
    emit('favorite');
  };

  const handleShare = () => {
    emit('share');
  };

  const handleFollow = () => {
    emit('follow');
  };
</script>

<style scoped>
  .video-interaction {
    padding: var(--spacing-lg);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .video-title {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .video-stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .dot {
    color: var(--text-tertiary);
  }

  .interaction-buttons {
    display: flex;
    justify-content: flex-end;
  }

  .author-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .author-profile {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    cursor: pointer;
  }

  .author-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .author-name {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .author-stats {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: 0;
  }

  .video-description {
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .description-header {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .description-content {
    padding: var(--spacing-md);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    line-height: 1.6;
    white-space: pre-wrap;
  }

  @media (max-width: 768px) {
    .video-interaction {
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }

    .video-title {
      font-size: var(--text-xl);
    }

    .author-info {
      flex-direction: column;
      gap: var(--spacing-md);
      text-align: center;
    }

    .author-profile {
      flex-direction: column;
    }

    .interaction-buttons {
      justify-content: center;
    }
  }
</style>