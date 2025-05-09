<!--
 * @description 视频互动组件
 * @features
 * - 视频信息展示：标题、描述、上传时间等
 * - 作者信息：头像、昵称、关注状态
 * - 互动功能：点赞、收藏、分享
 * - 数据统计：播放量、点赞数、收藏数
 * - 举报功能：用户可以举报不良内容
 * - 分享功能：支持多种平台分享
 * - 响应式布局
 * - 主题适配
 * @dependencies
 * - naive-ui: UI组件库
 * - dayjs: 日期处理
 * @props
 * - videoId: 视频ID
 * - initialStats: 初始统计数据
 * @emits
 * - like: 点赞事件
 * - favorite: 收藏事件
 * - share: 分享事件
 -->

<template>
  <div class="video-interaction">
    <!-- 视频信息 -->
    <div class="video-info">
      <h1 class="video-title">{{ video?.title }}</h1>
      <div class="video-stats">
        <span>{{ formatNumber(video?.views || 0) }} 次观看</span>
        <span class="dot">•</span>
        <span>{{ formatDate(video?.createdAt) }}</span>
      </div>
    </div>

    <!-- 互动按钮 -->
    <div class="interaction-buttons">
      <n-button-group>
        <n-button :type="isLiked ? 'primary' : 'default'" @click="handleLike">
          <template #icon>
            <n-icon>
              <ThumbsUp v-if="isLiked" />
              <ThumbsUpOutline v-else />
            </n-icon>
          </template>
          {{ formatNumber(video?.likes || 0) }}
        </n-button>

        <n-button :type="isFavorited ? 'primary' : 'default'" @click="handleFavorite">
          <template #icon>
            <n-icon>
              <Bookmark v-if="isFavorited" />
              <BookmarkOutline v-else />
            </n-icon>
          </template>
          {{ formatNumber(video?.favorites || 0) }}
        </n-button>

        <n-button @click="showShareModal = true">
          <template #icon>
            <n-icon>
              <Share />
            </n-icon>
          </template>
          分享
        </n-button>

        <n-dropdown :options="moreOptions" placement="bottom-end" @select="handleMoreAction">
          <n-button>
            <template #icon>
              <n-icon>
                <EllipsisHorizontal />
              </n-icon>
            </template>
            更多
          </n-button>
        </n-dropdown>
      </n-button-group>
    </div>

    <!-- 作者信息 -->
    <div class="author-info">
      <div class="author-profile">
        <n-avatar round :size="48" :src="video?.author.avatar" @click="handleAuthorClick" />
        <div class="author-meta">
          <h3 class="author-name" @click="handleAuthorClick">
            {{ video?.author.nickname }}
          </h3>
          <p class="author-stats">
            {{ formatNumber(video?.author.followers || 0) }} 位订阅者
          </p>
        </div>
      </div>

      <n-button :type="video?.author.isFollowed ? 'default' : 'primary'" :ghost="video?.author.isFollowed"
        @click="handleFollow">
        {{ video?.author.isFollowed ? '已关注' : '关注' }}
      </n-button>
    </div>

    <!-- 视频描述 -->
    <div class="video-description">
      <n-collapse>
        <n-collapse-item name="description">
          <template #header>
            <span class="description-header">视频简介</span>
          </template>
          <div class="description-content">
            <div v-if="video?.description" class="description-text">
              {{ video.description }}
            </div>
            <div v-else class="empty-description">
              暂无简介
            </div>

            <!-- 视频标签 -->
            <div v-if="video?.tags && video.tags.length > 0" class="video-tags">
              <n-tag v-for="tag in video.tags" :key="tag" class="tag" size="small" round>
                {{ tag }}
              </n-tag>
            </div>

            <!-- 视频分类和上传日期 -->
            <div class="video-meta">
              <div class="meta-item">
                <span class="meta-label">分类：</span>
                <span class="meta-value">{{ video?.category || '未分类' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">上传日期：</span>
                <span class="meta-value">{{ formatFullDate(video?.createdAt) }}</span>
              </div>
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>

    <!-- 分享弹窗 -->
    <n-modal v-model:show="showShareModal" preset="card" title="分享视频" style="width: 500px">
      <div class="share-content">
        <p>分享 "{{ video?.title }}" 到：</p>

        <div class="share-platforms">
          <div v-for="platform in sharePlatforms" :key="platform.id" class="share-platform"
            @click="shareToPlaftorm(platform.id)">
            <n-icon :color="platform.color" :size="24">
              <component :is="platform.icon" />
            </n-icon>
            <span>{{ platform.name }}</span>
          </div>
        </div>

        <div class="share-link">
          <n-input-group>
            <n-input :value="shareUrl" readonly placeholder="视频链接" />
            <n-button type="primary" @click="copyShareLink">复制</n-button>
          </n-input-group>
        </div>

        <div class="share-qrcode" v-if="shareUrl">
          <n-image
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`"
            width="150" />
          <p>扫描二维码</p>
        </div>
      </div>
    </n-modal>

    <!-- 举报弹窗 -->
    <n-modal v-model:show="showReportModal" preset="card" title="举报视频" style="width: 500px">
      <div class="report-content">
        <p>请选择举报原因：</p>

        <n-radio-group v-model:value="reportReason">
          <n-space vertical>
            <n-radio v-for="reason in reportReasons" :key="reason.value" :value="reason.value">
              {{ reason.label }}
            </n-radio>
          </n-space>
        </n-radio-group>

        <n-input v-if="reportReason === 'other'" type="textarea" v-model:value="reportDetail" placeholder="请描述具体原因..."
          :autosize="{ minRows: 3, maxRows: 5 }" />

        <div class="report-actions">
          <n-button @click="showReportModal = false">取消</n-button>
          <n-button type="primary" @click="submitReport"
            :disabled="!reportReason || (reportReason === 'other' && !reportDetail)">
            提交
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMessage } from 'naive-ui';
  import {
    NButton,
    NButtonGroup,
    NIcon,
    NAvatar,
    NCollapse,
    NCollapseItem,
    NDropdown,
    NModal,
    NTag,
    NInput,
    NInputGroup,
    NImage,
    NRadioGroup,
    NRadio,
    NSpace
  } from 'naive-ui';
  import {
    ThumbsUp,
    ThumbsUpOutline,
    Bookmark,
    BookmarkOutline,
    Share,
    EllipsisHorizontal,
    LogoWeibo,
    LogoWechat,
    LogoTwitter,
    LogoFacebook,
    Download,
    Mail,
    Flag
  } from '@vicons/ionicons5';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';
  import type { Video } from '@/types';

  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');

  // Props 定义
  interface Props {
    video: Video | null;
    isLiked: boolean;
    isFavorited: boolean;
  }

  const props = defineProps<Props>();

  // Emits 定义
  const emit = defineEmits<{
    (e: 'like'): void;
    (e: 'favorite'): void;
    (e: 'share'): void;
    (e: 'follow'): void;
    (e: 'report', reason: string, detail?: string): void;
  }>();

  const router = useRouter();
  const message = useMessage();

  // 自定义Logo组件
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

  // 状态
  const showShareModal = ref(false);
  const showReportModal = ref(false);
  const reportReason = ref('');
  const reportDetail = ref('');

  // 分享平台
  const sharePlatforms = [
    { id: 'weibo', name: '微博', icon: LogoWeiboIcon, color: '#E6162D' },
    { id: 'wechat', name: '微信', icon: LogoWechatIcon, color: '#07C160' },
    { id: 'twitter', name: 'Twitter', icon: LogoTwitter, color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', icon: LogoFacebook, color: '#1877F2' },
    { id: 'email', name: '邮件', icon: Mail, color: '#B23121' },
    { id: 'download', name: '下载', icon: Download, color: '#5C6BC0' }
  ];

  // 举报原因
  const reportReasons = [
    { label: '违法违规内容', value: 'illegal' },
    { label: '色情低俗内容', value: 'pornography' },
    { label: '暴力血腥内容', value: 'violence' },
    { label: '不实信息', value: 'fake' },
    { label: '侵犯版权', value: 'copyright' },
    { label: '不良价值导向', value: 'values' },
    { label: '其他原因', value: 'other' }
  ];

  // 计算属性 - 分享链接
  const shareUrl = computed(() => {
    if (!props.video?.id) return '';
    return `${window.location.origin}/video/${props.video.id}`;
  });

  // 更多操作选项
  const moreOptions = [
    {
      label: '举报',
      key: 'report',
      icon: () => h(NIcon, null, { default: () => h(Flag) })
    },
    {
      label: '下载',
      key: 'download',
      icon: () => h(NIcon, null, { default: () => h(Download) })
    }
  ];

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 格式化日期（相对时间）
  const formatDate = (date?: string) => {
    if (!date) return '';
    return dayjs(date).fromNow();
  };

  // 格式化日期（完整日期）
  const formatFullDate = (date?: string) => {
    if (!date) return '';
    return dayjs(date).format('YYYY年MM月DD日');
  };

  // 处理点击作者
  const handleAuthorClick = () => {
    if (props.video?.author.id) {
      router.push(`/user/${props.video.author.id}`);
    }
  };

  // 处理互动
  const handleLike = () => {
    emit('like');
  };

  const handleFavorite = () => {
    emit('favorite');
  };

  const shareToPlaftorm = (platform: string) => {
    if (!props.video) return;

    let shareUrl = '';
    const videoUrl = encodeURIComponent(`${window.location.origin}/video/${props.video.id}`);
    const title = encodeURIComponent(props.video.title);

    switch (platform) {
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${videoUrl}&title=${title}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${videoUrl}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${videoUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${videoUrl}`;
        break;
      case 'wechat':
        // 显示二维码
        message.info('请使用微信扫描二维码分享');
        return;
      case 'download':
        if (props.video.downloadUrl) {
          window.open(props.video.downloadUrl, '_blank');
        } else {
          message.error('该视频不支持下载');
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=450');
    }

    emit('share');
    message.success('分享成功');
  };

  const copyShareLink = () => {
    if (!shareUrl.value) return;

    navigator.clipboard.writeText(shareUrl.value)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  const handleMoreAction = (key: string) => {
    switch (key) {
      case 'report':
        showReportModal.value = true;
        break;
      case 'download':
        shareToPlaftorm('download');
        break;
    }
  };

  const submitReport = () => {
    if (!reportReason.value) return;

    emit('report', reportReason.value, reportReason.value === 'other' ? reportDetail.value : undefined);

    message.success('举报已提交，我们会尽快处理');
    showReportModal.value = false;
    reportReason.value = '';
    reportDetail.value = '';
  };

  const handleFollow = () => {
    emit('follow');
  };
</script>

<style scoped>
  .video-interaction {
    padding: var(--spacing-lg);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .video-title {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .video-stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .dot {
    color: var(--text-tertiary);
  }

  .interaction-buttons {
    display: flex;
    justify-content: flex-end;
  }

  .author-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .author-profile {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    cursor: pointer;
  }

  .author-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .author-name {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .author-stats {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: 0;
  }

  .description-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .description-text {
    white-space: pre-line;
    color: var(--text-primary);
    font-size: var(--text-base);
    line-height: 1.6;
  }

  .empty-description {
    color: var(--text-tertiary);
    font-style: italic;
  }

  .video-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
  }

  .tag {
    cursor: pointer;
    transition: transform var(--transition-fast);
  }

  .tag:hover {
    transform: scale(1.05);
  }

  .video-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-md);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .meta-item {
    display: flex;
    gap: var(--spacing-xs);
  }

  .meta-label {
    color: var(--text-tertiary);
  }

  .share-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .share-platforms {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .share-platform {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .share-platform:hover {
    background-color: var(--hover-color);
  }

  .share-platform span {
    font-size: var(--text-sm);
  }

  .share-link {
    margin-bottom: var(--spacing-md);
  }

  .share-qrcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .report-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .report-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .video-interaction {
      padding: var(--spacing-md);
    }

    .interaction-buttons {
      justify-content: space-between;
    }

    .author-info {
      flex-direction: column;
      gap: var(--spacing-md);
      align-items: flex-start;
    }

    .share-platforms {
      justify-content: center;
    }
  }
</style>