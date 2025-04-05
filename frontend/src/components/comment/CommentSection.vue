/**
* @file CommentSection.vue
* @description 评论区域组件，用于显示视频评论和回复
* @author Atom Video Team
* @date 2025-04-06
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
  <div class="space-y-4">
    <!-- 评论输入框 -->
    <div class="flex gap-4">
      <n-avatar :src="userAvatar" :round="true" />
      <div class="flex-grow">
        <n-input v-model:value="commentText" type="textarea" placeholder="添加评论..."
          :autosize="{ minRows: 2, maxRows: 6 }" />
        <div class="flex justify-end mt-2 gap-2">
          <n-button @click="commentText = ''">取消</n-button>
          <n-button type="primary" :disabled="!commentText.trim()" @click="submitComment">
            评论
          </n-button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
        <n-avatar :src="comment.user.avatar" :round="true" />
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <router-link :to="`/user/${comment.user.id}`" class="font-medium hover:text-blue-500">
              {{ comment.user.nickname }}
            </router-link>
            <span class="text-sm text-gray-500">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <p class="mt-1">{{ comment.content }}</p>
          <div class="flex items-center gap-4 mt-2">
            <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              @click="handleLike(comment)">
              <n-icon>
                <ThumbsUp v-if="comment.isLiked" />
                <ThumbsUpOutline v-else />
              </n-icon>
              {{ formatNumber(comment.likes) }}
            </button>
            <button class="text-sm text-gray-500 hover:text-gray-700" @click="handleReply(comment)">
              回复
            </button>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyingTo?.id === comment.id" class="mt-4">
            <n-input v-model:value="replyText" type="textarea" placeholder="回复评论..."
              :autosize="{ minRows: 2, maxRows: 4 }" />
            <div class="flex justify-end mt-2 gap-2">
              <n-button @click="cancelReply">取消</n-button>
              <n-button type="primary" :disabled="!replyText.trim()" @click="submitReply">
                回复
              </n-button>
            </div>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.replies?.length" class="mt-4 ml-8 space-y-4">
            <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-4">
              <n-avatar :src="reply.user.avatar" :round="true" :size="32" />
              <div class="flex-grow">
                <div class="flex items-center gap-2">
                  <router-link :to="`/user/${reply.user.id}`" class="font-medium hover:text-blue-500">
                    {{ reply.user.nickname }}
                  </router-link>
                  <span class="text-sm text-gray-500">{{ formatTime(reply.createdAt) }}</span>
                </div>
                <p class="mt-1">{{ reply.content }}</p>
                <div class="flex items-center gap-4 mt-2">
                  <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    @click="handleLike(reply)">
                    <n-icon>
                      <ThumbsUp v-if="reply.isLiked" />
                      <ThumbsUpOutline v-else />
                    </n-icon>
                    {{ formatNumber(reply.likes) }}
                  </button>
                  <button class="text-sm text-gray-500 hover:text-gray-700" @click="handleReply(comment, reply)">
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
    @apply space-y-6;
  }

  .reply-section {
    @apply mt-4 ml-8 space-y-4;
  }

  .comment-actions {
    @apply flex items-center gap-4 mt-2;
  }

  .action-button {
    @apply flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700;
  }

  .user-link {
    @apply font-medium hover:text-blue-500;
  }

  .timestamp {
    @apply text-sm text-gray-500;
  }
</style>