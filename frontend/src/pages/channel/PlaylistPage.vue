<!--
 * @file PlaylistPage.vue
 * @description 播放列表页面，显示播放列表中的视频
 * @created 2025-04-08
 * @last-modified 2025-04-08
 -->

<template>
  <div class="playlist-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <n-result status="error" title="加载失败" :description="error">
        <template #footer>
          <n-button @click="loadPlaylist" type="primary">重试</n-button>
          <n-button @click="$router.push('/')" class="ml-2">返回首页</n-button>
        </template>
      </n-result>
    </div>

    <!-- 播放列表内容 -->
    <template v-else>
      <div class="playlist-header">
        <div class="playlist-thumbnail">
          <img :src="playlist.thumbnailUrl" alt="播放列表缩略图" />
          <div class="playlist-count">
            <n-icon>
              <ListOutline />
            </n-icon>
            {{ playlist.videoCount }}个视频
          </div>
        </div>

        <div class="playlist-info">
          <div class="playlist-title-container">
            <h1 class="playlist-title">{{ playlist.title }}</h1>
            <n-tag v-if="playlist.visibility !== 'public'" size="small"
              :type="playlist.visibility === 'private' ? 'error' : 'warning'">
              {{ playlist.visibility === 'private' ? '私密' : '不公开' }}
            </n-tag>
          </div>

          <p v-if="playlist.description" class="playlist-description">{{ playlist.description }}</p>

          <div class="playlist-meta">
            <div class="channel-info" @click="navigateToChannel">
              <n-avatar round size="small" :src="channelAvatar" />
              <span class="channel-name">{{ channelName }}</span>
            </div>

            <div class="playlist-stats">
              <span class="update-time">{{ formatDate(playlist.updatedAt) }}更新</span>
              <span class="divider">•</span>
              <span class="video-count">{{ playlist.videoCount }}个视频</span>
            </div>
          </div>

          <div class="playlist-actions">
            <n-button-group>
              <n-button type="primary" @click="playAll">
                <template #icon>
                  <n-icon>
                    <PlayOutline />
                  </n-icon>
                </template>
                播放全部
              </n-button>
              <n-button v-if="isOwner" @click="showEditModal = true">
                <template #icon>
                  <n-icon>
                    <PencilOutline />
                  </n-icon>
                </template>
                编辑
              </n-button>
              <n-button v-if="!isOwner" @click="savePlaylist">
                <template #icon>
                  <n-icon>
                    <BookmarkOutline />
                  </n-icon>
                </template>
                收藏
              </n-button>
            </n-button-group>
          </div>
        </div>
      </div>

      <!-- 视频列表 -->
      <div class="videos-container">
        <h2 class="section-title">视频列表</h2>

        <div v-if="loadingVideos" class="loading-videos">
          <n-spin size="medium" />
        </div>

        <div v-else-if="videos.length === 0" class="empty-videos">
          <n-empty description="该播放列表没有视频" />
        </div>

        <div v-else class="video-list">
          <div v-for="(video, index) in videos" :key="video.id" class="video-item" @click="playVideo(video)">
            <div class="video-index">{{ index + 1 }}</div>
            <div class="video-thumbnail">
              <img :src="video.thumbnailUrl" alt="视频缩略图" />
              <div class="video-duration">{{ formatDuration(video.duration) }}</div>
            </div>
            <div class="video-details">
              <h3 class="video-title">{{ video.title }}</h3>
              <div class="video-meta">
                <span class="video-author">{{ video.author.nickname }}</span>
                <span class="divider">•</span>
                <span class="video-views">{{ formatNumber(video.views) }}次观看</span>
              </div>
            </div>
            <div v-if="isOwner" class="video-actions">
              <n-button quaternary circle @click.stop="removeVideo(video)">
                <template #icon>
                  <n-icon>
                    <CloseOutline />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMoreVideos && !loadingVideos" class="load-more">
          <n-button @click="loadMoreVideos" :loading="loadingMoreVideos">加载更多</n-button>
        </div>
      </div>
    </template>

    <!-- 编辑播放列表弹窗 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑播放列表" style="width: 500px;">
      <n-form ref="editPlaylistFormRef" :model="editForm" :rules="formRules">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="editForm.title" placeholder="请输入播放列表标题" />
        </n-form-item>

        <n-form-item label="描述" path="description">
          <n-input type="textarea" v-model:value="editForm.description" placeholder="请输入播放列表描述" rows="3" />
        </n-form-item>

        <n-form-item label="可见性" path="visibility">
          <n-select v-model:value="editForm.visibility" :options="visibilityOptions" />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" @click="submitEdit" :loading="submitting">保存</n-button>
          <n-button class="ml-2" @click="showEditModal = false">取消</n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    NButton,
    NButtonGroup,
    NSpin,
    NEmpty,
    NIcon,
    NAvatar,
    NTag,
    NModal,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NResult,
    useMessage
  } from 'naive-ui';
  import {
    PlayOutline,
    ListOutline,
    BookmarkOutline,
    PencilOutline,
    CloseOutline
  } from '@vicons/ionicons5';
  import { useUserStore } from '@/stores/user';
  import { useToast } from '@/composables/useToast';
  import type { ChannelPlaylist, ChannelVideo } from '@/types/channel';
  import dayjs from 'dayjs';
  import { getPlaylistById, getPlaylistVideos, updatePlaylist, removeVideoFromPlaylist } from '@/services/playlist';
  import { getChannelById } from '@/services/channel';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const toast = useToast();
  const message = useMessage();

  // 基础状态
  const playlistId = ref(route.params.id as string);
  const loading = ref(true);
  const error = ref('');
  const playlist = ref<ChannelPlaylist & { userId?: string }>({} as ChannelPlaylist & { userId?: string });
  const channelId = ref('');
  const channelName = ref('');
  const channelAvatar = ref('');

  // 视频列表状态
  const videos = ref<any[]>([]); // 使用any临时解决类型问题
  const loadingVideos = ref(false);
  const loadingMoreVideos = ref(false);
  const hasMoreVideos = ref(false);
  const page = ref(1);
  const pageSize = ref(10);

  // 编辑状态
  const showEditModal = ref(false);
  const submitting = ref(false);
  const editForm = ref({
    title: '',
    description: '',
    visibility: 'public' as 'public' | 'private' | 'unlisted'
  });

  // 表单规则
  const formRules = {
    title: [
      { required: true, message: '请输入播放列表标题', trigger: 'blur' },
      { min: 2, max: 50, message: '标题长度必须在2-50个字符之间', trigger: 'blur' }
    ]
  };

  // 可见性选项
  const visibilityOptions = [
    { label: '公开', value: 'public' },
    { label: '私密', value: 'private' },
    { label: '不公开', value: 'unlisted' }
  ];

  // 计算属性
  const isOwner = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser?.id === playlist.value.userId;
  });

  // 加载播放列表
  async function loadPlaylist() {
    loading.value = true;
    error.value = '';

    try {
      // 调用API加载播放列表
      const playlistData = await getPlaylistById(playlistId.value);
      playlist.value = playlistData;

      // 加载频道信息
      const channelData = await getChannelById(playlistData.channelId);
      channelId.value = channelData.id;
      channelName.value = channelData.name;
      channelAvatar.value = channelData.avatarUrl;

      // 加载视频
      await loadVideos();
    } catch (err) {
      console.error('加载播放列表失败:', err);
      error.value = '无法加载播放列表，请稍后重试';
    } finally {
      loading.value = false;
    }
  }

  // 加载视频
  async function loadVideos(loadMore = false) {
    if (!loadMore) {
      loadingVideos.value = true;
      page.value = 1;
    } else {
      loadingMoreVideos.value = true;
    }

    try {
      // 调用API加载视频
      const response = await getPlaylistVideos(playlistId.value, page.value, pageSize.value);

      if (loadMore) {
        videos.value = [...videos.value, ...response.videos];
      } else {
        videos.value = response.videos;
      }

      hasMoreVideos.value = response.hasMore;

      if (loadMore && response.hasMore) {
        page.value++;
      }
    } catch (err) {
      console.error('加载视频失败:', err);
      toast.error('无法加载视频，请稍后重试');
    } finally {
      loadingVideos.value = false;
      loadingMoreVideos.value = false;
    }
  }

  // 加载更多视频
  function loadMoreVideos() {
    loadVideos(true);
  }

  // 播放视频
  function playVideo(video: ChannelVideo) {
    router.push(`/video/${video.id}`);
  }

  // 播放全部
  function playAll() {
    if (videos.value.length > 0) {
      router.push(`/video/${videos.value[0].id}?playlist=${playlistId.value}`);
    } else {
      toast.warning('没有可播放的视频');
    }
  }

  // 保存播放列表
  function savePlaylist() {
    if (!userStore.isLoggedIn) {
      toast.warning('请先登录');
      router.push('/auth/login');
      return;
    }

    toast.success('播放列表已保存');
  }

  // 移除视频
  async function removeVideo(video: ChannelVideo) {
    try {
      await removeVideoFromPlaylist(playlistId.value, video.id);
      const index = videos.value.findIndex(v => v.id === video.id);
      if (index !== -1) {
        videos.value.splice(index, 1);
        playlist.value.videoCount--;
        toast.success('视频已从播放列表中移除');
      }
    } catch (err) {
      console.error('从播放列表中移除视频失败:', err);
      toast.error('移除失败，请稍后重试');
    }
  }

  // 导航到频道
  function navigateToChannel() {
    router.push(`/channel/${channelId.value}`);
  }

  // 提交编辑
  async function submitEdit() {
    if (!editForm.value.title) {
      toast.warning('请输入播放列表标题');
      return;
    }

    submitting.value = true;

    try {
      // 调用API更新播放列表
      const updatedPlaylist = await updatePlaylist(playlistId.value, {
        title: editForm.value.title,
        description: editForm.value.description,
        visibility: editForm.value.visibility
      });

      // 更新本地数据
      playlist.value = {
        ...playlist.value,
        ...updatedPlaylist
      };

      showEditModal.value = false;
      toast.success('播放列表已更新');
    } catch (err) {
      console.error('更新播放列表失败:', err);
      toast.error('更新失败，请稍后重试');
    } finally {
      submitting.value = false;
    }
  }

  // 格式化时长
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 格式化日期
  function formatDate(date: string): string {
    return dayjs(date).format('YYYY年MM月DD日');
  }

  // 格式化数字
  function formatNumber(num: number): string {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  }

  // 初始化
  onMounted(() => {
    loadPlaylist();

    // 初始化编辑表单
    editForm.value = {
      title: playlist.value.title || '',
      description: playlist.value.description || '',
      visibility: playlist.value.visibility || 'public'
    };
  });
