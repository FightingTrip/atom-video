/**
* @file CommentForm.vue
* @description 评论表单组件，支持富文本编辑
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="comment-form">
    <div class="comment-form-header">
      <n-avatar v-if="currentUser" round size="small" :src="currentUser.avatar" :fallback-src="defaultAvatar" />
      <n-avatar v-else round size="small" :src="defaultAvatar" />
      <span class="comment-form-username">{{ currentUser?.nickname || '未登录用户' }}</span>
    </div>

    <div class="comment-form-content">
      <rich-text-editor v-model:value="content" :placeholder="placeholder" ref="editorRef" @focus="onEditorFocus" />
    </div>

    <div class="comment-form-footer">
      <div class="comment-form-tips">
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-icon size="18">
              <InformationCircleOutline />
            </n-icon>
          </template>
          <p>支持富文本格式化：</p>
          <p>- 加粗：Ctrl+B</p>
          <p>- 斜体：Ctrl+I</p>
          <p>- 链接：Ctrl+K</p>
          <p>- @用户：输入@</p>
        </n-tooltip>
        <span class="comment-form-counter" :class="{ 'is-warning': contentLength > maxLength * 0.8 }">
          {{ contentLength }}/{{ maxLength }}
        </span>
      </div>

      <div class="comment-form-actions">
        <n-button v-if="replyingTo" quaternary size="small" @click="cancelReply">
          取消回复
        </n-button>
        <n-button type="primary" size="small" :disabled="!isValid || isSubmitting" :loading="isSubmitting"
          @click="submitComment">
          {{ replyingTo ? '回复' : '发布评论' }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '@/stores/user';
  import { NAvatar, NButton, NTooltip, NIcon } from 'naive-ui';
  import { InformationCircleOutline } from '@vicons/ionicons5';
  import RichTextEditor from '@/components/common/RichTextEditor.vue';
  import { Comment } from '@/types';
  import { addComment, replyToComment } from '@/services/comment';

  const props = defineProps({
    videoId: {
      type: String,
      required: true
    },
    replyingTo: {
      type: Object as () => Comment | null,
      default: null
    },
    placeholder: {
      type: String,
      default: '发表你的评论...'
    },
    maxLength: {
      type: Number,
      default: 1000
    }
  });

  const emit = defineEmits(['comment-added', 'reply-added', 'cancel-reply']);

  // 用户信息
  const userStore = useUserStore();
  const currentUser = computed(() => userStore.user);
  const defaultAvatar = '/avatars/default-avatar.png';

  // 评论内容
  const content = ref('');
  const editorRef = ref<any>(null);
  const isSubmitting = ref(false);

  // 计算评论内容长度
  const contentLength = computed(() => {
    if (editorRef.value) {
      return editorRef.value.getPlainText().length;
    }
    return 0;
  });

  // 判断评论是否有效
  const isValid = computed(() => {
    return contentLength.value > 0 && contentLength.value <= props.maxLength && currentUser.value;
  });

  // 聚焦编辑器
  onMounted(() => {
    setTimeout(() => {
      if (editorRef.value && props.replyingTo) {
        editorRef.value.focus();
      }
    }, 100);
  });

  // 编辑器聚焦
  const onEditorFocus = () => {
    if (!currentUser.value) {
      // 提示用户登录
      userStore.toggleLoginModal(true);
    }
  };

  // 提交评论
  const submitComment = async () => {
    if (!isValid.value || !currentUser.value) return;

    try {
      isSubmitting.value = true;

      // 获取评论内容
      const commentHtml = content.value;

      if (props.replyingTo) {
        // 回复评论
        const reply = await replyToComment({
          videoId: props.videoId,
          commentId: props.replyingTo.id,
          content: commentHtml,
          authorId: currentUser.value.id
        });

        emit('reply-added', reply);
      } else {
        // 添加新评论
        const comment = await addComment({
          videoId: props.videoId,
          content: commentHtml,
          authorId: currentUser.value.id
        });

        emit('comment-added', comment);
      }

      // 清空评论内容
      content.value = '';
      if (editorRef.value) {
        editorRef.value.clear();
      }
    } catch (error) {
      console.error('提交评论失败:', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  // 取消回复
  const cancelReply = () => {
    emit('cancel-reply');
  };
</script>

<style scoped>
  .comment-form {
    width: 100%;
    margin-bottom: 16px;
    border-radius: 8px;
    background-color: var(--bg-color);
  }

  .comment-form-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
  }

  .comment-form-username {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
  }

  .comment-form-content {
    margin-bottom: 8px;
  }

  .comment-form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .comment-form-tips {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-color-secondary);
  }

  .comment-form-counter {
    font-size: 12px;
  }

  .comment-form-counter.is-warning {
    color: var(--warning-color);
  }

  .comment-form-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>