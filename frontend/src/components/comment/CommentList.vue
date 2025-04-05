<!--
 * @description 评论列表组件
 * @features
 * - 评论列表展示：支持多级评论嵌套
 * - 评论功能：发表评论、回复评论
 * - 互动功能：点赞评论
 * - 分页加载：支持无限滚动
 * - 响应式布局
 * - 主题适配
 * @dependencies
 * - naive-ui: UI组件库
 * - @vueuse/core: 实用工具集
 * - dayjs: 日期处理
 -->

<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input">
      <n-input v-model:value="commentText" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="写下你的评论..." @keydown.enter.ctrl="handlePostComment" />
      <div class="input-footer">
        <span class="input-tip">Ctrl + Enter 发送</span>
        <n-button type="primary" :disabled="!commentText.trim()" @click="handlePostComment">
          发表评论
        </n-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list" v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- 评论内容 -->
        <div class="comment-content">
          <n-avatar round :size="40" :src="comment.author.avatar" @click="handleAuthorClick(comment.author.id)" />
          <div class="comment-main">
            <div class="comment-header">
              <span class="author-name" @click="handleAuthorClick(comment.author.id)">
                {{ comment.author.nickname }}
              </span>
              <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <n-button text @click="handleLike(comment)">
                <template #icon>
                  <n-icon>
                    <ThumbsUp v-if="comment.isLiked" />
                    <ThumbsUpOutline v-else />
                  </n-icon>
                </template>
                {{ formatNumber(comment.likes) }}
              </n-button>
              <n-button text @click="handleReply(comment)">
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
                placeholder="回复评论..." @keydown.enter.ctrl="handlePostReply" />
              <div class="input-footer">
                <span class="input-tip">Ctrl + Enter 发送</span>
                <div class="button-group">
                  <n-button @click="cancelReply">取消</n-button>
                  <n-button type="primary" :disabled="!replyText.trim()" @click="handlePostReply">
                    回复
                  </n-button>
                </div>
              </div>
            </div>

            <!-- 回复列表 -->
            <div v-if="comment.replies?.length" class="reply-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <n-avatar round :size="32" :src="reply.author.avatar" @click="handleAuthorClick(reply.author.id)" />
                <div class="reply-main">
                  <div class="reply-header">
                    <span class="author-name" @click="handleAuthorClick(reply.author.id)">
                      {{ reply.author.nickname }}
                    </span>
                    <span class="reply-time">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <p class="reply-text">{{ reply.content }}</p>
                  <div class="reply-actions">
                    <n-button text @click="handleLike(reply)">
                      <template #icon>
                        <n-icon>
                          <ThumbsUp v-if="reply.isLiked" />
                          <ThumbsUpOutline v-else />
                        </n-icon>
                      </template>
                      {{ formatNumber(reply.likes) }}
                    </n-button>
                    <n-button text @click="handleReply(comment, reply)">
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
      <n-button v-else text @click="handleLoadMore">
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
  import type { Comment } from '@/types';

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
  const handleReply = (comment: Comment, replyTo?: Comment) => {
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
  const handleLike = (comment: Comment) => {
    emit('like', comment.id);
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
    @apply space-y-6;
  }

  .comment-input {
    @apply space-y-2;
  }

  .input-footer {
    @apply flex items-center justify-between;
  }

  .input-tip {
    @apply text-sm text-gray-500;
  }

  .comment-list {
    @apply space-y-6;
  }

  .comment-item {
    @apply space-y-4;
  }

  .comment-content {
    @apply flex gap-3;
  }

  .comment-main {
    @apply flex-grow space-y-2;
  }

  .comment-header {
    @apply flex items-center gap-2;
  }

  .author-name {
    @apply font-medium hover:text-primary cursor-pointer;
  }

  .comment-time,
  .reply-time {
    @apply text-sm text-gray-500;
  }

  .comment-text,
  .reply-text {
    @apply text-sm whitespace-pre-wrap;
  }

  .comment-actions,
  .reply-actions {
    @apply flex items-center gap-2;
  }

  .reply-input {
    @apply mt-4 space-y-2;
  }

  .button-group {
    @apply flex items-center gap-2;
  }

  .reply-list {
    @apply mt-4 space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700;
  }

  .reply-item {
    @apply flex gap-2;
  }

  .reply-main {
    @apply flex-grow space-y-1;
  }

  .load-more {
    @apply flex justify-center py-4;
  }

  .empty-state {
    @apply py-8;
  }
</style>