</script>

<style scoped>
  .playlist-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .loading-container,
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    width: 100%;
  }

  /* 播放列表头部 */
  .playlist-header {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    padding: 24px;
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
  }

  .playlist-thumbnail {
    width: 280px;
    flex-shrink: 0;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .playlist-thumbnail img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .playlist-count {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .playlist-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .playlist-title-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .playlist-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);
  }

  .playlist-description {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin-bottom: 16px;
    white-space: pre-line;
    line-height: 1.5;
  }

  .playlist-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    align-items: center;
  }

  .channel-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .channel-name {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 500;
  }

  .playlist-stats {
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  .divider {
    margin: 0 8px;
  }

  .playlist-actions {
    margin-top: auto;
  }

  /* 视频列表 */
  .videos-container {
    margin-top: 16px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  .loading-videos,
  .empty-videos {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .video-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .video-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .video-item:hover {
    background-color: var(--bg-color-secondary);
  }

  .video-index {
    width: 24px;
    text-align: center;
    font-size: 14px;
    color: var(--text-color-secondary);
    font-weight: 500;
  }

  .video-thumbnail {
    width: 160px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .video-thumbnail img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 11px;
  }

  .video-details {
    flex: 1;
    overflow: hidden;
  }

  .video-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 6px;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .video-meta {
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  .video-actions {
    flex-shrink: 0;
  }

  /* 加载更多 */
  .load-more {
    display: flex;
    justify-content: center;
    margin: 24px 0;
  }

  /* 辅助类 */
  .ml-2 {
    margin-left: 8px;
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .playlist-header {
      flex-direction: column;
      gap: 16px;
    }

    .playlist-thumbnail {
      width: 100%;
    }

    .playlist-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .video-item {
      flex-wrap: wrap;
    }

    .video-index {
      display: none;
    }

    .video-thumbnail {
      width: 120px;
    }

    .video-actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
  }
</style>