/**
* @file VideoManagementComponent.vue
* @description 创作者视频管理组件，用于管理视频内容
* @author Atom Video Team
* @date 2025-04-15
*/

<template>
  <div class="video-management">
    <div class="management-header">
      <h3 class="management-title">{{ title }}</h3>
      <div class="header-actions">
        <n-input-group>
          <n-input v-model:value="searchQuery" placeholder="搜索视频..." clearable>
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
          <n-select v-model:value="filterStatus" :options="statusOptions" placeholder="状态" style="width: 120px" />
        </n-input-group>
        <n-button type="primary" @click="handleUploadVideo">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          上传视频
        </n-button>
      </div>
    </div>

    <div class="table-container">
      <n-data-table :columns="columns" :data="filteredVideos" :pagination="pagination" :bordered="false"
        :loading="loading" :row-key="(row) => row.id" />
    </div>

    <!-- 确认删除对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" positive-text="删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="cancelDelete">
      <template #default>
        <p>确定要删除视频「{{ videoToDelete?.title || '' }}」吗？</p>
        <p class="text-warning">此操作无法撤销，视频数据将永久删除。</p>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    NDataTable,
    NButton,
    NTag,
    NSpace,
    NPopover,
    NIcon,
    NModal,
    NInput,
    NInputGroup,
    NSelect
  } from 'naive-ui';
  import {
    CreateOutline,
    TrashOutline,
    EyeOutline,
    LockClosedOutline,
    TimeOutline,
    StatsChartOutline,
    PlayOutline,
    AddOutline,
    SearchOutline,
    ShareSocialOutline
  } from '@vicons/ionicons5';

  const props = defineProps({
    title: {
      type: String,
      default: '视频管理'
    }
  });

  const router = useRouter();

  // 视频列表状态
  const loading = ref(false);
  const videos = ref([
    {
      id: '1',
      title: 'Vue 3 完全指南 - 组合式API详解',
      thumbnail: 'https://picsum.photos/id/237/400/225',
      status: 'published',
      privacy: 'public',
      uploadDate: '2024-06-10T15:30:00Z',
      views: 1250,
      likes: 98,
      comments: 34,
      duration: '18:24'
    },
    {
      id: '2',
      title: 'TypeScript 高级类型系统详解',
      thumbnail: 'https://picsum.photos/id/238/400/225',
      status: 'published',
      privacy: 'public',
      uploadDate: '2024-06-08T10:15:00Z',
      views: 980,
      likes: 76,
      comments: 22,
      duration: '22:15'
    },
    {
      id: '3',
      title: 'Pinia 状态管理入门',
      thumbnail: 'https://picsum.photos/id/239/400/225',
      status: 'draft',
      privacy: 'private',
      uploadDate: '2024-06-01T08:20:00Z',
      views: 0,
      likes: 0,
      comments: 0,
      duration: '15:08'
    },
    {
      id: '4',
      title: 'Vite 构建工具深入解析',
      thumbnail: 'https://picsum.photos/id/240/400/225',
      status: 'processing',
      privacy: 'private',
      uploadDate: '2024-06-15T14:45:00Z',
      views: 0,
      likes: 0,
      comments: 0,
      duration: '20:30'
    },
    {
      id: '5',
      title: 'Vue 3 和 React 18 对比分析',
      thumbnail: 'https://picsum.photos/id/241/400/225',
      status: 'scheduled',
      privacy: 'public',
      uploadDate: '2024-06-20T10:00:00Z', // 这是计划发布时间
      views: 0,
      likes: 0,
      comments: 0,
      duration: '25:42'
    }
  ]);

  // 搜索和筛选
  const searchQuery = ref('');
  const filterStatus = ref(null);
  const statusOptions = [
    { label: '全部状态', value: null },
    { label: '已发布', value: 'published' },
    { label: '草稿', value: 'draft' },
    { label: '处理中', value: 'processing' },
    { label: '计划发布', value: 'scheduled' }
  ];

  // 删除确认
  const showDeleteModal = ref(false);
  const videoToDelete = ref<{ id: string, title: string } | null>(null);

  // 分页配置
  const pagination = {
    pageSize: 10
  };

  // 表格列配置
  const createColumns = () => {
    return [
      {
        title: '视频',
        key: 'title',
        render(row: any) {
          return h('div', { class: 'video-info-cell' }, [
            h('img', {
              src: row.thumbnail,
              class: 'video-thumbnail'
            }),
            h('div', { class: 'video-details' }, [
              h('div', { class: 'video-title' }, row.title),
              h('div', { class: 'video-meta' }, [
                h('span', { class: 'video-duration' }, [
                  h(NIcon, { size: 14 }, { default: () => h(TimeOutline) }),
                  ' ' + row.duration
                ])
              ])
            ])
          ]);
        }
      },
      {
        title: '状态',
        key: 'status',
        width: 120,
        render(row: any) {
          const statusMap: Record<string, { text: string, type: 'success' | 'warning' | 'info' | 'error' | 'default' }> = {
            published: { text: '已发布', type: 'success' },
            draft: { text: '草稿', type: 'default' },
            processing: { text: '处理中', type: 'warning' },
            scheduled: { text: '计划发布', type: 'info' }
          };

          const status = statusMap[row.status] || { text: row.status, type: 'default' };

          return h(NTag, {
            type: status.type,
            size: 'small',
            round: true
          }, { default: () => status.text });
        }
      },
      {
        title: '可见性',
        key: 'privacy',
        width: 100,
        render(row: any) {
          const privacyMap: Record<string, { text: string, icon: any }> = {
            public: { text: '公开', icon: EyeOutline },
            private: { text: '私有', icon: LockClosedOutline }
          };

          const privacy = privacyMap[row.privacy] || { text: row.privacy, icon: EyeOutline };

          return h(NPopover, {
            trigger: 'hover'
          }, {
            trigger: () => h('div', { class: 'privacy-info' }, [
              h(NIcon, { size: 16 }, { default: () => h(privacy.icon) }),
              ' ' + privacy.text
            ]),
            default: () => `此视频为${privacy.text}可见`
          });
        }
      },
      {
        title: '上传日期',
        key: 'uploadDate',
        width: 120,
        render(row: any) {
          return formatDate(row.uploadDate);
        }
      },
      {
        title: '数据',
        key: 'stats',
        render(row: any) {
          return h('div', { class: 'video-stats' }, [
            h('span', { class: 'stat-item' }, [
              h(NIcon, { size: 16 }, { default: () => h(EyeOutline) }),
              ' ' + formatNumber(row.views)
            ]),
            h('span', { class: 'stat-item' }, [
              h(NIcon, { size: 16 }, { default: () => h(ThumbsUpOutline) }),
              ' ' + formatNumber(row.likes)
            ]),
            h('span', { class: 'stat-item' }, [
              h(NIcon, { size: 16 }, { default: () => h(ChatbubbleOutline) }),
              ' ' + formatNumber(row.comments)
            ])
          ]);
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 250,
        render(row: any) {
          return h(NSpace, { align: 'center' }, {
            default: () => [
              h(NButton, {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => previewVideo(row.id)
              }, { icon: () => h(NIcon, {}, { default: () => h(PlayOutline) }) }),

              h(NButton, {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => editVideo(row.id)
              }, { icon: () => h(NIcon, {}, { default: () => h(CreateOutline) }) }),

              h(NButton, {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => viewStats(row.id)
              }, { icon: () => h(NIcon, {}, { default: () => h(StatsChartOutline) }) }),

              h(NButton, {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => shareVideo(row.id)
              }, { icon: () => h(NIcon, {}, { default: () => h(ShareSocialOutline) }) }),

              h(NButton, {
                size: 'small',
                quaternary: true,
                circle: true,
                type: 'error',
                onClick: () => handleDelete(row)
              }, { icon: () => h(NIcon, {}, { default: () => h(TrashOutline) }) })
            ]
          });
        }
      }
    ];
  };

  // 计算列和筛选后的视频列表
  const columns = createColumns();
  const filteredVideos = computed(() => {
    let result = videos.value;

    // 应用搜索
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(video =>
        video.title.toLowerCase().includes(query)
      );
    }

    // 应用状态筛选
    if (filterStatus.value) {
      result = result.filter(video => video.status === filterStatus.value);
    }

    return result;
  });

  // 功能实现
  const handleUploadVideo = () => {
    router.push('/video/upload');
  };

  const previewVideo = (id: string) => {
    // 打开视频预览
    router.push(`/video/${id}`);
  };

  const editVideo = (id: string) => {
    // 打开视频编辑页面
    router.push(`/video/edit/${id}`);
  };

  const viewStats = (id: string) => {
    // 打开统计分析页面
    router.push(`/creator/analytics/video/${id}`);
  };

  const shareVideo = (id: string) => {
    // 实现分享功能，可以是弹出分享对话框
    console.log('分享视频', id);
  };

  const handleDelete = (video: any) => {
    videoToDelete.value = { id: video.id, title: video.title };
    showDeleteModal.value = true;
  };

  const confirmDelete = () => {
    if (videoToDelete.value) {
      // 实际开发中应调用API删除视频
      videos.value = videos.value.filter(v => v.id !== videoToDelete.value?.id);
      videoToDelete.value = null;
      showDeleteModal.value = false;
    }
  };

  const cancelDelete = () => {
    videoToDelete.value = null;
    showDeleteModal.value = false;
  };

  // 工具函数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  import {
    ThumbsUpOutline,
    ChatbubbleOutline
  } from '@vicons/ionicons5';
</script>

<style scoped>
  .video-management {
    width: 100%;
  }

  .management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .management-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .table-container {
    margin-bottom: 24px;
  }

  /* 视频信息单元格样式 */
  .video-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .video-thumbnail {
    width: 120px;
    height: 68px;
    object-fit: cover;
    border-radius: 4px;
  }

  .video-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .video-title {
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .video-meta {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .video-duration {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 统计信息样式 */
  .video-stats {
    display: flex;
    gap: 12px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }

  /* 隐私设置样式 */
  .privacy-info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }

  /* 警告文本 */
  .text-warning {
    color: var(--error-color);
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .management-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .video-thumbnail {
      width: 80px;
      height: 45px;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>