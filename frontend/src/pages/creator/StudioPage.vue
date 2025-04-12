<template>
  <div class="creator-studio">
    <div class="studio-header">
      <h1 class="studio-title">创作者工作室</h1>
      <n-button type="primary" @click="handleUploadVideo">
        <template #icon>
          <n-icon>
            <VideocamOutline />
          </n-icon>
        </template>
        上传视频
      </n-button>
    </div>

    <div class="studio-content">
      <n-tabs type="line" animated>
        <!-- 概览仪表盘 -->
        <n-tab-pane name="dashboard" tab="概览">
          <div class="dashboard-content">
            <div class="stats-cards">
              <n-card class="stats-card" title="总观看量">
                <div class="stat-value">{{ formatNumber(channelStats.totalViews) }}</div>
                <div class="stat-trend"
                  :class="{ 'up': channelStats.viewsGrowth > 0, 'down': channelStats.viewsGrowth < 0 }">
                  {{ channelStats.viewsGrowth > 0 ? '+' : '' }}{{ channelStats.viewsGrowth }}%
                </div>
              </n-card>
              <n-card class="stats-card" title="订阅者">
                <div class="stat-value">{{ formatNumber(channelStats.subscribers) }}</div>
                <div class="stat-trend"
                  :class="{ 'up': channelStats.subscribersGrowth > 0, 'down': channelStats.subscribersGrowth < 0 }">
                  {{ channelStats.subscribersGrowth > 0 ? '+' : '' }}{{ channelStats.subscribersGrowth }}%
                </div>
              </n-card>
              <n-card class="stats-card" title="总视频数">
                <div class="stat-value">{{ channelStats.totalVideos }}</div>
                <div class="stat-subtitle">最近{{ channelStats.recentVideos }}个新视频</div>
              </n-card>
            </div>

            <n-card title="性能概览" class="performance-card">
              <div class="chart-container">
                <div class="chart-placeholder">视频性能图表将在这里显示</div>
              </div>
            </n-card>

            <div class="recent-container">
              <n-card title="最近上传" class="recent-uploads">
                <div v-if="recentVideos.length === 0" class="empty-state">
                  还没有上传视频
                </div>
                <div v-else class="recent-video-list">
                  <div v-for="video in recentVideos" :key="video.id" class="recent-video-item">
                    <img :src="video.coverUrl" :alt="video.title" class="video-thumbnail" />
                    <div class="video-info">
                      <div class="video-title">{{ video.title }}</div>
                      <div class="video-meta">
                        <span>{{ formatDate(video.createdAt) }}</span>
                        <span>{{ formatNumber(video.views) }} 次观看</span>
                      </div>
                    </div>
                    <div class="video-actions">
                      <n-button size="small" quaternary @click="editVideo(video.id)">
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

              <n-card title="最近评论" class="recent-comments">
                <div v-if="recentComments.length === 0" class="empty-state">
                  还没有新评论
                </div>
                <div v-else class="comment-list">
                  <div v-for="comment in recentComments" :key="comment.id" class="comment-item">
                    <n-avatar :src="comment.user.avatar" round size="small" />
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-user">{{ comment.user.nickname }}</span>
                        <span class="comment-time">{{ formatTimeDifference(comment.createdAt) }}</span>
                      </div>
                      <div class="comment-text">{{ comment.content }}</div>
                      <div class="comment-video">在视频 "{{ comment.videoTitle }}" 下</div>
                    </div>
                  </div>
                </div>
              </n-card>
            </div>
          </div>
        </n-tab-pane>

        <!-- 内容管理 -->
        <n-tab-pane name="content" tab="内容">
          <div class="content-management">
            <n-data-table :columns="videoColumns" :data="videos" :pagination="pagination" :bordered="false"
              class="video-table" />
          </div>
        </n-tab-pane>

        <!-- 评论管理 -->
        <n-tab-pane name="comments" tab="评论">
          <div class="comments-management">
            <n-data-table :columns="commentColumns" :data="comments" :pagination="pagination" :bordered="false"
              class="comments-table" />
          </div>
        </n-tab-pane>

        <!-- 数据分析 -->
        <n-tab-pane name="analytics" tab="数据分析">
          <div class="analytics-content">
            <n-empty description="高级数据分析功能即将推出" />
          </div>
        </n-tab-pane>

        <!-- 频道定制 -->
        <n-tab-pane name="customize" tab="频道定制">
          <div class="customize-content">
            <n-card title="频道外观">
              <n-form>
                <n-form-item label="频道横幅">
                  <n-upload action="https://api.atomvideo.com/upload" :default-upload="false" :multiple="false"
                    list-type="image-card">
                    <n-upload-trigger>
                      <div class="upload-trigger">
                        <n-icon size="48">
                          <CloudUploadOutline />
                        </n-icon>
                        <span>点击或拖拽上传横幅</span>
                      </div>
                    </n-upload-trigger>
                  </n-upload>
                </n-form-item>

                <n-form-item label="频道介绍">
                  <n-input type="textarea" placeholder="介绍你的频道..." :autosize="{ minRows: 3, maxRows: 6 }" />
                </n-form-item>

                <n-form-item label="主题色">
                  <n-color-picker :swatches="themeColors" />
                </n-form-item>

                <n-form-item>
                  <n-button type="primary">保存设置</n-button>
                </n-form-item>
              </n-form>
            </n-card>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    NButton,
    NTabs,
    NTabPane,
    NIcon,
    NCard,
    NDataTable,
    NAvatar,
    NPopconfirm,
    NEmpty,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NUploadTrigger,
    NColorPicker
  } from 'naive-ui';
  import {
    VideocamOutline,
    CreateOutline,
    TrashOutline,
    EyeOutline,
    HeartOutline,
    ChatboxOutline,
    CloudUploadOutline,
    TrashBinOutline
  } from '@vicons/ionicons5';

  const router = useRouter();

  // 格式化函数
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN');
  };

  const formatTimeDifference = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return `${diffSec}秒前`;
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 30) return `${diffDay}天前`;
    return formatDate(date);
  };

  // 频道统计数据
  const channelStats = reactive({
    totalViews: 12580,
    viewsGrowth: 5.2,
    subscribers: 835,
    subscribersGrowth: 2.8,
    totalVideos: 24,
    recentVideos: 3
  });

  // 最近视频
  const recentVideos = ref([
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
  const recentComments = ref([
    {
      id: '1',
      content: '这个教程太棒了，学到了很多东西！',
      createdAt: '2024-06-12T09:40:00Z',
      videoTitle: 'Vue 3 完全指南 - 组合式API详解',
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
      user: {
        nickname: 'Vue开发者',
        avatar: 'https://i.pravatar.cc/150?img=53'
      }
    }
  ]);

  // 视频列表
  const videos = ref([
    {
      id: '1',
      title: 'Vue 3 完全指南 - 组合式API详解',
      status: '已发布',
      createdAt: '2024-06-10T15:30:00Z',
      views: 1250,
      likes: 98,
      comments: 34
    },
    {
      id: '2',
      title: 'TypeScript 高级类型系统详解',
      status: '已发布',
      createdAt: '2024-06-08T10:15:00Z',
      views: 980,
      likes: 76,
      comments: 22
    },
    {
      id: '3',
      title: 'Pinia 状态管理入门',
      status: '草稿',
      createdAt: '2024-06-01T08:20:00Z',
      views: 0,
      likes: 0,
      comments: 0
    }
  ]);

  // 评论列表
  const comments = ref([
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
    },
    {
      id: '3',
      content: '很好的内容，但是有一个小错误，在12:30的地方...',
      createdAt: '2024-06-09T11:15:00Z',
      videoTitle: 'TypeScript 高级类型系统详解',
      status: '待审核',
      user: {
        nickname: 'TS大师',
        avatar: 'https://i.pravatar.cc/150?img=68'
      }
    }
  ]);

  // 主题色列表
  const themeColors = [
    '#1976d2', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#f44336', '#e91e63', '#9c27b0', '#673ab7'
  ];

  // 分页设置
  const pagination = {
    pageSize: 10
  };

  // 视频表格列
  const videoColumns = [
    {
      title: '视频标题',
      key: 'title',
      render(row) {
        return h('div', { class: 'video-title-cell' }, row.title);
      }
    },
    {
      title: '状态',
      key: 'status',
      render(row) {
        const statusClass = row.status === '已发布' ? 'status-published' : 'status-draft';
        return h('div', { class: ['status-tag', statusClass] }, row.status);
      }
    },
    {
      title: '发布日期',
      key: 'createdAt',
      render(row) {
        return formatDate(row.createdAt);
      }
    },
    {
      title: '观看',
      key: 'views',
      render(row) {
        return h('div', {}, [
          h(NIcon, { size: 16, class: 'stat-icon' }, { default: () => h(EyeOutline) }),
          ' ',
          formatNumber(row.views)
        ]);
      }
    },
    {
      title: '点赞',
      key: 'likes',
      render(row) {
        return h('div', {}, [
          h(NIcon, { size: 16, class: 'stat-icon' }, { default: () => h(HeartOutline) }),
          ' ',
          formatNumber(row.likes)
        ]);
      }
    },
    {
      title: '评论',
      key: 'comments',
      render(row) {
        return h('div', {}, [
          h(NIcon, { size: 16, class: 'stat-icon' }, { default: () => h(ChatboxOutline) }),
          ' ',
          formatNumber(row.comments)
        ]);
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h('div', { class: 'action-buttons' }, [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              ghost: true,
              onClick: () => editVideo(row.id)
            },
            { default: () => '编辑', icon: () => h(NIcon, {}, { default: () => h(CreateOutline) }) }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => deleteVideo(row.id)
            },
            {
              default: () => '确定要删除这个视频吗？',
              trigger: () => h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true
                },
                { default: () => '删除', icon: () => h(NIcon, {}, { default: () => h(TrashOutline) }) }
              )
            }
          )
        ]);
      }
    }
  ];

  // 评论表格列
  const commentColumns = [
    {
      title: '用户',
      key: 'user',
      render(row) {
        return h('div', { class: 'user-cell' }, [
          h(NAvatar, { src: row.user.avatar, round: true, size: 'small' }),
          h('span', { class: 'user-name' }, row.user.nickname)
        ]);
      }
    },
    {
      title: '评论内容',
      key: 'content',
      render(row) {
        return h('div', { class: 'comment-cell' }, [
          h('div', { class: 'comment-content' }, row.content),
          h('div', { class: 'comment-video-info' }, `在视频 "${row.videoTitle}" 下`)
        ]);
      }
    },
    {
      title: '时间',
      key: 'createdAt',
      render(row) {
        return formatTimeDifference(row.createdAt);
      }
    },
    {
      title: '状态',
      key: 'status',
      render(row) {
        const statusClass = row.status === '已审核' ? 'status-approved' : 'status-pending';
        return h('div', { class: ['status-tag', statusClass] }, row.status);
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h('div', { class: 'action-buttons' }, [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              ghost: true,
              onClick: () => replyToComment(row.id)
            },
            { default: () => '回复' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => deleteComment(row.id)
            },
            {
              default: () => '确定要删除这条评论吗？',
              trigger: () => h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true
                },
                { default: () => '删除', icon: () => h(NIcon, {}, { default: () => h(TrashBinOutline) }) }
              )
            }
          )
        ]);
      }
    }
  ];

  // 交互方法
  const handleUploadVideo = () => {
    router.push('/video/upload');
  };

  const editVideo = (id: string) => {
    router.push(`/video/edit/${id}`);
  };

  const deleteVideo = (id: string) => {
    // 实际开发中应调用API删除视频
    videos.value = videos.value.filter(v => v.id !== id);
  };

  const replyToComment = (id: string) => {
    // 实际开发中应弹出回复框
    console.log(`回复评论 ${id}`);
  };

  const deleteComment = (id: string) => {
    // 实际开发中应调用API删除评论
    comments.value = comments.value.filter(c => c.id !== id);
  };
