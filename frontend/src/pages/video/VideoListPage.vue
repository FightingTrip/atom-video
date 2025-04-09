/**
* @file VideoListPage.vue
* @description 用户上传的视频列表页面，展示个人上传的视频内容
* @author Atom Video Team
* @date 2024-04-07
*/

<template>
  <div class="video-list-page">
    <div class="page-header">
      <h1>我的视频</h1>
      <div class="header-actions">
        <n-button type="primary" @click="navigateToUpload">
          <template #icon>
            <n-icon>
              <AddCircleOutline />
            </n-icon>
          </template>
          上传新视频
        </n-button>
      </div>
    </div>

    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="published" tab="已发布">
        <div v-if="loadingPublished" class="loading-container">
          <n-spin size="large" />
        </div>
        <template v-else>
          <div v-if="publishedVideos.length > 0" class="video-grid">
            <div v-for="video in publishedVideos" :key="video.id" class="video-card-wrapper">
              <VideoCardComponent :video="video" @click="handleVideoClick" />
              <div class="video-actions">
                <n-button-group>
                  <n-button size="small" @click="editVideo(video)">编辑</n-button>
                  <n-button size="small" @click="showStatsModal(video)">数据</n-button>
                  <n-button size="small" type="error" @click="confirmDelete(video)">删除</n-button>
                </n-button-group>
              </div>
            </div>
          </div>
          <n-empty v-else description="暂无已发布的视频" />
        </template>
      </n-tab-pane>

      <n-tab-pane name="drafts" tab="草稿">
        <div v-if="loadingDrafts" class="loading-container">
          <n-spin size="large" />
        </div>
        <template v-else>
          <div v-if="draftVideos.length > 0" class="video-grid">
            <div v-for="video in draftVideos" :key="video.id" class="video-card-wrapper">
              <VideoCardComponent :video="video" @click="editVideo(video)" />
              <div class="video-actions">
                <n-button-group>
                  <n-button size="small" type="primary" @click="publishDraft(video)">发布</n-button>
                  <n-button size="small" @click="editVideo(video)">编辑</n-button>
                  <n-button size="small" type="error" @click="confirmDelete(video)">删除</n-button>
                </n-button-group>
              </div>
            </div>
          </div>
          <n-empty v-else description="暂无草稿视频" />
        </template>
      </n-tab-pane>
    </n-tabs>

    <!-- 视频统计数据弹窗 -->
    <n-modal v-model:show="statsModalVisible" preset="card" title="视频数据统计" style="width: 600px;">
      <template v-if="selectedVideo">
        <h3>{{ selectedVideo.title }}</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(selectedVideo.views) }}</div>
            <div class="stat-label">观看量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(selectedVideo.likes) }}</div>
            <div class="stat-label">点赞数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(selectedVideo.favorites) }}</div>
            <div class="stat-label">收藏数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(selectedVideo.comments) }}</div>
            <div class="stat-label">评论数</div>
          </div>
        </div>

        <div class="chart-container">
          <n-h3>最近30天数据趋势</n-h3>
          <div class="placeholder-chart">
            <p>此处将显示视频数据趋势图表</p>
            <p>后续版本将支持详细的数据分析</p>
          </div>
        </div>
      </template>
    </n-modal>

    <!-- 删除确认对话框 -->
    <n-modal v-model:show="deleteConfirmVisible" preset="dialog" title="确认删除" positive-text="删除" negative-text="取消"
      @positive-click="deleteVideo" @negative-click="cancelDelete">
      <template #default>
        <p>确定要删除视频"{{ selectedVideo?.title }}"吗？</p>
        <p class="warning-text">此操作不可撤销，视频将被永久删除。</p>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    NTabs,
    NTabPane,
    NButton,
    NSpin,
    NEmpty,
    NModal,
    NButtonGroup,
    NIcon,
    NH3,
    useMessage
  } from 'naive-ui';
  import { AddCircleOutline } from '@vicons/ionicons5';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import { videoService } from '@/services/video/videoService';
  import { useUserStore } from '@/stores/user';
  import type { Video } from '@/types';

  const router = useRouter();
  const message = useMessage();
  const userStore = useUserStore();

  // 状态
  const activeTab = ref('published');
  const publishedVideos = ref<Video[]>([]);
  const draftVideos = ref<Video[]>([]);
  const loadingPublished = ref(true);
  const loadingDrafts = ref(true);
  const statsModalVisible = ref(false);
  const deleteConfirmVisible = ref(false);
  const selectedVideo = ref<Video | null>(null);

  // 生命周期钩子
  onMounted(async () => {
    await loadVideos();
  });

  // 方法
  const loadVideos = async () => {
    if (!userStore.isLoggedIn) {
      router.push('/login?redirect=/user/videos');
      return;
    }

    const userId = userStore.currentUser?.id;
    if (!userId) return;

    // 加载已发布的视频
    loadingPublished.value = true;
    try {
      const res = await videoService.getUserVideos(userId, { isPublished: true });
      if (res.success) {
        publishedVideos.value = res.data.items;
      }
    } catch (err) {
      console.error('加载已发布视频失败:', err);
      message.error('加载已发布视频失败');
    } finally {
      loadingPublished.value = false;
    }

    // 加载草稿视频
    loadingDrafts.value = true;
    try {
      const res = await videoService.getUserVideos(userId, { isPublished: false });
      if (res.success) {
        draftVideos.value = res.data.items;
      }
    } catch (err) {
      console.error('加载草稿视频失败:', err);
      message.error('加载草稿视频失败');
    } finally {
      loadingDrafts.value = false;
    }
  };

  const navigateToUpload = () => {
    router.push('/video/upload');
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const editVideo = (video: Video) => {
    router.push(`/video/edit/${video.id}`);
  };

  const showStatsModal = (video: Video) => {
    selectedVideo.value = video;
    statsModalVisible.value = true;
  };

  const confirmDelete = (video: Video) => {
    selectedVideo.value = video;
    deleteConfirmVisible.value = true;
  };

  const cancelDelete = () => {
    selectedVideo.value = null;
    deleteConfirmVisible.value = false;
  };

  const deleteVideo = async () => {
    if (!selectedVideo.value) return;

    try {
      const res = await videoService.deleteVideo(selectedVideo.value.id);
      if (res.success) {
        message.success('视频已删除');

        // 从列表中移除
        if (selectedVideo.value.isPublished) {
          publishedVideos.value = publishedVideos.value.filter(v => v.id !== selectedVideo.value?.id);
        } else {
          draftVideos.value = draftVideos.value.filter(v => v.id !== selectedVideo.value?.id);
        }
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (err) {
      console.error('删除视频失败:', err);
      message.error('删除视频失败，请重试');
    } finally {
      selectedVideo.value = null;
      deleteConfirmVisible.value = false;
    }
  };

  const publishDraft = async (video: Video) => {
    try {
      const res = await videoService.updateVideo(video.id, { isPublished: true });
      if (res.success) {
        message.success('视频已发布');

        // 移除草稿并添加到已发布
        draftVideos.value = draftVideos.value.filter(v => v.id !== video.id);
        publishedVideos.value = [res.data, ...publishedVideos.value];
      } else {
        message.error(res.message || '发布失败');
      }
    } catch (err) {
      console.error('发布视频失败:', err);
      message.error('发布视频失败，请重试');
    }
  };

  // 辅助函数
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
  };
</script>

<style scoped>
  .video-list-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-header h1 {
    margin: 0;
    font-size: 24px;
    color: var(--text-color);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 24px;
  }

  .video-card-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .video-actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    padding: 64px 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin: 24px 0;
  }

  .stat-item {
    text-align: center;
    padding: 16px;
    background-color: var(--card-color);
    border-radius: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
    color: var(--primary-color);
  }

  .stat-label {
    font-size: 14px;
    color: var(--text-color-secondary);
  }

  .chart-container {
    margin-top: 24px;
  }

  .placeholder-chart {
    height: 200px;
    background-color: var(--card-color);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-color-secondary);
  }

  .warning-text {
    color: var(--error-color);
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    .video-list-page {
      padding: 16px;
    }

    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>