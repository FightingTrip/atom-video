<template>
  <n-card :title="title || '最近评论'" class="recent-comments">
    <div v-if="comments.length === 0" class="empty-state">
      <n-empty description="还没有新评论" />
    </div>
    <div v-else class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <n-avatar :src="comment.user.avatar" round size="small" />
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-user">{{ comment.user.nickname }}</span>
            <span class="comment-time">{{ formatTimeDifference(comment.createdAt) }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-video">
            <n-icon size="14" class="meta-icon">
              <VideocamOutline />
            </n-icon>
            {{ comment.videoTitle }}
          </div>
        </div>
        <div class="comment-actions">
          <n-button size="tiny" text @click="handleReply(comment.id)">回复</n-button>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { NCard, NEmpty, NAvatar, NButton, NIcon } from 'naive-ui';
  import { VideocamOutline } from '@vicons/ionicons5';
  import { Comment } from '@/types/comment';

  interface Props {
    title?: string;
    comments?: Comment[];
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '最近评论',
    comments: () => []
  });

  const emit = defineEmits<{
    (e: 'reply', commentId: string): void
  }>();

  // 格式化时间差异
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

  // 处理回复
  const handleReply = (commentId: string) => {
    emit('reply', commentId);
  };
</script>

<style scoped>
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
</style>