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
      <div class="rich-editor">
        <div class="editor-toolbar">
          <n-button-group>
            <n-button quaternary @click="applyFormat('bold')" :class="{ 'active': activeFormats.bold }">
              <template #icon>
                <n-icon>
                  <TextBold />
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary @click="applyFormat('italic')" :class="{ 'active': activeFormats.italic }">
              <template #icon>
                <n-icon>
                  <TextItalic />
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary @click="insertLink">
              <template #icon>
                <n-icon>
                  <LinkOutline />
                </n-icon>
              </template>
            </n-button>
          </n-button-group>
          <n-button quaternary @click="showMentionPopup">
            <template #icon>
              <n-icon>
                <At />
              </n-icon>
            </template>
            @用户
          </n-button>
        </div>
        <n-input v-model:value="commentText" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="写下你的评论..." @keydown.enter.ctrl="handlePostComment" class="comment-textarea"
          ref="commentInputRef" />

        <!-- @用户弹出面板 -->
        <div v-if="showMention" class="mention-popup">
          <div class="mention-search">
            <n-input v-model:value="mentionSearch" placeholder="搜索用户..." />
          </div>
          <div class="mention-list">
            <div v-for="user in filteredUsers" :key="user.id" class="mention-item" @click="selectMention(user)">
              <n-avatar round :size="24" :src="user.avatar" />
              <span>{{ user.nickname }}</span>
            </div>
          </div>
        </div>
      </div>

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
          <n-avatar round :size="40" :src="comment.author?.avatar" @click="handleAuthorClick(comment.author?.id || '')"
            class="user-avatar" />
          <div class="comment-main">
            <div class="comment-header">
              <span class="author-name" @click="handleAuthorClick(comment.author?.id || '')">
                {{ comment.author?.nickname }}
              </span>
              <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-text" v-html="formatComment(comment.content)"></p>
            <div class="comment-actions">
              <n-button text @click="handleLike(comment)" :class="{ 'liked': comment.isLiked }"
                class="action-button like-button">
                <template #icon>
                  <n-icon>
                    <ThumbsUp v-if="comment.isLiked" />
                    <ThumbsUpOutline v-else />
                  </n-icon>
                </template>
                <span class="like-count" :class="{ 'liked': comment.isLiked }">
                  {{ formatNumber(comment.likes || 0) }}
                </span>
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
              <div class="rich-editor">
                <div class="editor-toolbar">
                  <n-button-group>
                    <n-button quaternary @click="applyReplyFormat('bold')"
                      :class="{ 'active': activeReplyFormats.bold }">
                      <template #icon>
                        <n-icon>
                          <TextBold />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button quaternary @click="applyReplyFormat('italic')"
                      :class="{ 'active': activeReplyFormats.italic }">
                      <template #icon>
                        <n-icon>
                          <TextItalic />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-button-group>
                  <n-button quaternary @click="showReplyMentionPopup">
                    <template #icon>
                      <n-icon>
                        <At />
                      </n-icon>
                    </template>
                    @用户
                  </n-button>
                </div>
                <n-input v-model:value="replyText" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                  placeholder="回复评论..." @keydown.enter.ctrl="handlePostReply" class="reply-textarea"
                  ref="replyInputRef" />

                <!-- 回复@用户弹出面板 -->
                <div v-if="showReplyMention" class="mention-popup">
                  <div class="mention-search">
                    <n-input v-model:value="mentionSearch" placeholder="搜索用户..." />
                  </div>
                  <div class="mention-list">
                    <div v-for="user in filteredUsers" :key="user.id" class="mention-item"
                      @click="selectReplyMention(user)">
                      <n-avatar round :size="24" :src="user.avatar" />
                      <span>{{ user.nickname }}</span>
                    </div>
                  </div>
                </div>
              </div>
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
                <n-avatar round :size="32" :src="reply.author?.avatar"
                  @click="handleAuthorClick(reply.author?.id || '')" class="user-avatar-small" />
                <div class="reply-main">
                  <div class="reply-header">
                    <span class="author-name" @click="handleAuthorClick(reply.author?.id || '')">
                      {{ reply.author?.nickname }}
                    </span>
                    <span class="reply-time">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <p class="reply-text" v-html="formatComment(reply.content)"></p>
                  <div class="reply-actions">
                    <n-button text @click="handleLike(reply)" :class="{ 'liked': reply.isLiked }"
                      class="action-button like-button">
                      <template #icon>
                        <n-icon>
                          <ThumbsUp v-if="reply.isLiked" />
                          <ThumbsUpOutline v-else />
                        </n-icon>
                      </template>
                      <span class="like-count" :class="{ 'liked': reply.isLiked }">
                        {{ formatNumber(reply.likes || 0) }}
                      </span>
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
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIntersectionObserver } from '@vueuse/core';
  import {
    NInput,
    NButton,
    NButtonGroup,
    NAvatar,
    NIcon,
    NSpin,
    NEmpty
  } from 'naive-ui';
  import {
    ThumbsUp,
    ThumbsUpOutline,
    ChatbubbleOutline,
    LinkOutline,
    At
  } from '@vicons/ionicons5';
  // 使用自定义图标代替不存在的图标
  const TextBold = () => h('svg', { viewBox: '0 0 24 24', width: '1em', height: '1em' }, [
    h('path', { fill: 'currentColor', d: 'M13.5 15.5H10V12.5H13.5A1.5 1.5 0 0 1 15 14A1.5 1.5 0 0 1 13.5 15.5M10 6.5H13A1.5 1.5 0 0 1 14.5 8A1.5 1.5 0 0 1 13 9.5H10M15.6 10.79C16.57 10.11 17.25 9 17.25 8C17.25 5.74 15.5 4 13.25 4H7V18H14.04C16.14 18 17.75 16.3 17.75 14.21C17.75 12.69 16.89 11.39 15.6 10.79Z' })
  ]);

  const TextItalic = () => h('svg', { viewBox: '0 0 24 24', width: '1em', height: '1em' }, [
    h('path', { fill: 'currentColor', d: 'M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z' })
  ]);

  import { h } from 'vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';
  import type { Comment, Reply } from '@/types';
  import { userService } from '@/services';

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
  const commentInputRef = ref(null);
  const replyInputRef = ref(null);

  // 富文本编辑器状态
  const activeFormats = ref({
    bold: false,
    italic: false
  });

  const activeReplyFormats = ref({
    bold: false,
    italic: false
  });

  // @用户功能
  const showMention = ref(false);
  const showReplyMention = ref(false);
  const mentionSearch = ref('');
  const suggestedUsers = ref([
    { id: 'user1', nickname: '张三', avatar: 'https://i.pravatar.cc/100?u=1' },
    { id: 'user2', nickname: '李四', avatar: 'https://i.pravatar.cc/100?u=2' },
    { id: 'user3', nickname: '王五', avatar: 'https://i.pravatar.cc/100?u=3' },
    { id: 'user4', nickname: '赵六', avatar: 'https://i.pravatar.cc/100?u=4' },
    { id: 'user5', nickname: '钱七', avatar: 'https://i.pravatar.cc/100?u=5' },
  ]);

  // 过滤用户列表
  const filteredUsers = computed(() => {
    if (!mentionSearch.value) return suggestedUsers.value;
    return suggestedUsers.value.filter(user =>
      user.nickname.toLowerCase().includes(mentionSearch.value.toLowerCase())
    );
  });

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

  // 格式化评论内容，处理富文本和@用户
  const formatComment = (content: string) => {
    // 处理@用户
    let formattedContent = content.replace(/@(\w+)/g, '<a href="#/user/$1" class="mention">@$1</a>');

    // 处理粗体
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 处理斜体
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 处理链接
    formattedContent = formattedContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    return formattedContent;
  };

  // 富文本格式应用
  const applyFormat = (format: 'bold' | 'italic') => {
    if (format === 'bold') {
      activeFormats.value.bold = !activeFormats.value.bold;
      commentText.value += '**粗体文本**';
    } else if (format === 'italic') {
      activeFormats.value.italic = !activeFormats.value.italic;
      commentText.value += '*斜体文本*';
    }
  };

  const applyReplyFormat = (format: 'bold' | 'italic') => {
    if (format === 'bold') {
      activeReplyFormats.value.bold = !activeReplyFormats.value.bold;
      replyText.value += '**粗体文本**';
    } else if (format === 'italic') {
      activeReplyFormats.value.italic = !activeReplyFormats.value.italic;
      replyText.value += '*斜体文本*';
    }
  };

  // 插入链接
  const insertLink = () => {
    const linkText = '链接文本';
    const linkUrl = 'https://';
    commentText.value += `[${linkText}](${linkUrl})`;
  };

  // @用户功能
  const showMentionPopup = () => {
    showMention.value = true;
    mentionSearch.value = '';
  };

  const showReplyMentionPopup = () => {
    showReplyMention.value = true;
    mentionSearch.value = '';
  };

  const selectMention = (user: any) => {
    commentText.value += `@${user.nickname} `;
    showMention.value = false;
  };

  const selectReplyMention = (user: any) => {
    replyText.value += `@${user.nickname} `;
    showReplyMention.value = false;
  };

  // 处理评论
  const handlePostComment = () => {
    const content = commentText.value.trim();
    if (!content) return;

    emit('post', content);
    commentText.value = '';
    activeFormats.value = { bold: false, italic: false };
  };

  // 处理回复
  const handleReply = (comment: Comment, replyTo?: Comment | Reply) => {
    replyingTo.value = {
      id: comment.id,
      replyTo: replyTo
        ? {
          id: replyTo.id,
          author: { nickname: replyTo.author?.nickname || '用户' }
        }
        : undefined
    };
    replyText.value = replyTo ? `@${replyTo.author?.nickname || '用户'} ` : '';
    activeReplyFormats.value = { bold: false, italic: false };
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
    activeReplyFormats.value = { bold: false, italic: false };
  };

  // 处理点赞，添加动画效果
  const handleLike = (item: Comment | Reply) => {
    // 在此处添加视觉反馈
    if (!item.isLiked) {
      // 添加动画效果
      item.isLiked = true;
      item.likes = (item.likes || 0) + 1;
    } else {
      item.isLiked = false;
      item.likes = Math.max(0, (item.likes || 0) - 1);
    }

    // 向父组件发送点赞事件
    emit('like', item.id);
  };

  // 处理用户点击
  const handleAuthorClick = (authorId: string) => {
    if (authorId) {
      router.push(`/user/${authorId}`);
    }
  };

  // 加载更多
  const handleLoadMore = () => {
    if (props.loading) return;
    emit('load-more');
  };
