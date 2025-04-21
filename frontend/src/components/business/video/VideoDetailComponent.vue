/**
* @file VideoDetailComponent.vue
* @description 视频详情组件 - 展示视频详细信息的业务组件
* @author Atom Video Team
* @date 2025-04-09
*
* @features
* - 视频播放：支持播放、暂停、进度控制、音量调节
* - 视频信息：标题、描述、标签、观看数据
* - 作者信息：头像、昵称、简介、关注状态
* - 互动功能：点赞、收藏、分享、关注
* - 评论系统：评论发布、回复、点赞、分页加载
* - 响应式布局：适配不同屏幕尺寸
* - 主题适配：支持明暗主题切换
*
* @dependencies
* - naive-ui: UI组件库
* - @vueuse/core: 实用工具集
* - @vicons/ionicons5: 图标库
*
* @props
* - video: 视频信息对象
* - currentTime: 当前播放时间（可选）
* - isLiked: 是否已点赞（可选）
* - isFavorited: 是否已收藏（可选）
* - isSubscribed: 是否已关注（可选）
* - offlineMode: 是否离线模式（可选）
*
* @emits
* - time-update: 播放时间更新
* - play: 开始播放
* - pause: 暂停播放
* - ended: 播放结束
* - like: 点赞操作
* - favorite: 收藏操作
* - subscribe: 关注操作
* - comment: 发表评论
* - load-more-comments: 加载更多评论
* - preview-clip: 预览视频片段
* - jump-to-time: 跳转到指定时间
*/
<template>
  <div class="video-detail">
    <!-- 视频信息 -->
    <div class="video-info">
      <h1 class="title">{{ video.title }}</h1>
      <div class="meta">
        <div class="stats">
          <span class="views">{{ formatNumber(video.views) }} 次观看</span>
          <span class="date">{{ formatDate(video.createdAt) }}</span>
        </div>
        <div class="actions">
          <n-button-group>
            <n-button quaternary :type="isLiked ? 'primary' : 'default'" @click="handleLike">
              <template #icon>
                <n-icon>
                  <ThumbsUp />
                </n-icon>
              </template>
              {{ formatNumber(video.likes) }}
            </n-button>
            <n-button quaternary :type="isFavorited ? 'primary' : 'default'" @click="handleFavorite">
              <template #icon>
                <n-icon>
                  <Bookmark />
                </n-icon>
              </template>
              {{ formatNumber(video.favorites) }}
            </n-button>
            <n-button quaternary>
              <template #icon>
                <n-icon>
                  <Share />
                </n-icon>
              </template>
              分享
            </n-button>
          </n-button-group>
        </div>
      </div>
    </div>

    <!-- 作者信息 -->
    <div class="author-info">
      <div class="author-header">
        <n-avatar round :size="48" :src="video.author.avatar" :fallback-src="fallbackAvatar" />
        <div class="author-meta">
          <h3 class="author-name">{{ video.author.nickname }}</h3>
          <p class="author-bio">{{ video.author.description }}</p>
        </div>
        <n-button :type="isSubscribed ? 'primary' : 'default'" @click="handleSubscribe">
          {{ isSubscribed ? '已关注' : '关注' }}
        </n-button>
      </div>
      <div class="author-stats">
        <span>{{ formatNumber(video.author.followersCount || 0) }} 粉丝</span>
        <span>{{ formatNumber(video.author.followingCount || 0) }} 关注</span>
        <span>{{ formatNumber(video.views) }} 播放</span>
      </div>
    </div>

    <!-- 视频描述 -->
    <div class="description">
      <p>{{ video.description }}</p>
      <div class="tags" v-if="video.tags?.length">
        <n-tag v-for="tag in video.tags" :key="tag" size="small" round>
          {{ tag }}
        </n-tag>
      </div>
    </div>

    <!-- 视频互动区 -->
    <div class="video-actions">
      <template v-for="(action, index) in actionButtons" :key="index">
        <!-- 对于禁用的按钮使用tooltip提示 -->
        <n-tooltip v-if="action.disabled" trigger="hover" placement="bottom" :content="action.tooltip">
          <n-button class="action-button" :class="{ active: action.active }" :disabled="action.disabled" ghost
            @click="action.click">
            <template #icon>
              <n-icon size="20">
                <component
                  :is="action.active ? action.activeIcon ? action.activeIcon() : action.icon() : action.icon()" />
              </n-icon>
            </template>
            {{ action.text }}
            <span v-if="action.count" class="count">({{ action.count }})</span>
          </n-button>
        </n-tooltip>

        <!-- 对于未禁用的按钮直接显示，不需要tooltip -->
        <n-button v-else class="action-button" :class="{ active: action.active }" ghost @click="action.click">
          <template #icon>
            <n-icon size="20">
              <component
                :is="action.active ? action.activeIcon ? action.activeIcon() : action.icon() : action.icon()" />
            </n-icon>
          </template>
          {{ action.text }}
          <span v-if="action.count" class="count">({{ action.count }})</span>
        </n-button>
      </template>
    </div>

    <!-- 离线模式状态提示 -->
    <div v-if="offlineMode" class="offline-notice">
      <n-icon color="#f0a020">
        <CloudOfflineOutline />
      </n-icon>
      <span>离线模式下，互动功能将在本地模拟，不会同步到服务器</span>
    </div>

    <!-- 新增: 分享模态框 -->
    <n-modal v-model:show="showShareModal" preset="card" style="width: 420px" :title="shareModalTitle">
      <div class="share-modal-content">
        <!-- 正常分享 -->
        <template v-if="!isClipSharingMode">
          <div class="share-options">
            <div class="share-option" @click="shareVia('copy')">
              <n-icon size="24">
                <CopyOutline />
              </n-icon>
              <span>复制链接</span>
            </div>
            <div class="share-option" @click="shareVia('wechat')">
              <n-icon size="24">
                <LogoWechat />
              </n-icon>
              <span>微信</span>
            </div>
            <div class="share-option" @click="shareVia('weibo')">
              <n-icon size="24">
                <LogoWeibo />
              </n-icon>
              <span>微博</span>
            </div>
            <div class="share-option" @click="shareVia('qq')">
              <n-icon size="24">
                <LogoQq />
              </n-icon>
              <span>QQ</span>
            </div>
            <div class="share-option" @click="shareVia('twitter')">
              <n-icon size="24">
                <LogoTwitter />
              </n-icon>
              <span>Twitter</span>
            </div>
            <div class="share-option" @click="shareVia('facebook')">
              <n-icon size="24">
                <LogoFacebook />
              </n-icon>
              <span>Facebook</span>
            </div>
          </div>

          <div class="advanced-sharing">
            <n-divider>高级分享选项</n-divider>

            <div class="start-at">
              <span>从特定时间开始播放:</span>
              <div class="time-input-group">
                <n-input-number v-model:value="shareStartMinutes" :min="0" :max="Math.floor((video.duration || 0) / 60)"
                  placeholder="分钟" size="small" />
                <span>:</span>
                <n-input-number v-model:value="shareStartSeconds" :min="0" :max="59" placeholder="秒" size="small" />
                <n-button size="small" @click="setCurrentTimeAsStart">当前时间</n-button>
              </div>
            </div>

            <div class="share-clip">
              <n-button @click="enableClipSharing">分享视频片段</n-button>
            </div>
          </div>

          <div class="share-link">
            <n-input :value="shareUrl" readonly>
              <template #suffix>
                <n-button quaternary @click="copyShareUrl">
                  <n-icon>
                    <CopyOutline />
                  </n-icon>
                </n-button>
              </template>
            </n-input>
          </div>
        </template>

        <!-- 视频片段分享模式 -->
        <template v-else>
          <div class="clip-editor">
            <div class="clip-preview">
              <img :src="clipPreviewImage || video.coverUrl" alt="视频预览" class="clip-preview-image" />
              <div class="clip-preview-overlay">
                <n-button @click="previewClip">播放预览</n-button>
              </div>
            </div>

            <div class="clip-time-range">
              <div class="clip-start">
                <span>开始时间:</span>
                <div class="time-input-group">
                  <n-input-number v-model:value="clipStartMinutes" :min="0"
                    :max="Math.floor((video.duration || 0) / 60)" placeholder="分钟" size="small" />
                  <span>:</span>
                  <n-input-number v-model:value="clipStartSeconds" :min="0" :max="59" placeholder="秒" size="small" />
                </div>
              </div>

              <div class="clip-end">
                <span>结束时间:</span>
                <div class="time-input-group">
                  <n-input-number v-model:value="clipEndMinutes" :min="0" :max="Math.floor((video.duration || 0) / 60)"
                    placeholder="分钟" size="small" />
                  <span>:</span>
                  <n-input-number v-model:value="clipEndSeconds" :min="0" :max="59" placeholder="秒" size="small" />
                </div>
              </div>
            </div>

            <div class="clip-duration">
              <span>片段长度: {{ formatDuration(clipDuration) }}</span>
              <n-slider v-model:value="[clipStartTime, clipEndTime]" range :min="0" :max="video.duration || 600"
                :step="1" :tooltip="false" @update:value="updateClipTimes" />
            </div>

            <div class="clip-actions">
              <n-button @click="cancelClipSharing">取消</n-button>
              <n-button type="primary" @click="shareClip" :disabled="clipDuration <= 0">分享片段</n-button>
            </div>
          </div>
        </template>
      </div>
    </n-modal>

    <!-- 评论区 -->
    <div class="comments">
      <h2 class="comments-title">
        {{ formatNumber(video.comments) }} 条评论
      </h2>

      <!-- 评论输入 -->
      <div class="comment-input">
        <n-avatar round :size="40" :src="userAvatar" :fallback-src="fallbackUserAvatar" />
        <div class="comment-input-wrapper">
          <n-input v-model:value="commentText" type="textarea" placeholder="添加评论..."
            :autosize="{ minRows: 2, maxRows: 6 }" @keydown.enter.prevent="handleComment" />

          <!-- 时间戳按钮 -->
          <div class="comment-tools">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary size="small" @click="insertCurrentTimestamp">
                  <template #icon>
                    <n-icon>
                      <TimeOutline />
                    </n-icon>
                  </template>
                  添加时间戳
                </n-button>
              </template>
              在评论中插入当前播放时间
            </n-tooltip>

            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary size="small" @click="insertMention">
                  <template #icon>
                    <n-icon>
                      <PersonAddOutline />
                    </n-icon>
                  </template>
                  @用户
                </n-button>
              </template>
              在评论中@其他用户
            </n-tooltip>
          </div>
        </div>
        <n-button type="primary" :disabled="!commentText.trim()" @click="handleComment">
          评论
        </n-button>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <n-avatar round :size="40" :src="comment.author.avatar"
            :fallback-src="getFallbackAvatar(comment.author.id)" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author.nickname }}</span>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-text" v-html="formatCommentWithTimestamps(comment.content)"></p>
            <div class="comment-actions">
              <n-button quaternary size="small">
                <template #icon>
                  <n-icon>
                    <ThumbsUp />
                  </n-icon>
                </template>
                {{ formatNumber(comment.likes) }}
              </n-button>
              <n-button quaternary size="small">
                <template #icon>
                  <n-icon>
                    <Chatbubble />
                  </n-icon>
                </template>
                回复
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMoreComments" class="load-more">
        <n-button :loading="loadingMore" :disabled="loadingMore" @click="loadMoreComments">
          加载更多
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, h, inject } from 'vue'
  import {
    NButton, NButtonGroup, NIcon, NInput, NAvatar, NTag, NTooltip,
    NModal, NDivider, NInputNumber, NSlider, useMessage
  } from 'naive-ui'
  import {
    ThumbsUp, Bookmark, Share, Chatbubble, ThumbsUpOutline, HeartOutline,
    Heart, ShareSocialOutline, DownloadOutline, CloudOfflineOutline,
    CopyOutline, TimeOutline, PersonAddOutline, LogoWechat, LogoTwitter,
    LogoFacebook, LogoWeibo, LogoQq
  } from '@vicons/ionicons5'
  import type { Video, Comment, PropType } from '@/types'
  import { useAuthStore } from '@/stores/auth'
  import { formatNumber as importedFormatNumber, formatDate as formatDateUtil } from '@/utils/format'

  // 确保formatNumber函数在组件内可用，防止导入失败或无法访问
  const formatNumber = (num: number): string => {
    if (typeof importedFormatNumber === 'function') {
      try {
        return importedFormatNumber(num);
      } catch (error) {
        console.warn('导入的formatNumber函数调用失败，使用内部实现', error);
      }
    }
    // 内部实现作为备份
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const props = defineProps({
    video: {
      type: Object as PropType<Video>,
      required: true
    },
    isLiked: {
      type: Boolean,
      default: false
    },
    isFavorited: {
      type: Boolean,
      default: false
    },
    isSubscribed: {
      type: Boolean,
      default: false
    },
    offlineMode: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits<{
    (e: 'like'): void
    (e: 'favorite'): void
    (e: 'subscribe'): void
    (e: 'comment', content: string): void
    (e: 'load-more-comments'): void
    (e: 'preview-clip', range: { startTime: number, endTime: number }): void
    (e: 'jump-to-time', seconds: number): void
  }>()

  // 状态
  const authStore = useAuthStore()
  const commentText = ref('')
  const comments = ref<Comment[]>([])
  const loadingMore = ref(false)
  const hasMoreComments = ref(true)

  // 计算属性
  const userAvatar = computed(() => authStore.user?.avatar)
  const fallbackAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.video.author.id}`
  })
  const fallbackUserAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.id}`
  })

  // 消息组件
  const message = useMessage();

  // 注入当前播放时间
  const currentPlayerTime = inject<number>('currentPlayerTime', 0);

  // 分享功能状态
  const showShareModal = ref(false);
  const isClipSharingMode = ref(false);
  const shareStartMinutes = ref(0);
  const shareStartSeconds = ref(0);
  const clipStartMinutes = ref(0);
  const clipStartSeconds = ref(0);
  const clipEndMinutes = ref(0);
  const clipEndSeconds = ref(0);
  const clipStartTime = ref(0);
  const clipEndTime = ref(0);
  const clipPreviewImage = ref('');

  // 计算分享标题
  const shareModalTitle = computed(() => {
    return isClipSharingMode.value ? '分享视频片段' : '分享视频';
  });

  // 计算分享URL
  const shareUrl = computed(() => {
    let url = `https://atomvideo.example.com/video/${props.video.id}`;

    // 添加开始时间参数
    const startSeconds = shareStartMinutes.value * 60 + shareStartSeconds.value;
    if (startSeconds > 0) {
      url += `?t=${startSeconds}`;
    }

    return url;
  });

  // 计算片段时长
  const clipDuration = computed(() => {
    return clipEndTime.value - clipStartTime.value;
  });

  // 格式化持续时间
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 显示分享模态框
  const openShareModal = () => {
    showShareModal.value = true;
    isClipSharingMode.value = false;

    // 重置分享参数
    shareStartMinutes.value = 0;
    shareStartSeconds.value = 0;
  };

  // 复制分享链接
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl.value)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 通过特定渠道分享
  const shareVia = (platform: string) => {
    let shareLink = '';
    const title = encodeURIComponent(props.video.title);
    const url = encodeURIComponent(shareUrl.value);

    switch (platform) {
      case 'copy':
        copyShareUrl();
        return;
      case 'wechat':
        message.info('请使用微信扫一扫功能');
        // 实际应用中应该显示二维码
        return;
      case 'weibo':
        shareLink = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
        break;
      case 'qq':
        shareLink = `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank');
    }
  };

  // 设置当前播放时间为分享起始时间
  const setCurrentTimeAsStart = () => {
    const currentTime = currentPlayerTime;
    shareStartMinutes.value = Math.floor(currentTime / 60);
    shareStartSeconds.value = Math.floor(currentTime % 60);
  };

  // 启用片段分享模式
  const enableClipSharing = () => {
    isClipSharingMode.value = true;

    // 初始化片段时间范围
    const currentTime = currentPlayerTime;
    clipStartTime.value = Math.max(0, currentTime - 5); // 当前时间前5秒
    clipEndTime.value = Math.min(props.video.duration || 600, currentTime + 15); // 当前时间后15秒

    // 更新分钟和秒数输入框
    updateClipTimeInputs();
  };

  // 取消片段分享
  const cancelClipSharing = () => {
    isClipSharingMode.value = false;
  };

  // 预览片段
  const previewClip = () => {
    // 这里应该调用视频播放器组件的方法播放片段
    // 在实际实现中需要与播放器组件通信
    message.info(`预览 ${formatDuration(clipStartTime.value)} 到 ${formatDuration(clipEndTime.value)} 的片段`);

    // 发出事件通知播放器
    emit('preview-clip', {
      startTime: clipStartTime.value,
      endTime: clipEndTime.value
    });
  };

  // 分享片段
  const shareClip = () => {
    // 构建带有片段参数的分享链接
    const clipUrl = `https://atomvideo.example.com/video/${props.video.id}?start=${clipStartTime.value}&end=${clipEndTime.value}`;

    // 复制链接到剪贴板
    navigator.clipboard.writeText(clipUrl)
      .then(() => {
        message.success('视频片段链接已复制到剪贴板');
        isClipSharingMode.value = false;
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 更新片段时间输入
  const updateClipTimeInputs = () => {
    clipStartMinutes.value = Math.floor(clipStartTime.value / 60);
    clipStartSeconds.value = Math.floor(clipStartTime.value % 60);
    clipEndMinutes.value = Math.floor(clipEndTime.value / 60);
    clipEndSeconds.value = Math.floor(clipEndTime.value % 60);
  };

  // 从输入更新片段时间
  const updateClipTimes = (values: number[]) => {
    clipStartTime.value = values[0];
    clipEndTime.value = values[1];
    updateClipTimeInputs();
  };

  // 插入当前时间戳到评论
  const insertCurrentTimestamp = () => {
    const currentTime = currentPlayerTime;
    const formattedTime = formatDuration(currentTime);
    commentText.value += ` [${formattedTime}] `;
  };

  // 插入@提及
  const insertMention = () => {
    commentText.value += ' @用户 ';
    // 在实际应用中，这里应该弹出用户选择器
  };

  // 格式化评论，将时间戳转为可点击链接
  const formatCommentWithTimestamps = (content: string) => {
    if (!content) return '';

    // 匹配形如 [0:00] 或 [00:00] 或 [0:00:00] 的时间戳
    const timeRegex = /\[(\d+:)?(\d+:\d+)\]/g;

    // 替换为可点击的时间链接
    return content.replace(timeRegex, (match, p1, p2) => {
      const timeString = p1 ? `${p1}${p2}` : p2;

      // 解析时间为秒数
      let seconds = 0;
      const parts = timeString.split(':').map(Number);

      if (parts.length === 3) {
        // 时:分:秒
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        // 分:秒
        seconds = parts[0] * 60 + parts[1];
      }

      return `<a href="javascript:void(0)" class="timestamp-link" data-time="${seconds}" onclick="window.jumpToVideoTime(${seconds})">${match}</a>`;
    });
  };

  // 方法重写
  const showShareModal = () => {
    openShareModal();
  };

  // 导出jumpToVideoTime到window对象
  if (typeof window !== 'undefined') {
    window.jumpToVideoTime = (seconds: number) => {
      emit('jump-to-time', seconds);
    };
  }

  // 交互按钮（更新）
  const actionButtons = [
    {
      icon: () => h(ThumbsUpOutline),
      activeIcon: () => h(ThumbsUp),
      text: '点赞',
      active: props.isLiked,
      count: computed(() => formatNumber(props.video.likes)),
      click: () => emit('like'),
      tooltip: computed(() => props.offlineMode ? '离线模式下，操作仅在本地显示' : (props.isLiked ? '取消点赞' : '点赞')),
      disabled: false
    },
    {
      icon: () => h(HeartOutline),
      activeIcon: () => h(Heart),
      text: '收藏',
      active: props.isFavorited,
      count: computed(() => formatNumber(props.video.favorites)),
      click: () => emit('favorite'),
      tooltip: computed(() => props.offlineMode ? '离线模式下，操作仅在本地显示' : (props.isFavorited ? '取消收藏' : '收藏')),
      disabled: false
    },
    {
      icon: () => h(ShareSocialOutline),
      text: '分享',
      active: false,
      count: null,
      click: () => openShareModal(),
      tooltip: '分享视频',
      disabled: props.offlineMode // 离线模式下禁用分享
    },
    {
      icon: () => h(DownloadOutline),
      text: '下载',
      active: false,
      count: null,
      click: handleDownload,
      tooltip: props.offlineMode ? '离线模式下无法下载' : '下载视频',
      disabled: props.offlineMode // 离线模式下禁用下载
    }
  ]

  // 方法
  const handleLike = () => {
    emit('like')
  }

  const handleFavorite = () => {
    emit('favorite')
  }

  const handleSubscribe = () => {
    emit('subscribe')
  }

  const handleComment = () => {
    if (!commentText.value.trim()) return
    emit('comment', commentText.value)
    commentText.value = ''
  }

  const loadMoreComments = async () => {
    if (loadingMore.value) return
    loadingMore.value = true
    await emit('load-more-comments')
    loadingMore.value = false
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else if (diff < 2592000000) {
      return `${Math.floor(diff / 86400000)}天前`
    } else {
      return d.toLocaleDateString()
    }
  }

  const getFallbackAvatar = (id: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
  }

  // 下载视频
  const handleDownload = () => {
    // 实现下载功能
    alert('下载功能暂未实现');
  }
</script>

<style scoped>
  .video-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
    background-color: var(--bg-color);
  }

  .video-info {
    margin-bottom: var(--spacing-xl);
  }

  .video-title {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: var(--spacing-md);
  }

  .video-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    color: var(--text-color-secondary);
    font-size: var(--text-sm);
  }

  .video-stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .video-description {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--bg-color-secondary);
    border-radius: var(--radius-lg);
    color: var(--text-color);
    font-size: var(--text-base);
    line-height: 1.6;
  }

  .video-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }

  .tag {
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--bg-color-tertiary);
    color: var(--text-color-secondary);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    transition: background-color 0.2s ease;
  }

  .tag:hover {
    background-color: var(--hover-color);
    color: var(--text-color);
  }

  /* 暗色模式特定样式 */
  :root.dark .video-detail,
  .dark-mode .video-detail {
    background-color: var(--bg-color-dark);
  }

  :root.dark .video-title,
  .dark-mode .video-title {
    color: var(--text-color-dark);
  }

  :root.dark .video-meta,
  .dark-mode .video-meta {
    color: var(--text-color-secondary-dark);
  }

  :root.dark .video-description,
  .dark-mode .video-description {
    background-color: var(--bg-color-darker);
    color: var(--text-color-dark);
  }

  :root.dark .tag,
  .dark-mode .tag {
    background-color: var(--bg-color-darker);
    color: var(--text-color-secondary-dark);
  }

  :root.dark .tag:hover,
  .dark-mode .tag:hover {
    background-color: var(--hover-color-dark);
    color: var(--text-color-dark);
  }

  .author-info {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .author-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .author-meta {
    flex: 1;
  }

  .author-name {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .author-bio {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .author-stats {
    display: flex;
    gap: var(--spacing-lg);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .comments {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .comments-title {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
  }

  .comment-input {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .comment-item {
    display: flex;
    gap: var(--spacing-md);
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
  }

  .comment-author {
    font-weight: 600;
    color: var(--text-primary);
  }

  .comment-date {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .comment-text {
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    line-height: 1.5;
  }

  .comment-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-lg);
  }

  .video-actions {
    display: flex;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 18px;
    transition: all 0.2s;
  }

  .action-button.active {
    color: var(--primary-color, #1890ff);
    background-color: var(--primary-color-light, #e6f7ff);
  }

  .action-button:hover:not(:disabled) {
    background-color: var(--color-bg-hover, #f5f5f5);
  }

  .action-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .offline-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 0;
    padding: 8px 12px;
    background-color: var(--warning-color-light, #fff7e6);
    border-radius: 4px;
    color: var(--warning-color, #faad14);
    font-size: 0.9em;
  }

  @media (max-width: 768px) {
    .video-detail {
      padding: var(--spacing-md);
    }

    .meta {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .author-header {
      flex-direction: column;
      text-align: center;
    }

    .author-stats {
      justify-content: center;
    }

    .comment-input {
      flex-direction: column;
    }
  }

  /* 评论工具 */
  .comment-input-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .comment-tools {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  /* 时间戳链接样式 */
  :deep(.timestamp-link) {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    background-color: var(--primary-color-light);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
  }

  :deep(.timestamp-link:hover) {
    text-decoration: underline;
    background-color: var(--primary-color-lighter);
  }

  /* 分享模态框样式 */
  .share-modal-content {
    padding: 16px 0;
  }

  .share-options {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .share-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .share-option:hover {
    background-color: var(--hover-color);
  }

  .advanced-sharing {
    margin: 16px 0;
  }

  .start-at {
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .time-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .share-clip {
    margin: 16px 0;
  }

  .share-link {
    margin-top: 16px;
  }

  /* 视频片段编辑器 */
  .clip-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .clip-preview {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #000;
  }

  .clip-preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .clip-preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .clip-preview:hover .clip-preview-overlay {
    opacity: 1;
  }

  .clip-time-range {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  .clip-start,
  .clip-end {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .clip-duration {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .clip-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    /* ... existing code ... */

    .comment-tools {
      justify-content: space-between;
    }

    .share-options {
      gap: 8px;
    }

    .clip-time-range {
      flex-direction: column;
      gap: 12px;
    }
  }
</style>