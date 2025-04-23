/**
* @file VideoActions.vue
* @description 视频操作按钮组，包含点赞、收藏、分享等功能
*/

<template>
  <div class="video-actions" :class="{ 'is-compact': compact }">
    <div class="actions-group">
      <action-button type="like" :model-value="interactionState.isLiked" :count="videoStats.likes" :show-text="!compact"
        :text="compact ? '' : '点赞'" :size="compact ? 'small' : 'medium'" @update:model-value="handleLike"
        :disabled="loading || (!isLoggedIn && !offlineMode)" :show-animation="true" />

      <action-button type="favorite" :model-value="interactionState.isFavorited" :count="videoStats.favorites"
        :show-text="!compact" :text="compact ? '' : '收藏'" :size="compact ? 'small' : 'medium'"
        @update:model-value="handleFavorite" :disabled="loading || (!isLoggedIn && !offlineMode)" :color="'error'"
        :show-animation="true" />

      <action-button type="share" :show-text="!compact" :text="compact ? '' : '分享'" :size="compact ? 'small' : 'medium'"
        @click="handleShare" :disabled="loading || offlineMode" />

      <action-button type="download" :show-text="!compact" :text="compact ? '' : '下载'"
        :size="compact ? 'small' : 'medium'" @click="handleDownload" :disabled="loading || offlineMode" />
    </div>

    <div v-if="showAuthorActions" class="author-action">
      <action-button type="subscribe" :model-value="interactionState.isSubscribed" :count="authorStats.subscribers"
        :show-text="!compact" :text="compact ? '' : (interactionState.isSubscribed ? '已订阅' : '订阅')"
        :size="compact ? 'small' : 'medium'" @update:model-value="handleSubscribe"
        :disabled="loading || (!isLoggedIn && !offlineMode)" :color="'success'" />
    </div>

    <!-- 分享弹窗 -->
    <n-modal v-model:show="showShareModal" preset="dialog" title="分享视频">
      <div class="share-modal-content">
        <div class="share-link">
          <n-input :value="shareLink" readonly />
          <n-button type="primary" @click="copyShareLink">复制链接</n-button>
        </div>

        <div class="share-platforms">
          <div class="platform-title">分享至:</div>
          <div class="platform-list">
            <n-button v-for="platform in sharePlatforms" :key="platform.id" quaternary circle
              @click="shareToPlatform(platform.id)">
              <template #icon>
                <n-icon :component="platform.icon" />
              </template>
            </n-button>
          </div>
        </div>

        <div class="share-qrcode" v-if="!compact">
          <div class="qrcode-title">扫码分享</div>
          <div class="qrcode-container">
            <img :src="qrCodeUrl" alt="二维码" />
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, PropType } from 'vue';
  import { NButton, NInput, NModal, NIcon } from 'naive-ui';
  import ActionButton from '@/components/common/ActionButton.vue';
  import {
    LogoTwitter,
    LogoFacebook,
    Mail,
    LogoWhatsapp,
    Link
  } from '@vicons/ionicons5';
  import { interactionService, InteractionType, TargetType } from '@/services/interaction/interactionService';
  import { useUserStore } from '@/stores/user';
  import { useToast } from '@/composables/useToast';

  const props = defineProps({
    videoId: {
      type: String,
      required: true
    },
    authorId: {
      type: String,
      required: true
    },
    videoStats: {
      type: Object as PropType<{
        likes: number;
        dislikes?: number;
        favorites: number;
        views: number;
      }>,
      required: true
    },
    authorStats: {
      type: Object as PropType<{
        subscribers: number;
      }>,
      default: () => ({ subscribers: 0 })
    },
    interactionState: {
      type: Object as PropType<{
        isLiked: boolean;
        isFavorited: boolean;
        isSubscribed: boolean;
      }>,
      default: () => ({
        isLiked: false,
        isFavorited: false,
        isSubscribed: false
      })
    },
    compact: {
      type: Boolean,
      default: false
    },
    offlineMode: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits([
    'update:interaction-state',
    'like',
    'favorite',
    'share',
    'download',
    'subscribe'
  ]);

  // 状态
  const loading = ref(false);
  const showShareModal = ref(false);
  const userStore = useUserStore();
  const { showToast } = useToast();

  // 计算属性
  const isLoggedIn = computed(() => !!userStore.currentUser);
  const showAuthorActions = computed(() => props.authorId && props.authorId !== userStore.currentUser?.id);

  const shareLink = computed(() => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://atomvideo.example.com/video/${props.videoId}`;
  });

  const qrCodeUrl = computed(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink.value)}`;
  });

  // 分享平台
  const sharePlatforms = [
    { id: 'twitter', name: '推特', icon: LogoTwitter },
    { id: 'facebook', name: '脸书', icon: LogoFacebook },
    { id: 'whatsapp', name: 'WhatsApp', icon: LogoWhatsapp },
    { id: 'email', name: '邮件', icon: Mail },
    { id: 'copy', name: '复制链接', icon: Link }
  ];

  // 方法
  const updateInteractionState = (updates: Partial<typeof props.interactionState>) => {
    emit('update:interaction-state', {
      ...props.interactionState,
      ...updates
    });
  };

  const handleLike = async () => {
    if (loading.value) return;

    // 乐观更新UI
    const newLikedState = !props.interactionState.isLiked;
    updateInteractionState({ isLiked: newLikedState });

    // 通知父组件
    emit('like', newLikedState);

    if (!props.offlineMode && isLoggedIn.value) {
      loading.value = true;
      try {
        // 调用服务更新点赞状态
        const action = newLikedState ? InteractionType.LIKE : InteractionType.UNLIKE;
        const response = await interactionService.toggleLike(
          TargetType.VIDEO,
          props.videoId,
          action
        );

        if (!response.success) {
          // 恢复原状态
          updateInteractionState({ isLiked: !newLikedState });
          showToast('点赞失败', 'error');
        }
      } catch (error) {
        console.error('点赞失败:', error);
        // 恢复原状态
        updateInteractionState({ isLiked: !newLikedState });
        showToast('点赞失败', 'error');
      } finally {
        loading.value = false;
      }
    }
  };

  const handleFavorite = async () => {
    if (loading.value) return;

    // 乐观更新UI
    const newFavoritedState = !props.interactionState.isFavorited;
    updateInteractionState({ isFavorited: newFavoritedState });

    // 通知父组件
    emit('favorite', newFavoritedState);

    if (!props.offlineMode && isLoggedIn.value) {
      loading.value = true;
      try {
        // 调用服务更新收藏状态
        const action = newFavoritedState ? InteractionType.FAVORITE : InteractionType.UNFAVORITE;
        const response = await interactionService.toggleFavorite(
          TargetType.VIDEO,
          props.videoId,
          action
        );

        if (!response.success) {
          // 恢复原状态
          updateInteractionState({ isFavorited: !newFavoritedState });
          showToast('收藏失败', 'error');
        }
      } catch (error) {
        console.error('收藏失败:', error);
        // 恢复原状态
        updateInteractionState({ isFavorited: !newFavoritedState });
        showToast('收藏失败', 'error');
      } finally {
        loading.value = false;
      }
    }
  };

  const handleSubscribe = async () => {
    if (loading.value) return;

    // 乐观更新UI
    const newSubscribedState = !props.interactionState.isSubscribed;
    updateInteractionState({ isSubscribed: newSubscribedState });

    // 通知父组件
    emit('subscribe', newSubscribedState);

    if (!props.offlineMode && isLoggedIn.value) {
      loading.value = true;
      try {
        // 调用服务更新订阅状态
        const action = newSubscribedState ? InteractionType.SUBSCRIBE : InteractionType.UNSUBSCRIBE;
        const response = await interactionService.toggleSubscribe(
          props.authorId,
          action
        );

        if (!response.success) {
          // 恢复原状态
          updateInteractionState({ isSubscribed: !newSubscribedState });
          showToast('订阅失败', 'error');
        }
      } catch (error) {
        console.error('订阅失败:', error);
        // 恢复原状态
        updateInteractionState({ isSubscribed: !newSubscribedState });
        showToast('订阅失败', 'error');
      } finally {
        loading.value = false;
      }
    }
  };

  const handleShare = () => {
    showShareModal.value = true;
    emit('share');
  };

  const handleDownload = () => {
    emit('download');
    // 这里可以实现实际的下载逻辑
    showToast('开始下载视频', 'success');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink.value)
      .then(() => {
        showToast('链接已复制到剪贴板', 'success');
      })
      .catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败', 'error');
      });
  };

  const shareToPlatform = (platformId: string) => {
    const url = encodeURIComponent(shareLink.value);
    const title = encodeURIComponent('Atom Video - 精彩视频');

    let shareUrl = '';

    switch (platformId) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${url}`;
        break;
      case 'copy':
        copyShareLink();
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    showShareModal.value = false;
  };
</script>

<style scoped>
  .video-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
  }

  .actions-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .video-actions.is-compact {
    padding: 8px 0;
  }

  .video-actions.is-compact .actions-group {
    gap: 8px;
  }

  .share-modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .share-link {
    display: flex;
    gap: 8px;
  }

  .share-platforms {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .platform-title {
    font-weight: 500;
    font-size: 14px;
  }

  .platform-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .share-qrcode {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .qrcode-title {
    font-weight: 500;
    font-size: 14px;
  }

  .qrcode-container {
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
  }

  .qrcode-container img {
    max-width: 150px;
    max-height: 150px;
  }

  .author-action {
    width: 100%;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    .video-actions {
      flex-direction: column;
      align-items: flex-start;
    }

    .author-action {
      width: 100%;
      margin-top: 8px;
    }
  }
</style>