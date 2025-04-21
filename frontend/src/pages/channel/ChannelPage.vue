<!--
 * @file ChannelPage.vue
 * @description 用户频道页面，展示用户视频内容和频道信息
 * @created 2024-04-06
 * @last-modified 2025-04-08
 -->

<template>
  <div class="channel-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <n-result status="error" title="加载失败" :description="error">
        <template #footer>
          <n-button @click="loadChannel" type="primary">重试</n-button>
          <n-button @click="$router.push('/')" class="ml-2">返回首页</n-button>
        </template>
      </n-result>
    </div>

    <!-- 频道内容 -->
    <template v-else>
      <!-- 频道头部 -->
      <div class="channel-header">
        <div class="channel-cover" :style="{ backgroundImage: `url(${channel.coverUrl || defaultCover})` }">
          <div class="channel-actions">
            <n-button v-if="isOwner" @click="handleEditChannel" type="primary" ghost>
              <template #icon>
                <n-icon>
                  <PencilOutline />
                </n-icon>
              </template>
              编辑频道
            </n-button>
          </div>
        </div>

        <div class="channel-info">
          <div class="channel-avatar">
            <n-avatar round size="large" :src="channel.avatarUrl || defaultAvatar" />
          </div>

          <div class="channel-details">
            <h1 class="channel-name">{{ channel.name }}</h1>
            <p class="channel-handle">@{{ channel.handle }}</p>
            <div class="channel-stats">
              <div class="stat-item">
                <span class="stat-value">{{ formatNumber(channel.videoCount) }}</span>
                <span class="stat-label">视频</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ formatNumber(channel.subscriberCount) }}</span>
                <span class="stat-label">订阅者</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ formatNumber(channel.totalViews) }}</span>
                <span class="stat-label">总观看量</span>
              </div>
            </div>
          </div>

          <div class="channel-actions-desktop">
            <n-button v-if="!isOwner" @click="handleSubscribe" :type="channel.isSubscribed ? 'default' : 'primary'"
              :ghost="channel.isSubscribed">
              {{ channel.isSubscribed ? '已订阅' : '订阅' }}
            </n-button>
            <n-button v-if="isOwner" @click="handleUploadVideo" type="primary">
              <template #icon>
                <n-icon>
                  <CloudUploadOutline />
                </n-icon>
              </template>
              上传视频
            </n-button>
          </div>
        </div>
      </div>

      <!-- 频道导航 -->
      <div class="channel-tabs">
        <n-tabs v-model:value="activeTab" type="line" animated>
          <n-tab-pane name="videos" tab="视频">
            <div class="tab-content">
              <!-- 过滤器 -->
              <div class="filter-bar">
                <n-select v-model:value="sort" :options="sortOptions" size="small" class="sort-select" />
                <n-input-group size="small" class="search-input">
                  <n-input v-model:value="searchQuery" placeholder="在此频道中搜索" />
                  <n-button type="primary" @click="handleSearch">
                    <template #icon>
                      <n-icon>
                        <SearchOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-input-group>
              </div>

              <!-- 视频列表 -->
              <div v-if="loadingVideos" class="loading-container">
                <n-spin size="medium" />
              </div>
              <div v-else-if="videos.length === 0" class="empty-container">
                <n-empty description="没有找到视频">
                  <template #extra>
                    <n-button v-if="isOwner" @click="handleUploadVideo" type="primary">上传视频</n-button>
                  </template>
                </n-empty>
              </div>
              <div v-else class="video-grid">
                <VideoCardComponent v-for="video in videos" :key="video.id" :video="video"
                  @click="handleVideoClick(video)" />
              </div>

              <!-- 加载更多 -->
              <div v-if="videosHasMore && !loadingVideos" class="load-more">
                <n-button @click="loadMoreVideos" :loading="loadingMoreVideos">加载更多</n-button>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="about" tab="简介">
            <div class="about-content">
              <div class="about-section">
                <h3 class="section-title">频道简介</h3>
                <p class="section-content">{{ channel.description || '暂无频道简介' }}</p>
              </div>

              <div class="about-section">
                <h3 class="section-title">创建于</h3>
                <p class="section-content">{{ formatDate(channel.createdAt, 'YYYY年MM月DD日') }}</p>
              </div>

              <div class="about-section">
                <h3 class="section-title">所在地区</h3>
                <p class="section-content">{{ channel.location || '未设置' }}</p>
              </div>

              <div class="about-section">
                <h3 class="section-title">社交链接</h3>
                <div v-if="channel.socialLinks && channel.socialLinks.length > 0" class="social-links">
                  <a v-for="link in channel.socialLinks" :key="link.platform" :href="link.url" target="_blank"
                    class="social-link">
                    <n-icon>
                      <component :is="getSocialIcon(link.platform)" />
                    </n-icon>
                    <span>{{ link.platform }}</span>
                  </a>
                </div>
                <p v-else class="section-content">暂无社交链接</p>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="playlists" tab="播放列表">
            <div class="tab-content">
              <div v-if="loadingPlaylists" class="loading-container">
                <n-spin size="medium" />
              </div>
              <div v-else-if="playlists.length === 0" class="empty-container">
                <n-empty description="没有找到播放列表">
                  <template #extra>
                    <n-button v-if="isOwner" @click="handleCreatePlaylist" type="primary">创建播放列表</n-button>
                  </template>
                </n-empty>
              </div>
              <div v-else class="playlist-grid">
                <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card"
                  @click="navigateToPlaylist(playlist.id)">
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
                    <h3 class="playlist-title">{{ playlist.title }}</h3>
                    <p class="playlist-meta">{{ formatDate(playlist.updatedAt) }}更新</p>
                  </div>
                </div>
              </div>

              <!-- 加载更多播放列表 -->
              <div v-if="playlistsHasMore && !loadingPlaylists" class="load-more">
                <n-button @click="loadMorePlaylists" :loading="loadingMorePlaylists">加载更多</n-button>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </template>

    <!-- 创建播放列表弹窗 -->
    <n-modal v-model:show="showCreatePlaylistModal" preset="card" title="创建播放列表" style="width: 500px;">
      <n-form ref="createPlaylistFormRef" :model="playlistForm" :rules="playlistRules">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="playlistForm.title" placeholder="请输入播放列表标题" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input type="textarea" v-model:value="playlistForm.description" placeholder="请输入播放列表描述" />
        </n-form-item>
        <n-form-item label="可见性" path="visibility">
          <n-select v-model:value="playlistForm.visibility" :options="visibilityOptions" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="submitCreatePlaylist" :loading="creatingPlaylist">创建播放列表</n-button>
          <n-button class="ml-2" @click="showCreatePlaylistModal = false">取消</n-button>
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 编辑频道弹窗 -->
    <n-modal v-model:show="showEditChannelModal" preset="card" title="编辑频道" style="width: 600px;">
      <n-form ref="editChannelFormRef" :model="channelForm" :rules="channelRules">
        <n-form-item label="频道名称" path="name">
          <n-input v-model:value="channelForm.name" placeholder="请输入频道名称" />
        </n-form-item>
        <n-form-item label="频道标识" path="handle">
          <n-input v-model:value="channelForm.handle" placeholder="请输入频道标识" />
        </n-form-item>
        <n-form-item label="频道简介" path="description">
          <n-input type="textarea" v-model:value="channelForm.description" placeholder="请输入频道简介" rows="3" />
        </n-form-item>
        <n-form-item label="所在地区" path="location">
          <n-input v-model:value="channelForm.location" placeholder="请输入所在地区" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="submitEditChannel" :loading="updatingChannel">保存修改</n-button>
          <n-button class="ml-2" @click="showEditChannelModal = false">取消</n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    NAvatar,
    NButton,
    NIcon,
    NEmpty,
    NSpin,
    NTabs,
    NTabPane,
    NSelect,
    NInputGroup,
    NInput,
    NResult,
    NModal,
    NForm,
    NFormItem,
    useMessage
  } from 'naive-ui';
  import {
    PencilOutline,
    CloudUploadOutline,
    SearchOutline,
    ListOutline,
    LogoGithub,
    LogoTwitter,
    LogoYoutube,
    LogoFacebook,
    LogoInstagram,
    LogoLinkedin,
    LogoTwitch,
  } from '@vicons/ionicons5';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import { useUserStore } from '@/stores/user';
  import { useToast } from '@/composables/useToast';
  import dayjs from 'dayjs';
  import {
    getChannelById,
    getChannelVideos,
    getChannelPlaylists,
    subscribeChannel,
    unsubscribeChannel,
    updateChannel,
    createPlaylist
  } from '@/services/channel';
  import type {
    Channel,
    ChannelVideo,
    ChannelPlaylist,
    CreatePlaylistRequest,
    UpdateChannelRequest
  } from '@/types/channel';

  // 组合式API
  const toast = useToast();
  const message = useMessage();

  // 路由
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  // 基础状态
  const channelId = ref(route.params.id as string);
  const activeTab = ref('videos');
  const loading = ref(true);
  const error = ref('');
  const channel = ref<Channel>({} as Channel);

  // 视频列表状态
  const videos = ref<ChannelVideo[]>([]);
  const loadingVideos = ref(false);
  const loadingMoreVideos = ref(false);
  const videosPage = ref(1);
  const videosLimit = ref(12);
  const videosHasMore = ref(false);
  const sort = ref('newest');
  const searchQuery = ref('');

  // 播放列表状态
  const playlists = ref<ChannelPlaylist[]>([]);
  const loadingPlaylists = ref(false);
  const loadingMorePlaylists = ref(false);
  const playlistsPage = ref(1);
  const playlistsLimit = ref(8);
  const playlistsHasMore = ref(false);

  // 创建播放列表状态
  const showCreatePlaylistModal = ref(false);
  const creatingPlaylist = ref(false);
  const playlistForm = ref<CreatePlaylistRequest>({
    title: '',
    description: '',
    visibility: 'public'
  });

  // 编辑频道状态
  const showEditChannelModal = ref(false);
  const updatingChannel = ref(false);
  const channelForm = ref<UpdateChannelRequest>({
    name: '',
    handle: '',
    description: '',
    location: ''
  });

  // 排序选项
  const sortOptions = [
    { label: '最新上传', value: 'newest' },
    { label: '最多观看', value: 'popular' },
    { label: '最早上传', value: 'oldest' }
  ];

  // 可见性选项
  const visibilityOptions = [
    { label: '公开', value: 'public' },
    { label: '私密', value: 'private' },
    { label: '不公开', value: 'unlisted' }
  ];

  // 表单验证规则
  const playlistRules = {
    title: [
      { required: true, message: '请输入播放列表标题', trigger: 'blur' },
      { min: 2, max: 50, message: '标题长度应在2-50个字符之间', trigger: 'blur' }
    ]
  };

  const channelRules = {
    name: [
      { required: true, message: '请输入频道名称', trigger: 'blur' },
      { min: 2, max: 30, message: '频道名称应在2-30个字符之间', trigger: 'blur' }
    ],
    handle: [
      { required: true, message: '请输入频道标识', trigger: 'blur' },
      { min: 3, max: 20, message: '频道标识应在3-20个字符之间', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '频道标识只能包含字母、数字和下划线', trigger: 'blur' }
    ]
  };

  // 默认图片
  const defaultAvatar = 'https://api.dicebear.com/7.x/initials/svg?seed=AV';
  const defaultCover = 'https://picsum.photos/1200/300?blur=4';

  // 计算属性
  const isOwner = computed(() => {
    return userStore.isAuthenticated && userStore.user?.id === channel.value.userId;
  });

  // 加载频道信息
  async function loadChannel() {
    loading.value = true;
    error.value = '';

    try {
      channel.value = await getChannelById(channelId.value);

      // 并行加载视频和播放列表
      await Promise.all([
        loadVideos(),
        loadPlaylists()
      ]);
    } catch (err) {
      console.error('加载频道失败:', err);
      error.value = '无法加载频道信息，请稍后重试';
    } finally {
      loading.value = false;
    }
  }

  // 加载频道视频
  async function loadVideos(replaceExisting = true) {
    if (replaceExisting) {
      loadingVideos.value = true;
      videosPage.value = 1;
    } else {
      loadingMoreVideos.value = true;
    }

    try {
      const response = await getChannelVideos({
        channelId: channelId.value,
        page: videosPage.value,
        limit: videosLimit.value,
        sort: sort.value,
        search: searchQuery.value
      });

      if (replaceExisting) {
        videos.value = response.videos;
      } else {
        videos.value = [...videos.value, ...response.videos];
      }

      videosHasMore.value = response.hasMore;
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
    videosPage.value++;
    loadVideos(false);
  }

  // 加载频道播放列表
  async function loadPlaylists(replaceExisting = true) {
    if (replaceExisting) {
      loadingPlaylists.value = true;
      playlistsPage.value = 1;
    } else {
      loadingMorePlaylists.value = true;
    }

    try {
      const response = await getChannelPlaylists(
        channelId.value,
        playlistsPage.value,
        playlistsLimit.value
      );

      if (replaceExisting) {
        playlists.value = response.playlists;
      } else {
        playlists.value = [...playlists.value, ...response.playlists];
      }

      playlistsHasMore.value = response.hasMore;
    } catch (err) {
      console.error('加载播放列表失败:', err);
      toast.error('无法加载播放列表，请稍后重试');
    } finally {
      loadingPlaylists.value = false;
      loadingMorePlaylists.value = false;
    }
  }

  // 加载更多播放列表
  function loadMorePlaylists() {
    playlistsPage.value++;
    loadPlaylists(false);
  }

  // 处理搜索
  function handleSearch() {
    loadVideos();
  }

  // 处理视频点击
  function handleVideoClick(video: ChannelVideo) {
    router.push(`/video/${video.id}`);
  }

  // 跳转到播放列表
  function navigateToPlaylist(playlistId: string) {
    router.push(`/playlist/${playlistId}`);
  }

  // 处理上传视频
  function handleUploadVideo() {
    router.push('/video/upload');
  }

  // 处理订阅/取消订阅
  async function handleSubscribe() {
    if (!userStore.isAuthenticated) {
      toast.warning('请先登录');
      router.push('/auth/login');
      return;
    }

    try {
      if (channel.value.isSubscribed) {
        await unsubscribeChannel(channelId.value);
        channel.value.isSubscribed = false;
        channel.value.subscriberCount--;
        toast.success('已取消订阅');
      } else {
        await subscribeChannel(channelId.value);
        channel.value.isSubscribed = true;
        channel.value.subscriberCount++;
        toast.success('订阅成功');
      }
    } catch (err) {
      console.error('订阅操作失败:', err);
      toast.error('操作失败，请稍后重试');
    }
  }

  // 处理创建播放列表
  function handleCreatePlaylist() {
    showCreatePlaylistModal.value = true;
    playlistForm.value = {
      title: '',
      description: '',
      visibility: 'public'
    };
  }

  // 提交创建播放列表
  async function submitCreatePlaylist() {
    if (!playlistForm.value.title) {
      toast.warning('请输入播放列表标题');
      return;
    }

    creatingPlaylist.value = true;

    try {
      const newPlaylist = await createPlaylist(channelId.value, playlistForm.value);
      playlists.value.unshift(newPlaylist);
      showCreatePlaylistModal.value = false;
      toast.success('播放列表创建成功');
    } catch (err) {
      console.error('创建播放列表失败:', err);
      toast.error('创建播放列表失败，请稍后重试');
    } finally {
      creatingPlaylist.value = false;
    }
  }

  // 处理编辑频道
  function handleEditChannel() {
    showEditChannelModal.value = true;
    channelForm.value = {
      name: channel.value.name,
      handle: channel.value.handle,
      description: channel.value.description,
      location: channel.value.location
    };
  }

  // 提交编辑频道
  async function submitEditChannel() {
    updatingChannel.value = true;

    try {
      const updatedChannel = await updateChannel(channelId.value, channelForm.value);
      // 更新当前状态
      channel.value = {
        ...channel.value,
        ...updatedChannel
      };
      showEditChannelModal.value = false;
      toast.success('频道更新成功');
    } catch (err) {
      console.error('更新频道失败:', err);
      toast.error('更新频道失败，请稍后重试');
    } finally {
      updatingChannel.value = false;
    }
  }

  // 格式化数字
  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  }

  // 格式化日期
  function formatDate(date: string, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).format(format);
  }

  // 获取社交平台图标
  function getSocialIcon(platform: string) {
    const platformMap: Record<string, any> = {
      'GitHub': LogoGithub,
      'Twitter': LogoTwitter,
      'Youtube': LogoYoutube,
      'Facebook': LogoFacebook,
      'Instagram': LogoInstagram,
      'LinkedIn': LogoLinkedin,
      'Twitch': LogoTwitch
    };

    return platformMap[platform] || LogoGithub;
  }

  // 监听排序变化
  watch(sort, () => {
    loadVideos();
  });

  // 监听路由参数变化，重新加载数据
  watch(() => route.params.id, (newId) => {
    if (newId && newId !== channelId.value) {
      channelId.value = newId as string;
      loadChannel();
    }
  });

  // 初始加载
  onMounted(() => {
    loadChannel();
  });
