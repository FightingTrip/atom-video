/**
* @file VideoDetailPage.vue
* @description 视频详情页面，使用VideoPlayerComponent和评论组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="video-detail-container">
    <div v-if="loading" class="loading-state">
        <n-spin size="large" />
      <p>加载视频中...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <n-result status="error" :title="error" :description="'无法加载视频信息，请稍后重试'">
        <template #footer>
          <n-button @click="loadVideo">重试</n-button>
          <n-button @click="$router.push('/')" type="primary">返回首页</n-button>
        </template>
      </n-result>
    </div>
    <div v-else-if="video" class="video-content">
      <!-- 视频播放区 -->
      <div class="main-content">
        <!-- 视频播放器 -->
        <div class="player-wrapper">
          <VideoPlayerTemp :videoUrl="video.videoUrl" :thumbnailUrl="video.coverUrl" :title="video.title"
            :duration="video.duration" @time-update="handleVideoProgress" @ended="handleVideoEnded"
            @loaded="handleVideoLoaded" />
        </div>

        <!-- 视频标题和信息 -->
        <div class="video-primary-info">
          <h1 class="video-title">{{ video.title }}</h1>
          <div class="video-stats">
            <div class="view-count">
              <span>{{ formatViews(video.views) }}次观看</span>
              <span class="dot-separator">•</span>
              <span>{{ formatDate(video.createdAt) }}</span>
            </div>
            <div class="actions">
              <div class="action-button">
                <n-button quaternary circle @click="toggleLike">
                  <template #icon>
                    <n-icon :color="interaction.liked ? '#f00' : undefined">
                      <ThumbsUpOutline />
        </n-icon>
                  </template>
                </n-button>
                <span>{{ formatNumber(video.likes) }}</span>
              </div>
              <div class="action-button">
                <n-button quaternary circle @click="toggleDislike">
                  <template #icon>
                    <n-icon :color="interaction.disliked ? '#f00' : undefined">
                      <ThumbsDownOutline />
                    </n-icon>
                  </template>
                </n-button>
              </div>
              <div class="action-button">
                <n-button quaternary circle @click="openShareDialog">
                  <template #icon>
      <n-icon>
                      <ShareSocialOutline />
      </n-icon>
                  </template>
      </n-button>
                <span>分享</span>
              </div>
              <div class="action-button">
                <n-button quaternary circle @click="downloadVideo">
                  <template #icon>
                    <n-icon>
                      <DownloadOutline />
                    </n-icon>
                  </template>
                </n-button>
                <span>下载</span>
              </div>
              <div class="action-button">
                <n-button quaternary circle @click="toggleFavorite">
                  <template #icon>
                    <n-icon :color="interaction.favorited ? '#f00' : undefined">
                      <BookmarkOutline />
                    </n-icon>
                  </template>
                </n-button>
                <span>{{ interaction.favorited ? '已收藏' : '收藏' }}</span>
              </div>
              <div class="action-button">
                <n-dropdown trigger="click" :options="moreOptions" @select="handleMoreAction">
                  <n-button quaternary circle>
                    <template #icon>
                      <n-icon>
                        <EllipsisHorizontalOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-dropdown>
              </div>
            </div>
          </div>
    </div>

        <!-- 频道信息 -->
        <div class="video-owner-info">
          <n-divider />
          <div class="channel-info">
            <div class="owner-badge">
              <n-avatar round :size="48" :src="video.author?.avatar" />
            </div>
            <div class="owner-info">
              <div class="owner-name">
                <h3>{{ video.author?.nickname || video.author?.username }}</h3>
                <n-badge v-if="video.author?.verified" dot color="#1976d2" />
              </div>
              <div class="subscriber-count">
                <span>{{ formatSubscribers(25600) }}位订阅者</span>
              </div>
            </div>
            <div class="subscribe-button">
              <n-button type="primary" :color="isSubscribed ? 'grey' : undefined" @click="toggleSubscribe">
                {{ isSubscribed ? '已订阅' : '订阅' }}
              </n-button>
            </div>
          </div>

          <!-- 视频描述 -->
          <div class="video-description" :class="{ 'collapsed': !showFullDescription }">
            <div class="description-content" ref="descriptionRef">
              <p class="description-text">{{ video.description }}</p>
              <div class="tags">
                <n-tag v-for="tag in video.tags" :key="tag" size="small">{{ tag }}</n-tag>
      </div>
            </div>
            <div class="show-more" v-if="isDescriptionLong">
              <n-button text @click="toggleDescription">
                {{ showFullDescription ? '收起' : '展开' }}
              </n-button>
            </div>
          </div>
          <n-divider />
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <div class="comments-header">
            <h3>{{ formatNumber(video.comments || 0) }}条评论</h3>
            <n-dropdown trigger="click" :options="sortOptions">
              <n-button quaternary>
                <template #icon>
                  <n-icon>
                    <FilterOutline />
                  </n-icon>
                </template>
                排序方式
              </n-button>
            </n-dropdown>
          </div>

          <!-- 评论输入框 -->
          <div class="comment-add">
            <n-avatar round :size="40" :src="userAvatar" />
            <n-input v-model:value="commentText" type="textarea" placeholder="添加评论..."
              :autosize="{ minRows: 1, maxRows: 4 }" class="comment-input" />
            <div class="comment-actions" :class="{ 'active': commentText.length > 0 }">
              <n-button quaternary size="small" @click="commentText = ''">取消</n-button>
              <n-button type="primary" size="small" :disabled="commentText.length === 0"
                @click="addComment">评论</n-button>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list" v-if="comments.length > 0">
            <div class="comment-item" v-for="comment in comments" :key="comment.id">
              <n-avatar round :size="40" :src="comment.user.avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.user.nickname || comment.user.username }}</span>
                  <span class="comment-time">{{ formatCommentTime(comment.createdAt) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-actions">
                  <n-button quaternary circle size="small" @click="likeComment(comment)">
                    <template #icon>
                      <n-icon :color="comment.userLiked ? '#f00' : undefined">
                        <ThumbsUpOutline />
              </n-icon>
                    </template>
                  </n-button>
                  <span class="like-count">{{ formatNumber(comment.likes) }}</span>
                  <n-button quaternary circle size="small">
                    <template #icon>
                      <n-icon>
                        <ThumbsDownOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button text size="small">回复</n-button>
            </div>
                <div class="replies" v-if="comment.replyCount > 0">
                  <n-button text size="small">
                    <template #icon>
                      <n-icon>
                        <ChevronDownOutline />
                      </n-icon>
          </template>
                    查看{{ comment.replyCount }}条回复
                  </n-button>
                </div>
              </div>
            </div>
          </div>
          <div class="comments-empty" v-else>
            <p>暂无评论</p>
          </div>
        </div>
      </div>

      <!-- 右侧推荐视频 -->
      <div class="side-content">
        <h3 class="related-title">推荐视频</h3>
        <div class="related-videos">
          <div class="related-video-item" v-for="(video, index) in relatedVideos" :key="index">
            <div class="thumbnail-container">
              <img :src="video.coverUrl" :alt="video.title" class="thumbnail" />
              <span class="video-duration">{{ formatDuration(video.duration) }}</span>
            </div>
            <div class="video-info">
              <h4 class="video-title">{{ video.title }}</h4>
              <p class="channel-name">{{ video.author.nickname || video.author.username }}</p>
              <p class="video-metadata">
                {{ formatViews(video.views) }}次观看
                <span class="dot-separator">•</span>
                {{ formatTimeAgo(video.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NButton, NSpin, NResult, NDivider, NAvatar, NIcon, NBadge, NTag, NInput, NDropdown, useMessage, useDialog } from 'naive-ui';
  import {
    ThumbsUpOutline,
    ThumbsDownOutline,
    ShareSocialOutline,
    DownloadOutline,
    BookmarkOutline,
    EllipsisHorizontalOutline,
    FilterOutline,
    ChevronDownOutline
  } from '@vicons/ionicons5';
  import VideoPlayerTemp from './VideoPlayerTemp.vue';

  // 定义视频类型接口
  interface VideoAuthor {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
    verified?: boolean;
  }

  interface Video {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    videoUrl: string;
    duration?: number;
    views: number;
    likes?: number;
    favorites?: number;
    comments?: number;
    createdAt: string;
    author: VideoAuthor;
    tags?: string[];
  }

  interface VideoInteraction {
    liked: boolean;
    disliked: boolean;
    favorited: boolean;
    watched: boolean;
    progress: number;
  }

  interface CommentUser {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
  }

  interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: CommentUser;
    likes: number;
    replyCount: number;
    userLiked: boolean;
  }

  const router = useRouter();
  const route = useRoute();
  const videoId = route.params.id as string;
  const message = useMessage();
  const dialog = useDialog();

  const video = ref<Video | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const isSubscribed = ref(false);
  const showFullDescription = ref(false);
  const isDescriptionLong = ref(true);
  const descriptionRef = ref<HTMLElement | null>(null);
  const commentText = ref('');
  const comments = ref<Comment[]>([]);
  const relatedVideos = ref<Video[]>([]);
  const userAvatar = ref('https://i.pravatar.cc/150?u=user');

  const interaction = ref<VideoInteraction>({
    liked: false,
    disliked: false,
    favorited: false,
    watched: false,
    progress: 0
  });

  // 模拟的评论排序选项
  const sortOptions = [
    {
      label: '最新评论',
      key: 'newest'
    },
    {
      label: '热门评论',
      key: 'top'
    }
  ];

  // 更多选项下拉菜单
  const moreOptions = [
    {
      label: '举报',
      key: 'report'
    },
    {
      label: '不感兴趣',
      key: 'not-interested'
    },
    {
      label: '添加到播放列表',
      key: 'add-to-playlist'
    },
    {
      label: '复制视频链接',
      key: 'copy-link'
    }
  ];

  // 格式化视图数量
  function formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + '百万';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + '千';
    }
    return views.toString();
  }

  // 格式化数字
  function formatNumber(num?: number): string {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // 格式化订阅者数量
  function formatSubscribers(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + '百万';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + '千';
    }
    return count.toString();
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // 格式化评论时间
  function formatCommentTime(dateString: string): string {
    if (!dateString) return '';
    return formatTimeAgo(dateString);
  }

  // 格式化时长
  function formatDuration(seconds?: number): string {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 格式化多久以前
  function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '刚刚';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分钟前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小时前`;
    } else if (diffInSeconds < 2592000) {
      return `${Math.floor(diffInSeconds / 86400)}天前`;
    } else if (diffInSeconds < 31536000) {
      return `${Math.floor(diffInSeconds / 2592000)}个月前`;
    } else {
      return `${Math.floor(diffInSeconds / 31536000)}年前`;
    }
  }

  // 切换描述展开/收起
  function toggleDescription() {
    showFullDescription.value = !showFullDescription.value;
  }

  // 加载视频数据
  async function loadVideo(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      // 使用本地的模拟数据
      const { getVideoById } = await import('./mockData');
      const result = getVideoById(videoId);

      if (result) {
        video.value = result as Video;
        // 加载评论和推荐视频
        loadComments();
        loadRelatedVideos();
      } else {
        error.value = '视频不存在';
      }
    } catch (err) {
      console.error('加载视频失败:', err);
      error.value = '加载视频失败';
    } finally {
        loading.value = false;
    }
  }

  // 加载评论
  function loadComments() {
    // 模拟评论数据
    comments.value = [
      {
        id: 'c1',
        content: '这个视频太棒了，学到了很多知识！期待更多类似的内容。',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        user: {
          id: 'u1',
          username: 'user123',
          nickname: '技术爱好者',
          avatar: 'https://i.pravatar.cc/150?u=u1'
        },
        likes: 42,
        replyCount: 3,
        userLiked: false
      },
      {
        id: 'c2',
        content: '视频质量非常高，讲解清晰易懂。',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        user: {
          id: 'u2',
          username: 'coder999',
          nickname: '代码狂人',
          avatar: 'https://i.pravatar.cc/150?u=u2'
        },
        likes: 18,
        replyCount: 1,
        userLiked: false
      },
      {
        id: 'c3',
        content: '希望能多出一些进阶教程！',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        user: {
          id: 'u3',
          username: 'learner',
          nickname: '学习达人',
          avatar: 'https://i.pravatar.cc/150?u=u3'
        },
        likes: 7,
        replyCount: 0,
        userLiked: false
      }
    ];
  }

  // 加载相关视频
  function loadRelatedVideos() {
    // 模拟相关视频数据
    relatedVideos.value = Array(8).fill(0).map((_, index) => ({
      id: `rv${index + 1}`,
      title: `推荐视频 ${index + 1}: ${['前端开发进阶指南', 'Vue3核心特性详解', 'TypeScript实战教程', 'CSS动画高级技巧', '响应式设计最佳实践'][index % 5]}`,
      description: '推荐视频描述...',
      coverUrl: `https://picsum.photos/id/${(index + 10) % 100}/300/150`,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 300 + index * 60,
      views: 5000 + index * 1000,
      likes: 300 + index * 50,
      favorites: 100 + index * 10,
      comments: 50 + index * 5,
      createdAt: new Date(Date.now() - 86400000 * (index + 1)).toISOString(),
      author: {
        id: `a${index + 1}`,
        username: `creator${index + 1}`,
        nickname: `创作者 ${index + 1}`,
        avatar: `https://i.pravatar.cc/150?u=a${index + 1}`,
        verified: index % 3 === 0
      },
      tags: ['编程', '教程', '技术']
    }));
  }

  // 处理"更多"按钮的操作
  function handleMoreAction(key: string) {
    switch (key) {
      case 'report':
        dialog.warning({
          title: '举报视频',
          content: '您确定要举报此视频吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            message.success('举报已提交，我们将尽快审核');
          }
        });
        break;
      case 'not-interested':
        message.success('已将此视频标记为不感兴趣');
        break;
      case 'add-to-playlist':
        showPlaylistDialog();
        break;
      case 'copy-link':
        copyVideoLink();
        break;
    }
  }

  // 显示播放列表对话框
  function showPlaylistDialog() {
    dialog.info({
      title: '添加到播放列表',
      content: '选择要添加到的播放列表（功能开发中）',
      positiveText: '确定',
      onPositiveClick: () => {
        message.success('已添加到播放列表');
      }
    });
  }

  // 复制视频链接
  function copyVideoLink() {
    const videoUrl = window.location.href;
    navigator.clipboard.writeText(videoUrl).then(() => {
      message.success('已复制视频链接到剪贴板');
    }).catch(err => {
      message.error('复制失败，请手动复制');
      console.error('复制失败:', err);
    });
  }

  // 切换点赞状态
  function toggleLike() {
    // 如果已经不喜欢，先取消不喜欢
    if (interaction.value.disliked) {
      interaction.value.disliked = false;
    }

    // 切换点赞状态
    interaction.value.liked = !interaction.value.liked;

    // 更新视频点赞数
    if (video.value && video.value.likes !== undefined) {
      if (interaction.value.liked) {
        video.value.likes += 1;
      } else {
        video.value.likes -= 1;
      }
    }

    message.success(interaction.value.liked ? '已点赞' : '已取消点赞');
    saveInteraction();
  }

  // 切换不喜欢状态
  function toggleDislike() {
    // 如果已经点赞，先取消点赞
    if (interaction.value.liked) {
      interaction.value.liked = false;
      // 更新视频点赞数
      if (video.value && video.value.likes !== undefined) {
        video.value.likes -= 1;
      }
    }

    // 切换不喜欢状态
    interaction.value.disliked = !interaction.value.disliked;

    message.success(interaction.value.disliked ? '已标记为不喜欢' : '已取消不喜欢');
    saveInteraction();
  }

  // 切换收藏状态
  function toggleFavorite() {
    interaction.value.favorited = !interaction.value.favorited;

    // 更新视频收藏数
    if (video.value && video.value.favorites !== undefined) {
      if (interaction.value.favorited) {
        video.value.favorites += 1;
      } else {
        video.value.favorites -= 1;
      }
    }

    message.success(interaction.value.favorited ? '已添加到收藏' : '已从收藏中移除');
    saveInteraction();
  }

  // 打开分享对话框
  function openShareDialog() {
    const shareOptions = [
      { label: '微信', key: 'wechat' },
      { label: '微博', key: 'weibo' },
      { label: 'QQ', key: 'qq' },
      { label: '复制链接', key: 'copy' }
    ];

    dialog.info({
      title: '分享视频',
      content: '选择分享方式',
      action: () => {
        return h('div', { class: 'share-options' },
          shareOptions.map(option =>
            h('div', {
              class: 'share-option',
              onClick: () => handleShare(option.key)
            }, option.label)
          )
        );
      },
      positiveText: '关闭'
    });
  }

  // 处理分享
  function handleShare(platform: string) {
    const videoUrl = window.location.href;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(videoUrl).then(() => {
          message.success('已复制视频链接到剪贴板');
        }).catch(err => {
          message.error('复制失败，请手动复制');
        });
        break;
      default:
        message.info(`分享到${platform}功能开发中`);
        break;
    }
  }

  // 下载视频
  function downloadVideo() {
    message.info('视频下载功能开发中...');
  }

  // 切换订阅状态
  function toggleSubscribe() {
    isSubscribed.value = !isSubscribed.value;
    message.success(isSubscribed.value ? '订阅成功' : '已取消订阅');

    // 实际应用中这里应该调用API
  }

  // 添加评论
  function addComment() {
    if (commentText.value.trim() === '') return;

    // 创建新评论
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content: commentText.value,
      createdAt: new Date().toISOString(),
      user: {
        id: 'current-user',
        username: 'current_user',
        nickname: '当前用户',
        avatar: userAvatar.value
      },
      likes: 0,
      replyCount: 0,
      userLiked: false
    };

    // 添加到评论列表
    comments.value.unshift(newComment);

    // 更新视频评论数
    if (video.value && video.value.comments !== undefined) {
      video.value.comments += 1;
    }

    // 清空评论框
    commentText.value = '';

    message.success('评论发布成功');
  }

  // 点赞评论
  function likeComment(comment: Comment) {
    comment.userLiked = !comment.userLiked;

    if (comment.userLiked) {
      comment.likes += 1;
      } else {
      comment.likes -= 1;
    }

    message.success(comment.userLiked ? '已点赞评论' : '已取消点赞');
  }

  // 保存互动状态
  function saveInteraction() {
    // 实际应用中，这里应该调用API将用户与视频的互动状态保存到服务器
    localStorage.setItem(`video_interaction_${videoId}`, JSON.stringify(interaction.value));
  }

  // 加载互动状态
  function loadInteraction() {
    const savedInteraction = localStorage.getItem(`video_interaction_${videoId}`);
    if (savedInteraction) {
      try {
        interaction.value = JSON.parse(savedInteraction);
      } catch (e) {
        console.error('加载互动状态失败:', e);
      }
    }
  }

  // 在加载视频成功后扩展界面交互功能
  watch(() => video.value, (newVideo) => {
    if (newVideo) {
      // 加载用户与此视频的互动状态
      loadInteraction();
      // 为评论添加用户点赞状态
      addUserLikedFlag();
    }
  }, { immediate: true });

  // 添加用户喜欢状态标记
  function addUserLikedFlag() {
    comments.value.forEach(comment => {
      // 这里模拟从服务器获取用户是否已点赞某评论
      comment.userLiked = false;
    });
  }

  // 记录观看历史
  function recordWatchHistory() {
    if (!video.value) return;

    // 标记为已观看
    interaction.value.watched = true;

    // 获取当前观看历史
    let watchHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');

    // 检查是否已在历史记录中
    const existingIndex = watchHistory.findIndex((item: { id: string }) => item.id === videoId);

    // 创建历史记录条目
    const historyItem = {
      id: videoId,
      title: video.value.title,
      coverUrl: video.value.coverUrl,
      author: video.value.author,
      timestamp: new Date().toISOString()
    };

    // 如果已存在则移除旧记录
    if (existingIndex !== -1) {
      watchHistory.splice(existingIndex, 1);
    }

    // 添加到历史记录开头
    watchHistory.unshift(historyItem);

    // 限制历史记录数量(保留最近的100条)
    if (watchHistory.length > 100) {
      watchHistory = watchHistory.slice(0, 100);
    }

    // 保存历史记录
    localStorage.setItem('watch_history', JSON.stringify(watchHistory));
    saveInteraction();
  }

  // 视频播放进度更新
  function handleVideoProgress(time: number) {
    if (!video.value || !video.value.duration) return;

    // 更新进度
    interaction.value.progress = time;

    // 计算观看百分比
    const watchedPercent = (time / video.value.duration) * 100;

    // 如果观看超过50%，记录到历史
    if (watchedPercent > 50 && !interaction.value.watched) {
      recordWatchHistory();
    }

    // 每30秒保存一次进度
    if (Math.floor(time) % 30 === 0) {
      saveInteraction();
    }
  }

  // 处理视频加载完成
  function handleVideoLoaded(videoData: any) {
    console.log('视频加载完成:', videoData);
  }

  // 处理视频播放结束
  function handleVideoEnded() {
    console.log('视频播放结束');
    // 标记为已观看
    interaction.value.watched = true;
    saveInteraction();

    // 自动播放下一个推荐视频
    if (relatedVideos.value.length > 0) {
      const nextVideo = relatedVideos.value[0];

      dialog.info({
        title: '自动播放下一个视频',
        content: `即将播放: ${nextVideo.title}`,
        positiveText: '播放',
        negativeText: '取消',
        onPositiveClick: () => {
          router.push(`/video/${nextVideo.id}`);
        }
      });
    }
  }

  onMounted(() => {
    loadVideo();
  });
</script>

<style scoped>
  .video-detail-container {
    max-width: 1750px;
    margin: 0 auto;
    padding: 20px;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 20px;
  }

  .video-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .player-wrapper {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background-color: #000;
    margin-bottom: 16px;
  }

  .video-primary-info {
    padding-bottom: 16px;
  }

  .video-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .video-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .view-count {
    color: #606060;
    font-size: 14px;
  }

  .dot-separator {
    margin: 0 4px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #606060;
  }

  .channel-info {
    display: flex;
    align-items: center;
    padding: 16px 0;
  }

  .owner-badge {
    margin-right: 16px;
  }

  .owner-info {
    flex: 1;
  }

  .owner-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .owner-name h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  .subscriber-count {
    font-size: 12px;
    color: #606060;
  }

  .subscribe-button {
    margin-left: 16px;
  }

  .video-description {
    position: relative;
    padding: 12px 0;
    margin-bottom: 16px;
  }

  .description-content {
    transition: max-height 0.3s;
  }

  .description-text {
    margin: 0;
    white-space: pre-line;
    line-height: 1.4;
  }

  .video-description.collapsed .description-content {
    max-height: 80px;
    overflow: hidden;
  }

  .show-more {
    margin-top: 8px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .comments-section {
    margin-top: 24px;
  }

  .comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .comments-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  .comment-add {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    align-items: flex-start;
  }

  .comment-input {
    flex: 1;
  }

  .comment-actions {
    display: none;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }

  .comment-actions.active {
    display: flex;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .comment-item {
    display: flex;
    gap: 16px;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    margin-bottom: 4px;
  }

  .comment-author {
    font-weight: 500;
    margin-right: 8px;
  }

  .comment-time {
    font-size: 12px;
    color: #606060;
  }

  .comment-text {
    margin: 8px 0;
    line-height: 1.4;
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .like-count {
    font-size: 12px;
    color: #606060;
    margin-right: 8px;
  }

  .replies {
    margin-top: 8px;
  }

  .comments-empty {
    color: #606060;
    text-align: center;
    padding: 32px 0;
  }

  .side-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .related-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
  }

  .related-videos {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .related-video-item {
    display: flex;
    gap: 8px;
    cursor: pointer;
  }

  .thumbnail-container {
    position: relative;
    width: 168px;
    height: 94px;
    flex-shrink: 0;
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 12px;
  }

  .video-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .video-info .video-title {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .channel-name {
    font-size: 12px;
    color: #606060;
    margin: 0;
  }

  .video-metadata {
    font-size: 12px;
    color: #606060;
    margin: 0;
  }

  /* 响应式布局 */
  @media (max-width: 1200px) {
    .video-content {
      grid-template-columns: 1fr;
    }

    .side-content {
      margin-top: 24px;
    }

    .related-videos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .related-video-item {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .video-stats {
      flex-direction: column;
      align-items: flex-start;
    }

    .actions {
      width: 100%;
      justify-content: space-between;
    }

    .channel-info {
      flex-wrap: wrap;
    }

    .subscribe-button {
      margin-left: 0;
      margin-top: 16px;
      width: 100%;
    }

    .subscribe-button button {
      width: 100%;
    }

    .related-videos {
      grid-template-columns: 1fr;
    }
  }

  .share-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 16px;
  }

  .share-option {
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
  }

  .share-option:hover {
    background-color: #e5e5e5;
  }
</style>