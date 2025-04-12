<template>
  <div class="creator-studio">
    <div class="studio-header">
      <div class="header-content">
        <h1 class="studio-title">创作者工作室</h1>
        <p class="studio-subtitle">管理你的视频、分析数据、优化内容</p>
      </div>
      <n-button type="primary" @click="handleUploadVideo" class="upload-button">
        <template #icon>
          <n-icon>
            <VideocamOutline />
          </n-icon>
        </template>
        上传视频
      </n-button>
    </div>

    <div class="studio-content">
      <n-tabs type="line" animated class="studio-tabs">
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
          <div class="video-customize-content">
            <n-card title="品牌定制" class="video-brand-card">
              <div class="brand-options">
                <div class="brand-option">
                  <div class="brand-preview">
                    <div class="brand-watermark-preview">
                      <div class="watermark-placeholder">水印预览</div>
                    </div>
                  </div>
                  <div class="brand-info">
                    <h3>视频水印</h3>
                    <p>在视频上添加你的品牌标识</p>
                    <n-button size="small">上传水印</n-button>
                  </div>
                </div>

                <div class="brand-option">
                  <div class="brand-preview">
                    <div class="brand-intro-preview">
                      <div class="intro-placeholder">片头预览</div>
                    </div>
                  </div>
                  <div class="brand-info">
                    <h3>品牌片头</h3>
                    <p>在视频开始时显示你的品牌片头</p>
                    <n-button size="small">上传片头</n-button>
                  </div>
                </div>

                <div class="brand-option">
                  <div class="brand-preview">
                    <div class="brand-outro-preview">
                      <div class="outro-placeholder">片尾预览</div>
                    </div>
                  </div>
                  <div class="brand-info">
                    <h3>品牌片尾</h3>
                    <p>在视频结束时显示你的品牌片尾</p>
                    <n-button size="small">上传片尾</n-button>
                  </div>
                </div>
              </div>
            </n-card>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
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
  import RecentVideosComponent from '@/components/business/creator/RecentVideosComponent.vue';
  import RecentCommentsComponent from '@/components/business/creator/RecentCommentsComponent.vue';
  import type { Comment } from '@/types/comment';
  import type { Video } from '@/components/business/creator/RecentVideosComponent.vue';

  const router = useRouter();
  const message = useMessage();

  // 最近视频
  const recentVideos = ref<Video[]>([
    {
      id: '1',
      title: 'Vue 3 完全指南 - 组合式API详解',
      coverUrl: 'https://picsum.photos/id/237/400/225',
      createdAt: '2024-06-10T15:30:00Z',
      views: 1250
    },
    {
      id: '2',
      title: 'TypeScript 高级类型系统详解',
      coverUrl: 'https://picsum.photos/id/238/400/225',
      createdAt: '2024-06-08T10:15:00Z',
      views: 980
    }
  ]);

  // 最近评论
  const recentComments = ref<Comment[]>([
    {
      id: '1',
      content: '这个教程太棒了，学到了很多东西！',
      createdAt: '2024-06-12T09:40:00Z',
      videoTitle: 'Vue 3 完全指南 - 组合式API详解',
      status: '已审核',
      user: {
        nickname: '前端爱好者',
        avatar: 'https://i.pravatar.cc/150?img=33'
      }
    },
    {
      id: '2',
      content: '能不能出一期关于Pinia的教程？',
      createdAt: '2024-06-11T14:20:00Z',
      videoTitle: 'Vue 3 完全指南 - 组合式API详解',
      status: '已审核',
      user: {
        nickname: 'Vue开发者',
        avatar: 'https://i.pravatar.cc/150?img=53'
      }
    }
  ] as Comment[]);

  // 频道定制相关
  const channelDescription = ref('');
  const selectedThemeColor = ref('#58a6ff'); // 默认主题色

  // 交互方法
  const handleUploadVideo = () => {
    router.push('/video/upload');
  };

  const editVideo = (id: string) => {
    router.push(`/video/edit/${id}`);
  };

  const replyToComment = (id: string) => {
    // 实际开发中应弹出回复框
    console.log(`回复评论 ${id}`);
    message.success('已打开回复框');
  };

  const deleteComment = (id: string) => {
    message.success('评论已删除');
  };

  // 保存频道设置
  const saveChannelSettings = (settings: any) => {
    console.log('保存频道设置:', settings);
    channelDescription.value = settings.description;
    selectedThemeColor.value = settings.themeColor;
    message.success('频道设置已保存');
  };
</script>

