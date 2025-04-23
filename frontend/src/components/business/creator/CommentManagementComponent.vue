<template>
  <div class="comments-management">
    <div class="comments-header">
      <h3 class="section-title">{{ title || '评论管理' }}</h3>
      <div class="filters">
        <n-input v-model:value="searchQuery" placeholder="搜索评论..." class="search-input">
          <template #prefix>
            <n-icon>
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>
        <n-select v-model:value="videoFilter" :options="videoOptions" placeholder="全部视频" clearable />
        <n-select v-model:value="statusFilter" :options="statusOptions" placeholder="全部状态" clearable />
      </div>
    </div>

    <n-data-table :columns="commentColumns" :data="comments" :pagination="pagination" :bordered="false"
      :loading="loading" class="comments-table" />
  </div>
</template>

<script setup lang="ts">
  import { h, ref, onMounted, computed, watch } from 'vue';
  import { NButton, NDataTable, NAvatar, NPopconfirm, NTag, NIcon, NInput, NSelect } from 'naive-ui';
  import { VideocamOutline, TrashBinOutline, SearchOutline } from '@vicons/ionicons5';
  import creatorService from '@/services/creator/creatorService';
  import type { CreatorComment } from '@/services/creator/types';
  import { useMessage } from 'naive-ui';

  interface Props {
    title?: string;
  }

  defineProps<Props>();

  const emit = defineEmits<{
    (e: 'reply', commentId: string): void
    (e: 'delete', commentId: string): void
  }>();

  const message = useMessage();
  const loading = ref(false);
  const comments = ref<CreatorComment[]>([]);
  const searchQuery = ref('');
  const videoFilter = ref(null);
  const statusFilter = ref(null);
  const videoOptions = ref([]);

  // 分页设置
  const pagination = ref({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    onChange: (page: number) => {
      pagination.value.page = page;
      fetchComments();
    }
  });

  // 状态选项
  const statusOptions = [
    { label: '全部状态', value: null },
    { label: '已审核', value: 'visible' },
    { label: '待审核', value: 'pending' },
    { label: '已隐藏', value: 'hidden' }
  ];

  // 格式化函数
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
    return new Date(date).toLocaleDateString('zh-CN');
  };

  // 获取评论列表
  const fetchComments = async () => {
    loading.value = true;
    try {
      const params = {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
        videoId: videoFilter.value,
        status: statusFilter.value
      };

      const result = await creatorService.getCreatorComments(params);
      comments.value = result.data;
      pagination.value.itemCount = result.total;
    } catch (error) {
      console.error('获取评论失败:', error);
      message.error('获取评论失败，请稍后重试');
    } finally {
      loading.value = false;
    }
  };

  // 获取视频选项
  const fetchVideoOptions = async () => {
    try {
      const result = await creatorService.getCreatorVideos({ pageSize: 100 });
      videoOptions.value = result.data.map(video => ({
        label: video.title,
        value: video.id
      }));
      // 添加全部视频选项
      videoOptions.value.unshift({ label: '全部视频', value: null });
    } catch (error) {
      console.error('获取视频选项失败:', error);
    }
  };

  // 处理回复评论
  const handleReplyComment = (id: string) => {
    emit('reply', id);
  };

  // 处理删除评论
  const handleDeleteComment = async (id: string) => {
    loading.value = true;
    try {
      const result = await creatorService.deleteComment(id);
      if (result.success) {
        message.success('评论已删除');
        emit('delete', id);
        // 重新获取评论列表
        await fetchComments();
      } else {
        message.error(`删除失败: ${result.message}`);
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      message.error('删除评论失败，请稍后重试');
    } finally {
      loading.value = false;
    }
  };

  // 监听筛选变化
  watch([searchQuery, videoFilter, statusFilter], () => {
    pagination.value.page = 1;
    fetchComments();
  }, { debounce: 300 });

  // 评论表格列
  const commentColumns = [
    {
      title: '用户',
      key: 'user',
      render(row: CreatorComment) {
        return h('div', { class: 'user-cell' }, [
          h(NAvatar, { src: row.user.avatar, round: true, size: 'small' }),
          h('span', { class: 'user-name' }, row.user.nickname)
        ]);
      }
    },
    {
      title: '评论内容',
      key: 'content',
      render(row: CreatorComment) {
        return h('div', { class: 'comment-cell' }, [
          h('div', { class: 'comment-content' }, row.content),
          h('div', { class: 'comment-video-info' }, [
            h(NIcon, { size: 14 }, { default: () => h(VideocamOutline) }),
            ' ' + row.videoTitle
          ])
        ]);
      }
    },
    {
      title: '时间',
      key: 'createdAt',
      render(row: CreatorComment) {
        return formatTimeDifference(row.createdAt);
      }
    },
    {
      title: '状态',
      key: 'status',
      render(row: CreatorComment) {
        const statusMap: Record<string, { type: 'success' | 'warning' | 'default' | 'error', icon: string }> = {
          'visible': { type: 'success', icon: 'check-circle' },
          'pending': { type: 'warning', icon: 'time' },
          'hidden': { type: 'error', icon: 'close-circle' }
        };
        const status = row.status && statusMap[row.status] || { type: 'default', icon: 'information-circle' };

        return h(NTag, {
          type: status.type,
          size: 'small',
          round: true
        }, {
          default: () => row.status === 'visible' ? '已审核' :
            row.status === 'pending' ? '待审核' :
              row.status === 'hidden' ? '已隐藏' : '未知状态'
        });
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row: CreatorComment) {
        return h('div', { class: 'action-buttons' }, [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () => handleReplyComment(row.id)
            },
            { default: () => '回复' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDeleteComment(row.id)
            },
            {
              default: () => '确定要删除这条评论吗？',
              trigger: () => h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  secondary: true
                },
                { default: () => '删除', icon: () => h(NIcon, {}, { default: () => h(TrashBinOutline) }) }
              )
            }
          )
        ]);
      }
    }
  ];

  // 初始化
  onMounted(() => {
    fetchComments();
    fetchVideoOptions();
  });
</script>

<style scoped>
  .comments-management {
    padding: 24px;
  }

  .comments-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .filters {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .search-input {
    min-width: 240px;
  }

  .comments-table {
    margin-bottom: 24px;
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
    gap: 4px;
  }

  .comment-content {
    line-height: 1.5;
  }

  .comment-video-info {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.5);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 768px) {
    .comments-management {
      padding: 16px;
    }

    .filters {
      flex-direction: column;
    }
  }
</style>