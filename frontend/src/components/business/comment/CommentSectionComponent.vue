/**
* @file CommentSectionComponent.vue
* @description 评论区组件 - 包含评论输入框和评论列表的业务组件
* @author Atom Video Team
* @date 2025-04-09
*
* @features
* - 评论列表展示
* - 评论输入和提交
* - 回复功能
* - 评论点赞
* - 加载状态
* - 错误处理
* - 响应式布局
*/

<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input-container">
      <n-avatar :src="userAvatar" :round="true" class="user-avatar" />
      <div class="comment-input-wrapper">
        <n-input v-model:value="commentText" type="textarea" placeholder="添加评论..."
          :autosize="{ minRows: 2, maxRows: 6 }" class="comment-textarea" />
        <div class="comment-actions">
          <n-button @click="commentText = ''" class="cancel-button">取消</n-button>
          <n-button type="primary" :disabled="!commentText.trim()" @click="submitComment" class="submit-button">
            评论
          </n-button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <n-avatar :src="comment.user.avatar" :round="true" class="user-avatar" />
        <div class="comment-content">
          <div class="comment-header">
            <router-link :to="`/user/${comment.user.id}`" class="user-link">
              {{ comment.user.nickname }}
            </router-link>
            <span class="timestamp">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-actions">
            <button class="action-button" @click="handleLike(comment)">
              <n-icon>
                <ThumbsUp v-if="comment.isLiked" />
                <ThumbsUpOutline v-else />
              </n-icon>
              {{ formatNumber(comment.likes) }}
            </button>
            <button class="action-button" @click="handleReply(comment)">
              回复
            </button>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyingTo?.id === comment.id" class="reply-input-container">
            <n-input v-model:value="replyText" type="textarea" placeholder="回复评论..."
              :autosize="{ minRows: 2, maxRows: 4 }" class="reply-textarea" />
            <div class="reply-actions">
              <n-button @click="cancelReply" class="cancel-button">取消</n-button>
              <n-button type="primary" :disabled="!replyText.trim()" @click="submitReply" class="submit-button">
                回复
              </n-button>
            </div>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.replies?.length" class="reply-list">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <n-avatar :src="reply.user.avatar" :round="true" :size="32" class="user-avatar-small" />
              <div class="reply-content">
                <div class="reply-header">
                  <router-link :to="`/user/${reply.user.id}`" class="user-link">
                    {{ reply.user.nickname }}
                  </router-link>
                  <span class="timestamp">{{ formatTime(reply.createdAt) }}</span>
                </div>
                <p class="reply-text">{{ reply.content }}</p>
                <div class="reply-actions">
                  <button class="action-button" @click="handleLike(reply)">
                    <n-icon>
                      <ThumbsUp v-if="reply.isLiked" />
                      <ThumbsUpOutline v-else />
                    </n-icon>
                    {{ formatNumber(reply.likes) }}
                  </button>
                  <button class="action-button" @click="handleReply(comment, reply)">
                    回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { NAvatar, NInput, NButton, NIcon } from 'naive-ui';
  import { ThumbsUp, ThumbsUpOutline } from '@vicons/ionicons5';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';
  import type { Comment } from '@/types';

  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');

  // Props 定义
  interface Props {
    comments: Comment[];
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'post', content: string): void;
    (e: 'reply', commentId: string, content: string, replyToId?: string): void;
    (e: 'like', commentId: string): void;
  }>();

  const authStore = useAuthStore();
  const userAvatar = computed(() => authStore.user?.avatar || '/default-avatar.png');

  // 状态管理
  const commentText = ref('');
  const replyText = ref('');
  const replyingTo = ref<{
    id: string;
    replyTo?: { id: string; user: { nickname: string } };
  } | null>(null);

  // 格式化时间
  const formatTime = (date: string) => {
    return dayjs(date).fromNow();
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 提交评论
  const submitComment = () => {
    const content = commentText.value.trim();
    if (!content) return;

    emit('post', content);
    commentText.value = '';
  };

  // 处理回复
  const handleReply = (comment: Comment, replyTo?: Comment) => {
    replyingTo.value = {
      id: comment.id,
      replyTo: replyTo
        ? {
          id: replyTo.id,
          user: { nickname: replyTo.user.nickname }
        }
        : undefined
    };
    replyText.value = replyTo ? `@${replyTo.user.nickname} ` : '';
  };

  // 提交回复
  const submitReply = () => {
    if (!replyingTo.value) return;

    const content = replyText.value.trim();
    if (!content) return;

    emit('reply', replyingTo.value.id, content, replyingTo.value.replyTo?.id);
    cancelReply();
  };

  // 取消回复
  const cancelReply = () => {
    replyingTo.value = null;
    replyText.value = '';
  };

  // 处理点赞
  const handleLike = (comment: Comment) => {
    emit('like', comment.id);
  };
</script>

<style scoped>
  .comment-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .comment-input-container {
    display: flex;
    gap: var(--spacing-md);
  }

  .user-avatar {
    flex-shrink: 0;
  }

  .user-avatar-small {
    flex-shrink: 0;
  }

  .comment-input-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .comment-textarea,
  .reply-textarea {
    width: 100%;
  }

  .comment-actions,
  .reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
  }

  .cancel-button {
    color: var(--text-secondary);
    background-color: transparent;
    border: 1px solid var(--border-light);
    transition: all var(--transition-normal);
  }

  .cancel-button:hover {
    color: var(--text-primary);
    border-color: var(--border-dark);
  }

  .submit-button {
    color: var(--text-inverse);
    background-color: var(--primary-color);
    border: none;
    transition: background-color var(--transition-normal);
  }

  .submit-button:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
  }

  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .comment-item {
    display: flex;
    gap: var(--spacing-md);
  }

  .comment-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .comment-header,
  .reply-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .user-link {
    font-weight: 500;
    color: var(--text-primary);
    transition: color var(--transition-normal);
  }

  .user-link:hover {
    color: var(--primary-color);
  }

  .timestamp {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .comment-text,
  .reply-text {
    color: var(--text-primary);
    line-height: 1.5;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    transition: color var(--transition-normal);
  }

  .action-button:hover {
    color: var(--text-primary);
  }

  .reply-input-container {
    margin-top: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .reply-list {
    margin-top: var(--spacing-md);
    margin-left: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    border-left: 2px solid var(--border-light);
    padding-left: var(--spacing-md);
  }

  .reply-item {
    display: flex;
    gap: var(--spacing-sm);
  }

  .reply-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>