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
                <LogoWeiboIcon />
              </n-icon>
              <span>微博</span>
            </div>
            <div class="share-option" @click="shareVia('qq')">
              <n-icon size="24">
                <LogoQqIcon />
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
    LogoFacebook
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
  const openShareModalAction = () => {
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
      click: () => openShareModalAction(),
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