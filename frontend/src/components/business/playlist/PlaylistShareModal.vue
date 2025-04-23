<template>
  <n-modal v-model:show="showModal" preset="card" title="分享播放列表" class="playlist-share-modal"
    :style="{ width: '500px' }">
    <div class="share-container">
      <!-- 播放列表信息预览 -->
      <div class="playlist-preview">
        <div class="preview-thumbnail">
          <img :src="playlist.thumbnailUrl || defaultThumbnail" alt="播放列表封面" class="thumbnail-img" />
        </div>
        <div class="preview-info">
          <h3 class="preview-title">{{ playlist.title }}</h3>
          <p class="preview-meta">
            {{ playlist.videoCount || 0 }} 个视频
            <span v-if="playlist.visibility !== 'public'" class="visibility-tag">
              {{ playlist.visibility === 'private' ? '私密' : '不公开' }}
            </span>
          </p>
        </div>
      </div>

      <!-- 生成的分享链接 -->
      <div v-if="shareResult" class="share-link-result">
        <n-input-group>
          <n-input readonly :value="shareResult.shareLink" />
          <n-button type="primary" @click="copyShareLink(shareResult.shareLink)">复制</n-button>
        </n-input-group>
        <p class="link-hint">
          链接已生成，可以复制后分享给好友
        </p>
      </div>

      <!-- 分享选项 -->
      <div class="share-methods">
        <h4 class="methods-title">选择分享方式</h4>
        <div class="methods-grid">
          <div v-for="method in shareMethods" :key="method.id" class="share-method-item"
            :class="{ active: activeMethod === method.id }" @click="selectShareMethod(method)">
            <div class="method-icon">
              <n-icon :component="method.icon" />
            </div>
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>
      </div>

      <!-- 邮件分享选项（仅在邮件分享时显示） -->
      <div v-if="activeMethod === 'email'" class="email-share-section">
        <n-form-item label="接收者邮箱">
          <n-dynamic-tags v-model:value="emailAddresses" :max="5" />
          <div class="email-hint">最多可添加5个邮箱地址</div>
        </n-form-item>
        <n-button type="primary" block @click="shareByEmail" :disabled="!emailAddresses.length || isSharing"
          :loading="isSharing">
          发送邮件
        </n-button>
      </div>

      <!-- 分享按钮 -->
      <div v-else class="share-action">
        <n-button type="primary" block @click="sharePlaylist" :loading="isSharing">
          {{ shareButtonText }}
        </n-button>
      </div>

      <!-- 隐私提示 -->
      <div v-if="playlist.visibility === 'private'" class="privacy-notice">
        <n-alert type="warning">
          注意：分享私密播放列表时，将自动转为"不公开"，其他人可以通过链接访问。
        </n-alert>
      </div>

    </div>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, defineEmits, watch, h } from 'vue';
  import {
    NModal,
    NInputGroup,
    NInput,
    NButton,
    NIcon,
    NAlert,
    NDynamicTags,
    NFormItem,
    useMessage
  } from 'naive-ui';
  import {
    LinkOutline,
    LogoWechat,
    LogoQq,
    MailOutline,
    LogoWeibo,
    ShareSocialOutline
  } from '@vicons/ionicons5';
  import { sharePlaylist } from '@/services/playlist';

  const props = defineProps({
    playlist: {
      type: Object,
      required: true,
      default: () => ({})
    },
    show: {
      type: Boolean,
      default: false
    },
    defaultThumbnail: {
      type: String,
      default: 'https://via.placeholder.com/320x180?text=No+Image'
    }
  });

  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
    (e: 'success', result: { shareLink: string; platform?: string; shareType: string }): void;
    (e: 'error', error: string): void;
  }>();

  const message = useMessage();
  const showModal = ref(false);
  const isSharing = ref(false);
  const activeMethod = ref('link');
  const shareResult = ref<{ shareLink: string; platform?: string; shareType: string } | null>(null);
  const emailAddresses = ref<string[]>([]);

  // 自定义Logo
  const LogoQqIcon = () => {
    return h('svg', {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      style: { fill: 'currentColor' }
    }, [
      h('path', { d: 'M21.395 15.035a32.21 32.21 0 0 0-.794-2.955 10.605 10.605 0 0 1-1.524-5.365 10.48 10.48 0 0 0-1.254-4.96 3.07 3.07 0 0 0-1.936-.855 6.887 6.887 0 0 0-3.731 1.442c-.32-.728-.8-1.34-1.515-1.742a3.175 3.175 0 0 0-2.338-.204c-1.85.49-3.43 2.448-3.43 4.502a16.164 16.164 0 0 1-.501 3.886c-.833 3.05-1.805 5.596-1.372 8.94.356 2.758 4.148 4.125 7.441 4.351 3.293-.226 7.084-1.594 7.44-4.351.069-.537.052-1.052-.009-1.541.542.126 1.143.218 1.775.256a2.87 2.87 0 0 0 2.11-.611c.933-.865.803-3.16-.362-4.793z' })
    ]);
  };

  // 分享方式列表
  const shareMethods = [
    { id: 'link', name: '链接', icon: LinkOutline, type: 'link' },
    { id: 'wechat', name: '微信', icon: LogoWechat, type: 'social' },
    { id: 'weibo', name: '微博', icon: LogoWeibo, type: 'social' },
    { id: 'qq', name: 'QQ', icon: LogoQqIcon, type: 'social' },
    { id: 'email', name: '邮件', icon: MailOutline, type: 'email' }
  ];

  // 根据选中的分享方式计算按钮文本
  const shareButtonText = computed(() => {
    const method = shareMethods.find(m => m.id === activeMethod.value);
    if (!method) return '分享';
    return method.id === 'link' ? '生成链接' : `分享到${method.name}`;
  });

  // 同步showModal和props.show
  watch(() => props.show, (newVal) => {
    showModal.value = newVal;
  });

  watch(showModal, (newVal) => {
    emit('update:show', newVal);
    if (!newVal) {
      // 关闭弹窗时重置状态
      shareResult.value = null;
      activeMethod.value = 'link';
      isSharing.value = false;
      emailAddresses.value = [];
    }
  });

  // 选择分享方式
  function selectShareMethod(method: typeof shareMethods[0]) {
    activeMethod.value = method.id;
    shareResult.value = null;
  }

  // 执行分享
  async function sharePlaylist() {
    if (isSharing.value) return;

    isSharing.value = true;
    const method = shareMethods.find(m => m.id === activeMethod.value);

    try {
      if (method?.id === 'email') {
        await shareByEmail();
        return;
      }

      const result = await sharePlaylist(props.playlist.id, {
        shareType: method?.type === 'social' ? 'social' : 'link',
        platform: method?.type === 'social' ? method.id as any : undefined
      });

      shareResult.value = result;
      emit('success', result);

      if (method?.type === 'social') {
        // 如果是社交媒体分享，提示用户
        message.success(`已生成${method.name}分享链接`);
      }
    } catch (err) {
      console.error('分享失败:', err);
      const errorMsg = err instanceof Error ? err.message : '分享失败，请重试';
      emit('error', errorMsg);
      message.error(errorMsg);
    } finally {
      isSharing.value = false;
    }
  }

  // 邮件分享
  async function shareByEmail() {
    if (!emailAddresses.value.length) {
      message.warning('请添加至少一个邮箱地址');
      return;
    }

    isSharing.value = true;

    try {
      // 邮件分享（模拟）
      await new Promise(resolve => setTimeout(resolve, 800));

      message.success(`已将播放列表分享到 ${emailAddresses.value.join(', ')}`);
      shareResult.value = {
        shareLink: `https://atomvideo.com/playlist/${props.playlist.id}`,
        shareType: 'email'
      };
    } catch (err) {
      console.error('邮件分享失败:', err);
      message.error('邮件发送失败，请重试');
    } finally {
      isSharing.value = false;
    }
  }

  // 复制分享链接
  function copyShareLink(link: string) {
    navigator.clipboard.writeText(link)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  }
