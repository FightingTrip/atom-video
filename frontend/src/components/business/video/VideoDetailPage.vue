<script setup lang="ts">
  import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NCard, NSpace, NSpin, NButton, NIcon, NAlert, NSkeleton, useMessage } from 'naive-ui';
  import { WarningOutline, CloudOfflineOutline, VideocamOutline } from '@vicons/ionicons5';
  import { videoService } from '@/services/video';
  import { useHistoryStore } from '@/stores/history';
  import { useUserStore } from '@/stores/user';
  import { isMockMode } from '@/services/api';
  import { checkAndEnableOfflineMode, isOfflineMode as checkOfflineMode, checkNetworkAndReconnect } from '@/services/api/errorHandler';
  import VideoPlayerComponent from '@/components/business/video/VideoPlayerComponent.vue';
  import VideoDetailComponent from '@/components/business/video/VideoDetailComponent.vue';
  import VideoCardSmall from '@/components/common/video/VideoCardSmall.vue';
  import CommentListComponent from '@/components/business/comment/CommentListComponent.vue';
  import type { Video, VideoInteraction, Comment, VideoChapter } from '@/types';

  // ... existing code ...

  // 新增: 视频章节状态
  const chapters = ref<VideoChapter[]>([]);
  const showChaptersList = ref(false);

  // ... existing code ...

  // 新增: 跳转到章节
  const jumpToChapter = (time: number) => {
    if (videoRef && videoRef.value) {
      videoRef.value.currentTime = time;
      if (videoRef.value.paused) {
        videoRef.value.play();
      }
    }
  };

  // 新增: 获取章节数据
  const fetchChapters = async (videoId: string) => {
    try {
      // 在真实环境中，应该从API获取章节数据
      // 这里为了演示，我们使用模拟数据
      if (isMockMode) {
        // 根据视频ID模拟不同的章节
        if (videoId === 'v1') {
          chapters.value = [
            { id: '1', title: '介绍', time: 0, duration: 60 },
            { id: '2', title: '2025年编程趋势', time: 60, duration: 240 },
            { id: '3', title: '最值得学习的语言', time: 300, duration: 300 },
            { id: '4', title: '薪资与就业分析', time: 600, duration: 180 },
            { id: '5', title: '学习路径与资源', time: 780, duration: 145 }
          ];
        } else if (videoId === 'v2') {
          chapters.value = [
            { id: '1', title: '人工智能基础概念', time: 0, duration: 300 },
            { id: '2', title: '机器学习简介', time: 300, duration: 420 },
            { id: '3', title: '深度学习入门', time: 720, duration: 600 },
            { id: '4', title: '实际应用案例', time: 1320, duration: 400 },
            { id: '5', title: '学习资源推荐', time: 1720, duration: 125 }
          ];
        } else {
          // 默认章节
          chapters.value = [
            { id: '1', title: '开场白', time: 0, duration: 60 },
            { id: '2', title: '主要内容', time: 60, duration: Math.floor(video.value?.duration * 0.7) || 180 },
            { id: '3', title: '总结', time: (video.value?.duration || 240) - 60, duration: 60 }
          ];
        }
      } else {
        // 真实环境下从API获取章节数据
        const response = await videoService.getVideoChapters(videoId);
        if (response.success && response.data) {
          chapters.value = response.data;
        }
      }
    } catch (err) {
      console.warn('获取视频章节失败:', err);
      // 章节不是必须的，失败时使用默认章节或不显示章节
      chapters.value = [];
    }
  };

  // 获取视频信息
  const fetchVideoData = async () => {
    // ... existing code ...

    try {
      // ... existing code ...

      if (response.success && response.data) {
        video.value = response.data;

        // 获取视频章节
        await fetchChapters(videoId as string);

        // ... existing code ...
      }
      // ... existing code ...
    }
  };

  // ... existing code ...
</script>

<template>
  <div class="video-detail-page">
    <!-- ... existing code ... -->

    <div v-else-if="video" class="video-content">
      <div class="primary-column">
        <VideoPlayerComponent :video="video" :current-time="savedProgress" @time-update="handleTimeUpdate"
          @play="handlePlay" @pause="handlePause" @ended="handleEnded" class="video-player" />

        <!-- 新增: 章节导航 -->
        <div v-if="chapters.length > 0" class="chapters-navigation">
          <div class="chapters-header" @click="showChaptersList = !showChaptersList">
            <h3>章节 ({{ chapters.length }})</h3>
            <n-icon :class="{ 'rotate-icon': showChaptersList }">
              <ChevronDown />
            </n-icon>
          </div>
          <div class="chapters-list" v-if="showChaptersList">
            <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item"
              @click="jumpToChapter(chapter.time)">
              <div class="chapter-details">
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-time">{{ formatTime(chapter.time) }}</span>
              </div>
              <div class="chapter-progress">
                <div class="progress-bar">
                  <div class="progress-fill"
                    :style="{ width: `${Math.min(100, (savedProgress - chapter.time) / chapter.duration * 100)}%` }"
                    v-if="savedProgress >= chapter.time"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VideoDetailComponent :video="video" :is-liked="isLiked" :is-favorited="isFavorited"
          :is-subscribed="isSubscribed" :offline-mode="isOfflineMode" @like="handleLike" @favorite="handleFavorite"
          @subscribe="handleSubscribe" @comment="handleComment" @load-more-comments="loadMoreComments"
          class="video-detail" />
      </div>
      <!-- ... existing code ... -->
    </div>
  </div>
</template>

<style scoped>
  /* ... existing code ... */

  /* 章节导航样式 */
  .chapters-navigation {
    margin-bottom: 16px;
    border-radius: var(--radius-lg);
    background-color: var(--card-bg);
    border: 1px solid var(--border-medium);
    overflow: hidden;
  }

  .chapters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-light);
  }

  .chapters-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .rotate-icon {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }

  .chapters-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .chapter-item {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .chapter-item:hover {
    background-color: var(--hover-color);
  }

  .chapter-item:last-child {
    border-bottom: none;
  }

  .chapter-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .chapter-title {
    font-weight: 500;
    color: var(--text-primary);
  }

  .chapter-time {
    color: var(--text-secondary);
    font-size: 0.9em;
  }

  .chapter-progress {
    width: 100%;
    height: 4px;
    margin-top: 6px;
  }

  .progress-bar {
    width: 100%;
    height: 100%;
    background-color: var(--progress-bg, #e5e5e5);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--primary-color, #1890ff);
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* ... existing code ... */
</style>