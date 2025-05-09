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
    MailOutline,
    ShareSocialOutline,
    LogoFacebook,
    LogoTwitter
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

  // 自定义Logo组件
  const LogoWechatIcon = () => {
    return h('svg', {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      style: { fill: 'currentColor' }
    }, [
      h('path', { d: 'M8.691 2C4.301 2 0.5 4.986 0.5 8.759c0 2.071 1.152 3.83 2.969 5.037l-0.766 2.394c-0.036 0.114-0.006 0.239 0.077 0.323 0.057 0.057 0.134 0.088 0.211 0.088 0.042 0 0.083-0.009 0.122-0.026l2.84-1.363c0.866 0.25 1.786 0.389 2.738 0.389 0.307 0 0.61-0.016 0.909-0.046 0.567 1.805 2.47 3.25 4.8 3.65l2.477 1.189c0.039 0.018 0.08 0.027 0.122 0.027 0.078 0 0.154-0.031 0.211-0.088 0.083-0.084 0.113-0.209 0.077-0.323l-0.648-2.025c1.614-1.102 2.679-2.673 2.769-4.436 0.003-0.045 0.004-0.086 0.004-0.127 0-3.534-3.393-6.254-7.68-6.417-0.038-0.002-0.077-0.003-0.115-0.003-0.129 0-0.257 0.009-0.383 0.018C10.483 2.409 9.596 2 8.691 2zM6.051 6.696c0.745 0 1.35 0.605 1.35 1.35s-0.605 1.35-1.35 1.35c-0.745 0-1.35-0.605-1.35-1.35s0.605-1.35 1.35-1.35zM11.33 6.696c0.745 0 1.35 0.605 1.35 1.35s-0.605 1.35-1.35 1.35c-0.745 0-1.35-0.605-1.35-1.35s0.605-1.35 1.35-1.35zM16.103 11.973c-0.393 0-0.711 0.318-0.711 0.711s0.318 0.711 0.711 0.711 0.711-0.318 0.711-0.711-0.318-0.711-0.711-0.711zM19.96 11.973c-0.393 0-0.711 0.318-0.711 0.711s0.318 0.711 0.711 0.711 0.711-0.318 0.711-0.711-0.318-0.711-0.711-0.711z' })
    ]);
  };

  const LogoWeiboIcon = () => {
    return h('svg', {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      style: { fill: 'currentColor' }
    }, [
      h('path', { d: 'M10.098 20c-4.612 0-8.363-2.222-8.363-4.958 0-1.437 0.901-3.084 2.442-4.651 2.05-2.089 4.416-3.028 5.317-2.116 0.396 0.408 0.457 1.121 0.191 2.010-0.137 0.411 0.408 0.457 1.121 0.191 2.010-0.137 0.411 0.408 0.183 0.408 0.183 1.741-0.740 3.251-0.783 3.811 0.025 0.301 0.421 0.275 1.008-0.008 1.687-0.132 0.312 0.040 0.363 0.290 0.434 1.008 0.316 2.129 1.080 2.129 2.427 0 2.736-3.903 4.958-8.516 4.958zM6.723 11.111c-2.335 0.235-4.092 1.736-3.936 3.342s2.212 2.699 4.547 2.465c2.333-0.234 4.092-1.733 3.936-3.341-0.157-1.608-2.212-2.699-4.547-2.465z' }),
      h('path', { d: 'M8.212 16.584c-1.118 0.146-2.147-0.344-2.308-1.106-0.162-0.75 0.604-1.483 1.726-1.634 1.134-0.166 2.147 0.334 2.298 1.084 0.154 0.763-0.612 1.496-1.717 1.657z' }),
      h('path', { d: 'M19.433 9.324c-0.393-0.043-0.83-0.072-1.291-0.083-0.155-0.002-0.276-0.124-0.278-0.279-0.002-0.152 0.115-0.276 0.267-0.281 0.48-0.012 0.936-0.043 1.345-0.088 1.166-0.138 1.973-0.861 1.805-1.622-0.168-0.759-1.252-1.257-2.417-1.113-0.445 0.057-0.875 0.171-1.255 0.323-0.145 0.058-0.309-0.012-0.367-0.157-0.058-0.145 0.011-0.309 0.155-0.368 0.435-0.171 0.925-0.299 1.43-0.361 1.445-0.177 2.817 0.479 3.059 1.614 0.244 1.135-0.729 2.249-2.174 2.483-0.093 0.011-0.183 0.023-0.28 0.033z' }),
      h('path', { d: 'M17.585 11.426c-0.136 0.068-0.3 0.013-0.369-0.121-0.068-0.136-0.015-0.3 0.121-0.368 0.285-0.141 0.487-0.362 0.572-0.621s0.073-0.518-0.021-0.772c-0.169-0.454-0.671-0.712-1.242-0.643-0.36 0.042-0.676 0.211-0.85 0.44-0.094 0.119-0.268 0.139-0.386 0.046-0.12-0.095-0.14-0.267-0.045-0.389 0.277-0.352 0.702-0.59 1.184-0.645 0.856-0.104 1.624 0.316 1.895 1.044 0.136 0.364 0.14 0.76 0.012 1.129-0.128 0.368-0.392 0.683-0.804 0.9z' }),
      h('path', { d: 'M6.871 15.661c-0.381 0.058-0.704-0.108-0.769-0.376-0.062-0.264 0.188-0.528 0.571-0.586 0.383-0.057 0.704 0.108 0.769 0.376 0.062 0.269-0.188 0.53-0.571 0.586z' })
    ]);
  };

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
    { id: 'wechat', name: '微信', icon: LogoWechatIcon, type: 'social' },
    { id: 'weibo', name: '微博', icon: LogoWeiboIcon, type: 'social' },
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