</script>

<style scoped>
  .channel-page {
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

  /* 频道头部 */
  .channel-header {
    margin-bottom: 24px;
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
    overflow: hidden;
  }

  .channel-cover {
    height: 180px;
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .channel-actions {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .channel-info {
    display: flex;
    padding: 16px;
    position: relative;
  }

  .channel-avatar {
    margin-right: 16px;
    margin-top: -50px;
  }

  .channel-avatar :deep(.n-avatar) {
    width: 80px;
    height: 80px;
    border: 4px solid var(--bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .channel-details {
    flex: 1;
  }

  .channel-name {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 4px;
    color: var(--text-color);
    display: flex;
    align-items: center;
  }

  .channel-handle {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin: 0 0 12px;
  }

  .channel-stats {
    display: flex;
    gap: 24px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-weight: 600;
    font-size: 16px;
    color: var(--text-color);
  }

  .stat-label {
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  .channel-actions-desktop {
    display: flex;
    align-items: center;
  }

  /* 频道标签页 */
  .channel-tabs {
    margin-top: 8px;
  }

  .tab-content {
    padding: 16px 0;
  }

  /* 过滤栏 */
  .filter-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 16px;
  }

  .sort-select {
    width: 150px;
  }

  .search-input {
    width: 300px;
  }

  /* 视频网格 */
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }

  /* 播放列表网格 */
  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .playlist-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--bg-color-secondary);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .playlist-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .playlist-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
  }

  .playlist-thumbnail img {
    width: 100%;
    height: 100%;
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
    padding: 12px;
  }

  .playlist-title {
    font-size: 16px;
    margin: 0 0 4px;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .playlist-meta {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin: 0;
  }

  /* 关于标签页 */
  .about-content {
    max-width: 720px;
  }

  .about-section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-color);
  }

  .section-content {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-color-secondary);
    white-space: pre-line;
  }

  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 4px;
    background-color: var(--bg-color);
    color: var(--text-color);
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .social-link:hover {
    background-color: var(--hover-color);
  }

  /* 加载更多 */
  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 32px;
  }

  /* 空状态 */
  .empty-container {
    padding: 48px 0;
  }

  /* 辅助类 */
  .ml-2 {
    margin-left: 8px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .channel-info {
      flex-direction: column;
    }

    .channel-avatar {
      margin-top: -30px;
      margin-bottom: 12px;
    }

    .channel-actions-desktop {
      margin-top: 16px;
    }

    .channel-stats {
      margin-top: 12px;
    }

    .filter-bar {
      flex-direction: column;
    }

    .search-input {
      width: 100%;
    }

    .sort-select {
      width: 100%;
    }

    .video-grid,
    .playlist-grid {
      grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }
  }
</style>