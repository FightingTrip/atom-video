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

  // 状态
  const showShareModal = ref(false);
  const showReportModal = ref(false);
  const reportReason = ref('');
  const reportDetail = ref('');

  // 分享平台
  const sharePlatforms = [
    { id: 'weibo', name: '微博', icon: LogoWeibo, color: '#E6162D' },
    { id: 'wechat', name: '微信', icon: LogoWechat, color: '#07C160' },
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