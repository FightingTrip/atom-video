<template>
  <div class="comments-management">
    <n-data-table :columns="commentColumns" :data="comments" :pagination="pagination" :bordered="false"
      class="comments-table" />
  </div>
</template>

<script setup lang="ts">
  import { h, ref } from 'vue';
  import { NButton, NDataTable, NAvatar, NPopconfirm, NTag, NIcon } from 'naive-ui';
  import { VideocamOutline, TrashBinOutline } from '@vicons/ionicons5';
  import { Comment } from '@/types/comment';

  interface Props {
    title?: string;
  }

  defineProps<Props>();

  const emit = defineEmits<{
    (e: 'reply', commentId: string): void
    (e: 'delete', commentId: string): void
  }>();

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

  // 评论列表
  const comments = ref<Comment[]>([
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

  // 分页设置
  const pagination = {
    pageSize: 10
  };

  // 处理回复评论
  const handleReplyComment = (id: string) => {
    emit('reply', id);
  };

  // 处理删除评论
  const handleDeleteComment = (id: string) => {
    emit('delete', id);
    comments.value = comments.value.filter(c => c.id !== id);
  };

  // 评论表格列
  const commentColumns = [
    {
      title: '用户',
      key: 'user',
      render(row: Comment) {
        return h('div', { class: 'user-cell' }, [
          h(NAvatar, { src: row.user.avatar, round: true, size: 'small' }),
          h('span', { class: 'user-name' }, row.user.nickname)
        ]);
      }
    },
    {
      title: '评论内容',
      key: 'content',
      render(row: Comment) {
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
      render(row: Comment) {
        return formatTimeDifference(row.createdAt);
      }
    },
    {
      title: '状态',
      key: 'status',
      render(row: Comment) {
        const statusMap: Record<string, { type: 'success' | 'warning' | 'default', icon: string }> = {
          '已审核': { type: 'success', icon: 'check-circle' },
          '待审核': { type: 'warning', icon: 'time' }
        };
        const status = statusMap[row.status] || { type: 'default', icon: 'information-circle' };

        return h(NTag, {
          type: status.type,
          size: 'small',
          round: true
        }, { default: () => row.status });
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row: Comment) {
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
</script>

<style scoped>
  .comments-management {
    padding: 24px;
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
  }
</style>