</script>

<style scoped>
  .playlist-share-modal {
    max-width: 90vw;
  }

  .share-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .playlist-preview {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .preview-thumbnail {
    width: 120px;
    height: 68px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .preview-info {
    flex: 1;
    min-width: 0;
  }

  .preview-title {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview-meta {
    margin: 0;
    font-size: 14px;
    color: var(--text-color-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .visibility-tag {
    padding: 2px 6px;
    font-size: 12px;
    border-radius: 4px;
    background-color: var(--warning-color-hover);
    color: var(--warning-color);
  }

  .share-link-result {
    margin: 16px 0;
  }

  .link-hint {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .share-methods {
    margin-top: 8px;
  }

  .methods-title {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }

  .methods-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  .share-method-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .share-method-item:hover {
    background-color: var(--hover-color);
  }

  .share-method-item.active {
    background-color: var(--primary-color-hover);
    color: var(--primary-color);
  }

  .method-icon {
    font-size: 24px;
  }

  .method-name {
    font-size: 12px;
  }

  .share-action {
    margin-top: 16px;
  }

  .privacy-notice {
    margin-top: 16px;
  }

  .email-share-section {
    margin-top: 16px;
  }

  .email-hint {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: 4px;
  }

  @media (max-width: 480px) {
    .methods-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>