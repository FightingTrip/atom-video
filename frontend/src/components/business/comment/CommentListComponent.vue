/**
* @file CommentListComponent.vue
* @description 评论列表组件 - 展示和管理评论的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input">
      <n-input v-model:value="commentText" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="写下你的评论..." @keydown.enter.ctrl="handlePostComment" class="comment-textarea" />
      <div class="input-footer">
        <span class="input-tip">Ctrl + Enter 发送</span>
        <n-button type="primary" :disabled="!commentText.trim()" @click="handlePostComment" class="submit-button">
          发表评论
        </n-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list" v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- 评论内容 -->
        <div class="comment-content">
          <n-avatar round :size="40" :src="comment.author.avatar" @click="handleAuthorClick(comment.author.id)"
            class="user-avatar" />
          <div class="comment-main">
            <div class="comment-header">
              <span class="author-name" @click="handleAuthorClick(comment.author.id)">
                {{ comment.author.nickname }}
              </span>
              <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <n-button text @click="handleLike(comment)" class="action-button">
                <template #icon>
                  <n-icon>
                    <ThumbsUp v-if="comment.isLiked" />
                    <ThumbsUpOutline v-else />
                  </n-icon>
                </template>
                {{ formatNumber(comment.likes) }}
              </n-button>
              <n-button text @click="handleReply(comment)" class="action-button">
                <template #icon>
                  <n-icon>
                    <ChatbubbleOutline />
                  </n-icon>
                </template>
                回复
              </n-button>
            </div>

            <!-- 回复输入框 -->
            <div v-if="replyingTo?.id === comment.id" class="reply-input">
              <n-input v-model:value="replyText" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="回复评论..." @keydown.enter.ctrl="handlePostReply" class="reply-textarea" />
              <div class="input-footer">
                <span class="input-tip">Ctrl + Enter 发送</span>
                <div class="button-group">
                  <n-button @click="cancelReply" class="cancel-button">取消</n-button>
                  <n-button type="primary" :disabled="!replyText.trim()" @click="handlePostReply" class="submit-button">
                    回复
                  </n-button>
                </div>
              </div>
            </div>

            <!-- 回复列表 -->
            <div v-if="comment.replies?.length" class="reply-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <n-avatar round :size="32" :src="reply.author.avatar" @click="handleAuthorClick(reply.author.id)"
                  class="user-avatar-small" />
                <div class="reply-main">
                  <div class="reply-header">
                    <span class="author-name" @click="handleAuthorClick(reply.author.id)">
                      {{ reply.author.nickname }}
                    </span>
                    <span class="reply-time">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <p class="reply-text">{{ reply.content }}</p>
                  <div class="reply-actions">
                    <n-button text @click="handleLike(reply)" class="action-button">
                      <template #icon>
                        <n-icon>
                          <ThumbsUp v-if="reply.isLiked" />
                          <ThumbsUpOutline v-else />
                        </n-icon>
                      </template>
                      {{ formatNumber(reply.likes) }}
                    </n-button>
                    <n-button text @click="handleReply(comment, reply)" class="action-button">
                      <template #icon>
                        <n-icon>
                          <ChatbubbleOutline />
                        </n-icon>
                      </template>
                      回复
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" ref="loadMoreRef" class="load-more">
      <n-spin v-if="loading" />
      <n-button v-else text @click="handleLoadMore" class="load-more-button">
        加载更多评论
      </n-button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && comments.length === 0" class="empty-state">
      <n-empty description="暂无评论" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIntersectionObserver } from '@vueuse/core';
  import {
    NInput,
    NButton,
    NAvatar,
    NIcon,
    NSpin,
    NEmpty
  } from 'naive-ui';
  import {
    ThumbsUp,
    ThumbsUpOutline,
    ChatbubbleOutline
  } from '@vicons/ionicons5';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';
  import type { Comment, Reply } from '@/types';

  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');

  // Props 定义
  interface Props {
    comments: Comment[];
    loading?: boolean;
    hasMore?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    hasMore: false
  });

  // Emits 定义
  const emit = defineEmits<{
    (e: 'post', content: string): void;
    (e: 'reply', commentId: string, content: string, replyToId?: string): void;
    (e: 'like', commentId: string): void;
    (e: 'load-more'): void;
  }>();

  const router = useRouter();

  // 状态管理
  const commentText = ref('');
  const replyText = ref('');
  const replyingTo = ref<{
    id: string;
    replyTo?: { id: string; author: { nickname: string } };
  } | null>(null);

  // 加载更多元素引用
  const loadMoreRef = ref<HTMLElement | null>(null);

  // 设置交叉观察
  useIntersectionObserver(
    loadMoreRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !props.loading && props.hasMore) {
        handleLoadMore();
      }
    },
    { threshold: 0.5 }
  );

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 格式化日期
  const formatDate = (date: string) => {
    return dayjs(date).fromNow();
  };

  // 处理评论
  const handlePostComment = () => {
    const content = commentText.value.trim();
    if (!content) return;

    emit('post', content);
    commentText.value = '';
  };

  // 处理回复
  const handleReply = (comment: Comment, replyTo?: Comment | Reply) => {
    replyingTo.value = {
      id: comment.id,
      replyTo: replyTo
        ? {
          id: replyTo.id,
          author: { nickname: replyTo.author.nickname }
        }
        : undefined
    };
    replyText.value = replyTo ? `@${replyTo.author.nickname} ` : '';
  };

  const handlePostReply = () => {
    if (!replyingTo.value) return;

    const content = replyText.value.trim();
    if (!content) return;

    emit('reply', replyingTo.value.id, content, replyingTo.value.replyTo?.id);
    cancelReply();
  };

  const cancelReply = () => {
    replyingTo.value = null;
    replyText.value = '';
  };

  // 处理点赞
  const handleLike = (item: Comment | Reply) => {
    emit('like', item.id);
  };

  // 处理加载更多
  const handleLoadMore = () => {
    if (!props.loading && props.hasMore) {
      emit('load-more');
    }
  };

  // 处理作者点击
  const handleAuthorClick = (authorId: string) => {
    router.push(`/user/${authorId}`);
  };
</script>

<style scoped>
  .comment-section {
    margin-top: var(--spacing-xl);
    background-color: var(--bg-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .comment-input {
    margin-bottom: var(--spacing-xl);
  }

  .comment-textarea {
    width: 100%;
    background-color: var(--bg-color-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    color: var(--text-color);
    transition: border-color 0.2s ease;
  }

  .comment-textarea:focus {
    border-color: var(--primary-color);
  }

  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-sm);
  }

  .input-tip {
    color: var(--text-color-secondary);
    font-size: var(--text-sm);
  }

  .submit-button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-full);
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .submit-button:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
  }

  .submit-button:disabled {
    background-color: var(--bg-color-tertiary);
    color: var(--text-color-secondary);
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
    padding: var(--spacing-md);
    background-color: var(--bg-color-secondary);
    border-radius: var(--radius-lg);
    transition: background-color 0.2s ease;
  }

  .comment-item:hover {
    background-color: var(--bg-color-tertiary);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }

  .comment-main {
    flex: 1;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }

  .author-name {
    font-weight: 500;
    color: var(--text-color);
    cursor: pointer;
  }

  .comment-time {
    color: var(--text-color-secondary);
    font-size: var(--text-sm);
  }

  .comment-text {
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
  }

  .comment-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .action-button {
    color: var(--text-color-secondary);
    font-size: var(--text-sm);
    transition: color 0.2s ease;
  }

  .action-button:hover {
    color: var(--text-color);
  }

  /* 暗色模式特定样式 */
  :root.dark .comment-section,
  .dark-mode .comment-section {
    background-color: var(--bg-color-dark);
  }

  :root.dark .comment-textarea,
  .dark-mode .comment-textarea {
    background-color: var(--bg-color-darker);
    border-color: var(--border-color-dark);
    color: var(--text-color-dark);
  }

  :root.dark .input-tip,
  .dark-mode .input-tip {
    color: var(--text-color-secondary-dark);
  }

  :root.dark .comment-item,
  .dark-mode .comment-item {
    background-color: var(--bg-color-darker);
  }

  :root.dark .comment-item:hover,
  .dark-mode .comment-item:hover {
    background-color: var(--bg-color-darkest);
  }

  :root.dark .author-name,
  .dark-mode .author-name {
    color: var(--text-color-dark);
  }

  :root.dark .comment-time,
  .dark-mode .comment-time {
    color: var(--text-color-secondary-dark);
  }

  :root.dark .comment-text,
  .dark-mode .comment-text {
    color: var(--text-color-dark);
  }

  :root.dark .action-button,
  .dark-mode .action-button {
    color: var(--text-color-secondary-dark);
  }

  :root.dark .action-button:hover,
  .dark-mode .action-button:hover {
    color: var(--text-color-dark);
  }

  .reply-input {
    margin-top: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .reply-list {
    margin-top: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding-left: var(--spacing-md);
    border-left: 2px solid var(--border-light);
  }

  .reply-item {
    display: flex;
    gap: var(--spacing-sm);
  }

  .reply-main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .load-more {
    display: flex;
    justify-content: center;
    padding: var(--spacing-md) 0;
  }

  .load-more-button {
    color: var(--primary-color);
    background: none;
    border: none;
    transition: color var(--transition-normal);
  }

  .load-more-button:hover {
    color: var(--primary-color-dark);
  }

  .empty-state {
    padding: var(--spacing-xl) 0;
  }
</style>