<style scoped>
  .creator-studio {
    min-height: 100vh;
    background: linear-gradient(180deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.95) 100%);
    color: #e6edf3;
  }

  .studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 40px;
    background: linear-gradient(90deg, rgba(36, 41, 47, 0.9) 0%, rgba(22, 27, 34, 0.9) 100%);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    background: linear-gradient(90deg, #58a6ff 0%, #88d6ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }

  .studio-subtitle {
    font-size: 16px;
    color: rgba(230, 237, 243, 0.7);
    margin: 0;
  }

  .upload-button {
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 6px;
    background: linear-gradient(90deg, #2ea043 0%, #3fb950 100%);
    border: none;
    box-shadow: 0 2px 8px rgba(46, 160, 67, 0.3);
    transition: all 0.3s ease;
  }

  .upload-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 160, 67, 0.5);
  }

  .studio-content {
    background-color: rgba(22, 27, 34, 0.8);
    border-radius: 10px;
    overflow: hidden;
    margin: 24px 40px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
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
    background: rgba(36, 41, 47, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .chart-container {
    height: 300px;
    overflow: hidden;
    border-radius: 8px;
  }

  .chart-placeholder {
    color: rgba(230, 237, 243, 0.5);
    font-style: italic;
  }

  .recent-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .recent-uploads,
  .recent-comments {
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

  /* 评论样式 */
  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .comment-item {
    display: flex;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.2s ease;
    padding: 12px;
    border-radius: 8px;
  }

  .comment-item:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }

  .comment-item:last-child {
    border-bottom: none;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .comment-user {
    font-weight: 600;
    color: #e6edf3;
  }

  .comment-time {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.5);
  }

  .comment-text {
    margin-bottom: 8px;
    line-height: 1.5;
    color: rgba(230, 237, 243, 0.8);
  }

  .comment-video {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.5);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .comment-actions {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .comment-item:hover .comment-actions {
    opacity: 1;
  }

  /* 表格样式 */
  .comments-table {
    margin: 24px;
  }

  /* 状态标签 */
  .status-tag {
    padding: 2px 10px;
    border-radius: 12px;
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  /* 自定义页面样式 */
  .customize-content {
    padding: 24px;
  }

  .customize-card {
    background: rgba(36, 41, 47, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .channel-preview {
    margin-bottom: 24px;
  }

  .channel-banner {
    height: 140px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(230, 237, 243, 0.4);
  }

  .channel-info {
    display: flex;
    align-items: center;
  }

  .channel-avatar {
    margin-right: 16px;
  }

  .avatar-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
  }

  .channel-meta {
    flex: 1;
  }

  .channel-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #e6edf3;
  }

  .channel-desc {
    font-size: 14px;
    color: rgba(230, 237, 243, 0.6);
  }

  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: rgba(230, 237, 243, 0.6);
    gap: 12px;
  }

  .theme-color-picker {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .color-value {
    font-size: 14px;
    color: rgba(230, 237, 243, 0.6);
  }

  .theme-preview {
    margin-top: 16px;
  }

  .theme-preview-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #e6edf3;
  }

  .theme-preview-items {
    display: flex;
    gap: 12px;
  }

  .theme-preview-item {
    width: 60px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  .theme-preview-elements {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .preview-progress {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .preview-progress-fill {
    height: 100%;
    background-color: var(--primary-color);
  }

  .save-button {
    padding: 10px 20px;
    background: linear-gradient(90deg, #58a6ff 0%, #388bfd 100%);
    border: none;
    font-weight: 600;
  }

  /* 视频定制样式 */
  .video-customize-content {
    padding: 24px;
  }

  .video-brand-card {
    background: rgba(36, 41, 47, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .brand-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .brand-option {
    background-color: rgba(22, 27, 34, 0.4);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .brand-option:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .brand-preview {
    height: 120px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .watermark-placeholder,
  .intro-placeholder,
  .outro-placeholder {
    color: rgba(230, 237, 243, 0.4);
    font-size: 14px;
  }

  .brand-info {
    text-align: center;
  }

  .brand-info h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #e6edf3;
  }

  .brand-info p {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: rgba(230, 237, 243, 0.6);
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

    .brand-options {
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

    .upload-button {
      width: 100%;
    }

    .studio-content {
      margin: 16px;
    }

    .video-thumbnail {
      width: 100px;
      height: 56px;
    }
  }

  @media (max-width: 480px) {

    .dashboard-content,
    .comments-management,
    .customize-content,
    .video-customize-content {
      padding: 16px;
    }

    .comments-table {
      margin: 16px;
    }
  }

  /* 动画效果 */
  .recent-video-item,
  .comment-item,
  .brand-option {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* 暗色主题适配 */
  :root {
    --primary-color: #58a6ff;
    --secondary-color: #3fb950;
    --accent-color: #f78166;
    --bg-dark: #0d1117;
    --bg-card: rgba(22, 27, 34, 0.8);
    --text-primary: #e6edf3;
    --text-secondary: rgba(230, 237, 243, 0.6);
    --border-color: rgba(255, 255, 255, 0.1);
  }
</style>