</script>

<style scoped>
  .comment-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .comment-input {
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
    padding: 16px;
  }

  .rich-editor {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .editor-toolbar {
    display: flex;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .editor-toolbar .active {
    color: var(--primary-color);
    background-color: var(--primary-color-hover);
  }

  .mention-popup {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .mention-search {
    padding: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .mention-list {
    padding: 8px;
  }

  .mention-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
  }

  .mention-item:hover {
    background-color: var(--hover-color);
  }

  .user-avatar {
    flex-shrink: 0;
    cursor: pointer;
  }

  .user-avatar-small {
    flex-shrink: 0;
    cursor: pointer;
  }

  .comment-textarea,
  .reply-textarea {
    width: 100%;
  }

  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .input-tip {
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .button-group {
    display: flex;
    gap: 8px;
  }

  .cancel-button {
    color: var(--text-color-secondary);
    background-color: transparent;
    border: 1px solid var(--border-color);
    transition: all 0.2s;
  }

  .cancel-button:hover {
    color: var(--text-color);
    border-color: var(--border-dark);
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .comment-item {
    position: relative;
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
    padding: 16px;
    transition: all 0.2s;
  }

  .comment-item:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .comment-content {
    display: flex;
    gap: 16px;
  }

  .comment-main {
    flex: 1;
    min-width: 0;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .author-name {
    font-weight: 600;
    color: var(--text-color);
    cursor: pointer;
  }

  .author-name:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }

  .comment-time,
  .reply-time {
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .comment-text,
  .reply-text {
    margin: 8px 0;
    line-height: 1.5;
    word-break: break-word;
  }

  .comment-text :deep(.mention),
  .reply-text :deep(.mention) {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
  }

  .comment-text :deep(a),
  .reply-text :deep(a) {
    color: var(--primary-color);
    text-decoration: none;
  }

  .comment-text :deep(a:hover),
  .reply-text :deep(a:hover) {
    text-decoration: underline;
  }

  .comment-actions,
  .reply-actions {
    display: flex;
    gap: 16px;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
  }

  .like-button.liked {
    color: var(--primary-color);
  }

  .like-button .like-count {
    transition: all 0.2s;
  }

  .like-button .like-count.liked {
    color: var(--primary-color);
    font-weight: 500;
  }

  .like-button:active {
    transform: scale(1.2);
  }

  .reply-list {
    margin-top: 16px;
    border-left: 2px solid var(--border-color);
    padding-left: 16px;
  }

  .reply-item {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .reply-item:last-child {
    margin-bottom: 0;
  }

  .reply-main {
    flex: 1;
    min-width: 0;
  }

  .reply-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .reply-input {
    margin-top: 16px;
    padding: 12px;
    background-color: var(--bg-color);
    border-radius: 8px;
  }

  .load-more {
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }

  .empty-state {
    padding: 32px 0;
    text-align: center;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .comment-item {
      padding: 12px;
    }

    .comment-content {
      gap: 12px;
    }

    .editor-toolbar {
      flex-wrap: wrap;
    }
  }
</style>