</script>

<style scoped>
  .creator-studio {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .studio-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: var(--text-color);
  }

  .studio-content {
    background-color: var(--bg-color);
    border-radius: 8px;
    overflow: hidden;
  }

  /* 仪表盘样式 */
  .dashboard-content {
    padding: 16px 0;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stats-card {
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    margin: 8px 0;
  }

  .stat-trend {
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
  }

  .stat-trend.up {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  .stat-trend.down {
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }

  .stat-subtitle {
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  .performance-card {
    margin-bottom: 24px;
  }

  .chart-container {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-secondary);
    border-radius: 4px;
  }

  .chart-placeholder {
    color: var(--text-color-secondary);
    font-style: italic;
  }

  .recent-container {
    display: grid;
    grid-template-columns: 5fr 4fr;
    gap: 16px;
  }

  .empty-state {
    color: var(--text-color-secondary);
    text-align: center;
    padding: 32px 0;
    font-style: italic;
  }

  /* 最近视频样式 */
  .recent-video-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .recent-video-item {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .recent-video-item:last-child {
    border-bottom: none;
  }

  .video-thumbnail {
    width: 120px;
    height: 68px;
    object-fit: cover;
    border-radius: 4px;
  }

  .video-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .video-title {
    font-weight: 500;
    line-height: 1.3;
  }

  .video-meta {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  /* 评论样式 */
  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .comment-item {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
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
    margin-bottom: 4px;
  }

  .comment-user {
    font-weight: 500;
  }

  .comment-time {
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .comment-text {
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .comment-video {
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  /* 表格样式 */
  .video-table,
  .comments-table {
    margin: 16px 0;
  }

  .status-tag {
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
  }

  .status-published {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  .status-draft {
    background-color: rgba(158, 158, 158, 0.1);
    color: #9e9e9e;
  }

  .status-approved {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  .status-pending {
    background-color: rgba(255, 152, 0, 0.1);
    color: #ff9800;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .stat-icon {
    vertical-align: middle;
    margin-right: 4px;
  }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-name {
    font-weight: 500;
  }

  .comment-cell {
    display: flex;
    flex-direction: column;
  }

  .comment-video-info {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: 4px;
  }

  /* 上传区域样式 */
  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--text-color-secondary);
    gap: 8px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .stats-cards {
      grid-template-columns: 1fr;
    }

    .recent-container {
      grid-template-columns: 1fr;
    }

    .video-thumbnail {
      width: 80px;
      height: 45px;
    }
  }
</style>