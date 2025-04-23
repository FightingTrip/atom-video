/**
* @file CommentItem.vue
* @description 评论项组件，显示单条评论、用户信息以及交互功能
*/

<template>
  <div class="comment-item" :class="{ 'is-reply': isReply, 'is-loading': loading }">
    <!-- 用户头像 -->
    <div class="comment-avatar" @click="handleAuthorClick">
      <n-avatar :src="comment.user.avatar || '/assets/images/default-avatar.png'"
        :fallback-src="'/assets/images/default-avatar.png'" round size="medium" />
    </div>

    <div class="comment-content">
      <!-- 评论内容 -->
      <div class="comment-header">
        <div class="user-info">
          <span class="username" @click="handleAuthorClick">
            {{ comment.user.name }}
          </span>
          <span v-if="comment.user.verified" class="verified-badge">
            <n-icon size="14">
              <CheckmarkCircle />
            </n-icon>
          </span>
          <span v-if="isCommentAuthor" class="author-badge">作者</span>
        </div>
        <span class="comment-time">{{ formatTimeAgo(comment.createdAt) }}</span>
      </div>

      <!-- 评论内容 -->
      <div class="comment-text">
        <rich-text-view :content="comment.content" />
      </div>

      <!-- 评论操作 -->
      <div class="comment-actions">
        <action-button type="like" size="small" :model-value="comment.isLiked" :count="comment.likes"
          @update:model-value="handleLike" :disabled="loading" />

        <n-button size="small" text @click="handleReply" :disabled="loading">
          <template #icon>
            <n-icon>
              <ChatbubbleOutline />
            </n-icon>
          </template>
          回复
        </n-button>

        <n-button v-if="canDelete" size="small" text @click="handleDelete" :disabled="loading">
          <template #icon>
            <n-icon>
              <TrashOutline />
            </n-icon>
          </template>
          删除
        </n-button>
      </div>

      <!-- 回复输入框 -->
      <div v-if="showReplyInput" class="reply-input">
        <n-input v-model:value="replyContent" type="textarea" placeholder="写下你的回复..."
          :autosize="{ minRows: 2, maxRows: 5 }" :disabled="loading" />
        <div class="reply-actions">
          <n-button size="small" @click="showReplyInput = false">取消</n-button>
          <n-button size="small" type="primary" :disabled="!replyContent.trim() || loading" @click="submitReply">
            回复
          </n-button>
        </div>
      </div>

      <!-- 加载中状态 -->
      <n-spin v-if="loading" size="small" />

      <!-- 查看更多回复 -->
      <div v-if="!isReply && comment.replyCount && comment.replyCount > 0 && !showReplies" class="view-replies">
        <n-button text size="small" @click="loadReplies">
          查看 {{ comment.replyCount }} 条回复
          <template #icon>
            <n-icon>
              <ChevronDown />
            </n-icon>
          </template>
        </n-button>
      </div>

      <!-- 回复列表 -->
      <div v-if="showReplies && replies.length > 0" class="replies-container">
        <transition-group name="reply-list">
          <comment-item v-for="reply in replies" :key="reply.id" :comment="reply" :current-user-id="currentUserId"
            :author-id="authorId" :is-reply="true" @like="handleReplyLike" @reply="$emit('reply', reply.id)"
            @delete="handleReplyDelete" />
        </transition-group>

        <div v-if="hasMoreReplies" class="load-more-replies">
          <n-button text size="small" @click="loadMoreReplies" :loading="loadingMoreReplies">
            加载更多回复
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, PropType } from 'vue';
  import {
    NAvatar,
    NButton,
    NIcon,
    NInput,
    NSpin
  } from 'naive-ui';
  import {
    ChatbubbleOutline,
    CheckmarkCircle,
    ChevronDown,
    TrashOutline
  } from '@vicons/ionicons5';
  import ActionButton from '@/components/common/ActionButton.vue';
  import RichTextView from '@/components/common/RichTextView.vue';
  import { commentService } from '@/services/comment';
  import { interactionService, TargetType, InteractionType } from '@/services/interaction/interactionService';
  import type { Comment, Reply } from '@/types';
  import { formatTimeAgo } from '@/utils/timeFormatters';

  // 定义props
  const props = defineProps({
    comment: {
      type: Object as PropType<Comment | Reply>,
      required: true
    },
    currentUserId: {
      type: String,
      default: ''
    },
    authorId: {
      type: String,
      default: ''
    },
    isReply: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['like', 'reply', 'delete']);

  // 状态
  const loading = ref(false);
  const showReplyInput = ref(false);
  const replyContent = ref('');
  const showReplies = ref(false);
  const replies = ref<Reply[]>([]);
  const hasMoreReplies = ref(false);
  const replyPage = ref(1);
  const loadingMoreReplies = ref(false);

  // 计算属性
  const isCommentAuthor = computed(() => props.comment.user?.id === props.authorId);
  const canDelete = computed(() =>
    props.currentUserId && (
      props.comment.user?.id === props.currentUserId ||
      props.currentUserId === props.authorId
    )
  );

  // 方法
  const handleLike = async () => {
    if (loading.value) return;

    // 乐观更新UI
    props.comment.isLiked = !props.comment.isLiked;
    props.comment.likes = props.comment.isLiked ? (props.comment.likes || 0) + 1 : Math.max(0, (props.comment.likes || 0) - 1);

    emit('like', props.comment.id);
  };

  const handleReplyLike = (replyId: string) => {
    emit('like', replyId);
  };

  const handleReply = () => {
    showReplyInput.value = true;
  };

  const submitReply = async () => {
    if (!replyContent.value.trim() || loading.value) return;

    loading.value = true;
    try {
      const reply = await commentService.addReply(props.comment.id, replyContent.value);

      // 添加到回复列表
      if (!showReplies.value) {
        showReplies.value = true;
        replies.value = [reply];
      } else {
        replies.value.unshift(reply);
      }

      // 更新回复计数
      props.comment.replyCount = (props.comment.replyCount || 0) + 1;

      // 清空输入框
      replyContent.value = '';
      showReplyInput.value = false;

    } catch (error) {
      console.error('提交回复失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const handleDelete = async () => {
    if (loading.value) return;

    if (!confirm('确定要删除此评论吗？')) return;

    loading.value = true;
    emit('delete', props.comment.id);
  };

  const handleReplyDelete = (replyId: string) => {
    // 从列表中移除该回复
    replies.value = replies.value.filter(reply => reply.id !== replyId);
    // 更新回复计数
    props.comment.replyCount = Math.max(0, (props.comment.replyCount || 0) - 1);

    emit('delete', replyId);
  };

  const handleAuthorClick = () => {
    if (props.comment.user?.id) {
      window.location.href = `/user/${props.comment.user.id}`;
    }
  };

  const loadReplies = async () => {
    if (loading.value) return;

    loading.value = true;
    try {
      const result = await commentService.getReplies(props.comment.id);
      replies.value = result.replies;
      hasMoreReplies.value = result.hasMore;
      showReplies.value = true;
      replyPage.value = 1;
    } catch (error) {
      console.error('加载回复失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const loadMoreReplies = async () => {
    if (loadingMoreReplies.value) return;

    loadingMoreReplies.value = true;
    try {
      replyPage.value += 1;
      const result = await commentService.getReplies(props.comment.id, replyPage.value);
      replies.value = [...replies.value, ...result.replies];
      hasMoreReplies.value = result.hasMore;
    } catch (error) {
      console.error('加载更多回复失败:', error);
    } finally {
      loadingMoreReplies.value = false;
    }
  };
</script>

<style scoped>
  .comment-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    position: relative;
  }

  .comment-item.is-reply {
    margin-left: 24px;
    padding: 8px 0;
  }

  .comment-avatar {
    flex-shrink: 0;
    cursor: pointer;
  }

  .comment-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .username {
    font-weight: 500;
    cursor: pointer;
  }

  .username:hover {
    text-decoration: underline;
  }

  .verified-badge {
    color: var(--primary-color);
    display: flex;
    align-items: center;
  }

  .author-badge {
    font-size: 12px;
    background-color: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
    padding: 1px 6px;
    border-radius: 10px;
  }

  .comment-time {
    color: var(--text-color-3);
    font-size: 12px;
  }

  .comment-text {
    line-height: 1.5;
    word-break: break-word;
  }

  .comment-actions {
    display: flex;
    gap: 16px;
    margin-top: 4px;
  }

  .reply-input {
    margin-top: 8px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px;
    background-color: var(--bg-color-secondary);
  }

  .view-replies {
    margin-top: 8px;
  }

  .replies-container {
    margin-top: 8px;
  }

  .load-more-replies {
    margin-top: 4px;
    padding-left: 8px;
  }

  /* 动画效果 */
  .reply-list-enter-active,
  .reply-list-leave-active {
    transition: all 0.3s ease;
  }

  .reply-list-enter-from,
  .reply-list-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  /* 加载状态 */
  .is-loading {
    opacity: 0.7;
    pointer-events: none;
  }
</style>