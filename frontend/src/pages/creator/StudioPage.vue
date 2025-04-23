<template>
  <div class="creator-studio">
    <div class="studio-header">
      <div class="header-content">
        <h1 class="studio-title">创作者工作室</h1>
        <p class="studio-subtitle">管理你的视频、分析数据、优化内容</p>
      </div>
      <div class="header-actions">
        <n-button type="primary" @click="handleUploadVideo" class="upload-button">
          <template #icon>
            <n-icon>
              <VideocamOutline />
            </n-icon>
          </template>
          上传视频
        </n-button>
      </div>
    </div>

    <div class="studio-content">
      <n-tabs type="line" animated class="studio-tabs" v-model:value="activeTab">
        <!-- 概览仪表盘 -->
        <n-tab-pane name="dashboard" tab="概览">
          <div class="dashboard-content">
            <creator-stats-component title="频道概览" class="overview-stats" />

            <n-card title="内容表现" class="performance-card">
              <div class="chart-container">
                <creator-analytics-component title="" chartTitle="" />
              </div>
            </n-card>

            <div class="recent-container">
              <recent-videos-component :videos="recentVideos" @edit="editVideo" />

              <recent-comments-component :comments="recentComments" @reply="replyToComment" />
            </div>
          </div>
        </n-tab-pane>

        <!-- 内容管理 -->
        <n-tab-pane name="content" tab="内容">
          <div class="content-management">
            <video-management-component title="我的视频" />
          </div>
        </n-tab-pane>

        <!-- 评论管理 -->
        <n-tab-pane name="comments" tab="评论">
          <comment-management-component @reply="replyToComment" @delete="deleteComment" />
        </n-tab-pane>

        <!-- 数据分析 -->
        <n-tab-pane name="analytics" tab="数据分析">
          <div class="analytics-content">
            <creator-stats-component title="频道概览" />
            <creator-analytics-component title="观看数据" chartTitle="近期观看趋势" />
          </div>
        </n-tab-pane>

        <!-- 频道定制 -->
        <n-tab-pane name="customize" tab="频道定制">
          <channel-customize-component :initial-channel-description="channelDescription"
            :initial-theme-color="selectedThemeColor" @save="saveChannelSettings" />
        </n-tab-pane>

        <!-- 视频定制 -->
        <n-tab-pane name="video-customize" tab="视频定制">
          <video-branding-component />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMessage } from 'naive-ui';
  import {
    NButton,
    NTabs,
    NTabPane,
    NIcon,
    NCard
  } from 'naive-ui';
  import {
    VideocamOutline
  } from '@vicons/ionicons5';

  // 导入组件
  import CreatorStatsComponent from '@/components/business/creator/CreatorStatsComponent.vue';
  import CreatorAnalyticsComponent from '@/components/business/creator/CreatorAnalyticsComponent.vue';
  import VideoManagementComponent from '@/components/business/creator/VideoManagementComponent.vue';
  import CommentManagementComponent from '@/components/business/creator/CommentManagementComponent.vue';
  import ChannelCustomizeComponent from '@/components/business/creator/ChannelCustomizeComponent.vue';
  import VideoBrandingComponent from '@/components/business/creator/VideoBrandingComponent.vue';
  import RecentVideosComponent from '@/components/business/creator/RecentVideosComponent.vue';
  import RecentCommentsComponent from '@/components/business/creator/RecentCommentsComponent.vue';
  import creatorService from '@/services/creator/creatorService';
  import type { CreatorComment } from '@/services/creator/types';

  const router = useRouter();
  const message = useMessage();
  const activeTab = ref('dashboard');

  // 最近视频
  const recentVideos = ref([]);
  const recentComments = ref<CreatorComment[]>([]);

  // 频道设置
  const channelDescription = ref('');
  const selectedThemeColor = ref('#3fb950');

  // 载入数据
  const loadData = async () => {
    try {
      // 获取最近视频
      const videosResult = await creatorService.getCreatorVideos({
        page: 1,
        pageSize: 4,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      // 确保有数据再映射，避免undefined错误
      if (videosResult && videosResult.data) {
        recentVideos.value = videosResult.data.map(video => ({
          id: video.id,
          title: video.title,
          coverUrl: video.thumbnail || '/images/default-thumbnail.jpg',
          createdAt: video.uploadDate,
          views: video.views || 0
        }));
      } else {
        recentVideos.value = [];
        console.warn('获取最近视频返回空数据');
      }

      // 获取最近评论
      const commentsResult = await creatorService.getCreatorComments({
        page: 1,
        pageSize: 5
      });

      // 确保有数据再赋值，避免undefined错误
      if (commentsResult && commentsResult.data) {
        recentComments.value = commentsResult.data;
      } else {
        recentComments.value = [];
        console.warn('获取最近评论返回空数据');
      }

      // 获取频道设置
      try {
        const channelSettings = await creatorService.getChannelSettings();
        if (channelSettings) {
          channelDescription.value = channelSettings.description || '';
          selectedThemeColor.value = channelSettings.themeColor || '#3fb950';
        }
      } catch (settingsError) {
        console.error('获取频道设置失败:', settingsError);
        // 设置默认值，避免UI出错
        channelDescription.value = '';
        selectedThemeColor.value = '#3fb950';
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败，请稍后重试');

      // 设置默认值，避免UI出错
      recentVideos.value = [];
      recentComments.value = [];
    }
  };

  // 处理上传视频
  const handleUploadVideo = () => {
    router.push('/video/upload');
  };

  // 编辑视频
  const editVideo = (id: string) => {
    router.push(`/video/edit/${id}`);
  };

  // 回复评论
  const replyToComment = async (commentId: string) => {
    // 打开评论回复弹窗
    console.log('回复评论:', commentId);
    // 可以在这里实现打开评论回复模态框的逻辑
  };

  // 删除评论
  const deleteComment = async (commentId: string) => {
    try {
      const result = await creatorService.deleteComment(commentId);
      if (result.success) {
        message.success('评论已删除');
        // 刷新评论列表
        loadData();
      } else {
        message.error(`删除失败: ${result.message}`);
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      message.error('删除评论失败，请稍后重试');
    }
  };

  // 保存频道设置
  const saveChannelSettings = async (settings: { description: string; themeColor: string }) => {
    try {
      const result = await creatorService.updateChannelSettings({
        description: settings.description,
        themeColor: settings.themeColor
      });

      channelDescription.value = result.description;
      selectedThemeColor.value = result.themeColor;

      message.success('频道设置已保存');
    } catch (error) {
      console.error('保存频道设置失败:', error);
      message.error('保存频道设置失败，请稍后重试');
    }
  };

  // 组件挂载时加载数据
  onMounted(() => {
    loadData();
  });
</script>

<style scoped>
  .creator-studio {
    width: 100%;
  }

  .studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 40px;
    background: var(--header-bg, linear-gradient(90deg, rgba(36, 41, 47, 0.9) 0%, rgba(22, 27, 34, 0.9) 100%));
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    margin-bottom: 0;
  }

  .header-content {
    display: flex;
    flex-direction: column;
  }

  .studio-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: var(--title-color, #ffffff);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    background: var(--title-gradient, linear-gradient(90deg, #58a6ff 0%, #88d6ff 100%));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }

  .studio-subtitle {
    font-size: 16px;
    color: var(--text-secondary, rgba(230, 237, 243, 0.7));
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .upload-button {
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 6px;
    background: var(--button-gradient, linear-gradient(90deg, #2ea043 0%, #3fb950 100%));
    border: none;
    box-shadow: 0 2px 8px rgba(46, 160, 67, 0.3);
    transition: all 0.3s ease;
  }

  .upload-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 160, 67, 0.5);
  }

  .studio-content {
    background-color: var(--content-bg, rgba(22, 27, 34, 0.8));
    border-radius: 10px;
    overflow: hidden;
    margin: 24px 40px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05));
  }

  .studio-tabs {
    padding: 0 16px;
  }

  /* 仪表盘样式 */
  .dashboard-content {
    padding: 24px;
  }

  .overview-stats {
    margin-bottom: 24px;
  }

  .performance-card {
    margin-bottom: 24px;
    background: var(--card-bg, rgba(36, 41, 47, 0.5));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05));
  }

  .chart-container {
    height: 300px;
    overflow: hidden;
    border-radius: 8px;
  }

  .recent-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  /* 响应式调整 */
  @media (max-width: 1024px) {
    .studio-header {
      padding: 24px;
    }

    .studio-content {
      margin: 16px 24px;
    }

    .recent-container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .studio-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }

    .upload-button {
      flex: 1;
    }

    .studio-content {
      margin: 16px;
    }
  }

  @media (max-width: 480px) {
    .dashboard-content {
      padding: 16px;
    }
  }

  /* 主题变量 - 深色模式 */
  :root {
    --primary-color: #58a6ff;
    --primary-color-light: #88d6ff;
    --secondary-color: #3fb950;
    --accent-color: #f78166;
    --bg-dark: #0d1117;
    --bg-card: rgba(22, 27, 34, 0.8);
    --text-primary: #e6edf3;
    --text-secondary: rgba(230, 237, 243, 0.6);
    --text-tertiary: rgba(230, 237, 243, 0.4);
    --border-color: rgba(255, 255, 255, 0.1);
    --border-subtle: rgba(255, 255, 255, 0.05);
    --card-bg: rgba(36, 41, 47, 0.5);
    --content-bg: rgba(22, 27, 34, 0.8);
    --bg-secondary: rgba(22, 27, 34, 0.4);
    --bg-inset: rgba(0, 0, 0, 0.3);
    --studio-bg: linear-gradient(180deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.95) 100%);
    --header-bg: linear-gradient(90deg, rgba(36, 41, 47, 0.9) 0%, rgba(22, 27, 34, 0.9) 100%);
    --title-color: #ffffff;
    --title-gradient: linear-gradient(90deg, #58a6ff 0%, #88d6ff 100%);
    --button-gradient: linear-gradient(90deg, #2ea043 0%, #3fb950 100%);
  }

  /* 亮色模式的变量覆盖 */
  :root:not(.dark) {
    --primary-color: #0969da;
    --primary-color-light: #2188ff;
    --secondary-color: #2da44e;
    --accent-color: #d73a49;
    --bg-dark: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.9);
    --text-primary: #24292e;
    --text-secondary: rgba(36, 41, 46, 0.7);
    --text-tertiary: rgba(36, 41, 46, 0.5);
    --border-color: rgba(0, 0, 0, 0.1);
    --border-subtle: rgba(0, 0, 0, 0.05);
    --card-bg: rgba(255, 255, 255, 0.9);
    --content-bg: rgba(255, 255, 255, 0.9);
    --bg-secondary: rgba(246, 248, 250, 0.9);
    --bg-inset: rgba(0, 0, 0, 0.03);
    --studio-bg: linear-gradient(180deg, #f6f8fa 0%, #ffffff 100%);
    --header-bg: linear-gradient(90deg, #f6f8fa 0%, #ffffff 100%);
    --title-color: #0969da;
    --title-gradient: linear-gradient(90deg, #0969da 0%, #2188ff 100%);
    --button-gradient: linear-gradient(90deg, #2da44e 0%, #4caf50 100%);
  }

  /* 浅色模式下的特殊覆盖 */
  :root:not(.dark) .studio-header {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  :root:not(.dark) .studio-content {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  :root:not(.dark) .performance-card {
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
</style>