<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-cover" :style="{ backgroundImage: `url(${userProfile.coverImage})` }">
        <div class="profile-avatar-container">
          <img :src="userProfile.avatar" alt="用户头像" class="profile-avatar" />
        </div>
      </div>
      <div class="profile-info">
        <h1 class="profile-name">{{ userProfile.nickname }}</h1>
        <p class="profile-username">@{{ userProfile.username }}</p>
        <p class="profile-bio">{{ userProfile.bio || '这个用户很懒，还没有填写个人简介' }}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-value">{{ userProfile.videoCount }}</span>
            <span class="stat-label">视频</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userProfile.followerCount }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userProfile.followingCount }}</span>
            <span class="stat-label">关注</span>
          </div>
        </div>
        <div class="profile-actions">
          <button v-if="isCurrentUser" class="edit-profile-btn" @click="handleEditProfile">
            编辑资料
          </button>
          <button v-else class="follow-btn" :class="{ 'is-following': isFollowing }" @click="handleToggleFollow">
            {{ isFollowing ? '已关注' : '关注' }}
          </button>
        </div>
      </div>
    </div>

    <div class="profile-tabs">
      <div class="tabs-header">
        <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          {{ tab.name }}
        </button>
      </div>

      <div class="tab-content">
        <!-- 视频列表 -->
        <div v-if="activeTab === 'videos'" class="videos-tab">
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
          </div>
          <div v-else-if="userVideos.length === 0" class="empty-container">
            <div class="empty-icon">📺</div>
            <p class="empty-text">{{ isCurrentUser ? '你还没有上传任何视频' : '该用户还没有上传任何视频' }}</p>
            <button v-if="isCurrentUser" class="upload-btn" @click="handleUploadVideo">上传视频</button>
          </div>
          <div v-else class="video-grid">
            <div v-for="video in userVideos" :key="video.id" class="video-card" @click="handleVideoClick(video)">
              <div class="video-thumbnail">
                <img :src="video.thumbnail" :alt="video.title" />
                <span class="video-duration">{{ formatDuration(video.duration) }}</span>
              </div>
              <div class="video-info">
                <h3 class="video-title">{{ video.title }}</h3>
                <div class="video-meta">
                  <span>{{ formatNumber(video.views) }}次观看</span>
                  <span>•</span>
                  <span>{{ formatDate(video.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hasMoreVideos" class="load-more">
            <button class="load-more-btn" @click="loadMoreVideos">加载更多</button>
          </div>
        </div>

        <!-- 收藏列表 -->
        <div v-if="activeTab === 'favorites'" class="favorites-tab">
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
          </div>
          <div v-else-if="favoriteVideos.length === 0" class="empty-container">
            <div class="empty-icon">❤️</div>
            <p class="empty-text">{{ isCurrentUser ? '你还没有收藏任何视频' : '该用户还没有收藏任何视频' }}</p>
          </div>
          <div v-else class="video-grid">
            <div v-for="video in favoriteVideos" :key="video.id" class="video-card" @click="handleVideoClick(video)">
              <div class="video-thumbnail">
                <img :src="video.thumbnail" :alt="video.title" />
                <span class="video-duration">{{ formatDuration(video.duration) }}</span>
              </div>
              <div class="video-info">
                <h3 class="video-title">{{ video.title }}</h3>
                <div class="video-meta">
                  <span>{{ formatNumber(video.views) }}次观看</span>
                  <span>•</span>
                  <span>{{ formatDate(video.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hasMoreFavorites" class="load-more">
            <button class="load-more-btn" @click="loadMoreFavorites">加载更多</button>
          </div>
        </div>

        <!-- 关于页面 -->
        <div v-if="activeTab === 'about'" class="about-tab">
          <div class="about-section">
            <h3 class="section-title">个人简介</h3>
            <p class="section-content">{{ userProfile.bio || '这个用户很懒，还没有填写个人简介' }}</p>
          </div>
          <div class="about-section">
            <h3 class="section-title">加入时间</h3>
            <p class="section-content">{{ formatJoinDate(userProfile.createdAt) }}</p>
          </div>
          <div class="about-section">
            <h3 class="section-title">社交链接</h3>
            <div v-if="userProfile.socialLinks && userProfile.socialLinks.length > 0" class="social-links">
              <a v-for="(link, index) in userProfile.socialLinks" :key="index" :href="link.url" target="_blank"
                class="social-link">
                {{ link.platform }}
              </a>
            </div>
            <p v-else class="section-content">暂无社交链接</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  // 模拟数据类型
  interface UserProfile {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    coverImage: string;
    bio: string;
    videoCount: number;
    followerCount: number;
    followingCount: number;
    createdAt: string;
    socialLinks: { platform: string; url: string }[];
  }

  interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
  }

  // 路由
  const router = useRouter();
  const route = useRoute();

  // 页面状态
  const loading = ref(false);
  const activeTab = ref('videos');
  const isFollowing = ref(false);
  const userVideos = ref<Video[]>([]);
  const favoriteVideos = ref<Video[]>([]);
  const hasMoreVideos = ref(true);
  const hasMoreFavorites = ref(true);
  const videoPage = ref(1);
  const favoritePage = ref(1);

  // 标签页定义
  const tabs = [
    { id: 'videos', name: '视频' },
    { id: 'favorites', name: '收藏' },
    { id: 'about', name: '关于' }
  ];

  // 模拟用户资料数据
  const userProfile = ref<UserProfile>({
    id: 'user-1',
    username: 'atomvideo',
    nickname: 'Atom Video',
    avatar: 'https://i.pravatar.cc/300?u=atomvideo',
    coverImage: 'https://picsum.photos/1200/300?random=1',
    bio: '热爱编程，分享技术视频和教程。专注于前端和全栈开发，希望能帮助更多人学习编程。',
    videoCount: 28,
    followerCount: 1265,
    followingCount: 42,
    createdAt: '2023-01-15T08:30:00Z',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'Twitter', url: 'https://twitter.com' }
    ]
  });

  // 检查是否是当前登录用户的个人资料
  const isCurrentUser = computed(() => {
    // 这里应该与实际的用户认证系统集成
    // 暂时模拟为true，表示是当前用户的资料
    return true;
  });

  // 格式化数字
  function formatNumber(num: number): string {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  }

  // 格式化时长
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return '今天';
    } else if (diffDays < 30) {
      return `${diffDays}天前`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths}个月前`;
    }
  }

  // 格式化加入日期
  function formatJoinDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }

  // 处理关注/取消关注
  function handleToggleFollow() {
    isFollowing.value = !isFollowing.value;
    if (isFollowing.value) {
      userProfile.value.followerCount++;
    } else {
      userProfile.value.followerCount--;
    }
  }

  // 处理编辑资料
  function handleEditProfile() {
    router.push('/settings/profile');
  }

  // 处理上传视频
  function handleUploadVideo() {
    router.push('/upload');
  }

  // 处理视频点击
  function handleVideoClick(video: Video) {
    router.push(`/video/${video.id}`);
  }

  // 获取用户视频
  async function fetchUserVideos() {
    loading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟数据
      const mockVideos: Video[] = Array(8).fill(0).map((_, index) => ({
        id: `video-${videoPage.value}-${index}`,
        title: `示例视频标题 ${videoPage.value}-${index}`,
        thumbnail: `https://picsum.photos/seed/video${videoPage.value}${index}/400/225`,
        duration: Math.floor(Math.random() * 600),
        views: Math.floor(Math.random() * 100000),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));

      userVideos.value = videoPage.value === 1 ? mockVideos : [...userVideos.value, ...mockVideos];
      hasMoreVideos.value = videoPage.value < 3; // 模拟只有3页数据
    } catch (error) {
      console.error('获取用户视频失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 获取收藏视频
  async function fetchFavoriteVideos() {
    loading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟数据
      const mockVideos: Video[] = Array(8).fill(0).map((_, index) => ({
        id: `favorite-${favoritePage.value}-${index}`,
        title: `收藏视频标题 ${favoritePage.value}-${index}`,
        thumbnail: `https://picsum.photos/seed/favorite${favoritePage.value}${index}/400/225`,
        duration: Math.floor(Math.random() * 600),
        views: Math.floor(Math.random() * 100000),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));

      favoriteVideos.value = favoritePage.value === 1 ? mockVideos : [...favoriteVideos.value, ...mockVideos];
      hasMoreFavorites.value = favoritePage.value < 3; // 模拟只有3页数据
    } catch (error) {
      console.error('获取收藏视频失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 加载更多视频
  function loadMoreVideos() {
    if (!loading.value && hasMoreVideos.value) {
      videoPage.value++;
      fetchUserVideos();
    }
  }

  // 加载更多收藏
  function loadMoreFavorites() {
    if (!loading.value && hasMoreFavorites.value) {
      favoritePage.value++;
      fetchFavoriteVideos();
    }
  }

  // 页面初始化
  onMounted(() => {
    // 获取URL中的用户ID参数
    const userId = route.params.id;

    // 根据ID获取用户资料（这里使用模拟数据）

    // 根据当前标签页加载对应数据
    fetchUserVideos();

    // 检查当前用户是否关注了该用户
    isFollowing.value = false; // 模拟数据
  });
</script>

<style scoped>
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .profile-header {
    margin-bottom: 24px;
  }

  .profile-cover {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
    border-radius: 8px;
    margin-bottom: 60px;
  }

  .profile-avatar-container {
    position: absolute;
    bottom: -50px;
    left: 24px;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid var(--color-bg-surface);
    object-fit: cover;
  }

  .profile-info {
    padding: 0 24px;
  }

  .profile-name {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 4px;
    color: var(--color-text-primary);
  }

  .profile-username {
    font-size: 16px;
    color: var(--color-text-secondary);
    margin: 0 0 16px;
  }

  .profile-bio {
    font-size: 16px;
    line-height: 1.5;
    margin: 0 0 16px;
    color: var(--color-text-primary);
  }

  .profile-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .stat-label {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  .profile-actions {
    margin-bottom: 32px;
  }

  .edit-profile-btn,
  .follow-btn {
    padding: 8px 24px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-profile-btn {
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
  }

  .edit-profile-btn:hover {
    background-color: var(--color-bg-subtle);
  }

  .follow-btn {
    background-color: var(--color-accent-primary);
    border: none;
    color: white;
  }

  .follow-btn:hover {
    opacity: 0.9;
  }

  .follow-btn.is-following {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-primary);
  }

  .profile-tabs {
    margin-bottom: 48px;
  }

  .tabs-header {
    display: flex;
    border-bottom: 1px solid var(--color-border-muted);
    margin-bottom: 24px;
  }

  .tab-button {
    padding: 12px 24px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-button.active {
    color: var(--color-accent-primary);
    border-bottom-color: var(--color-accent-primary);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .video-card {
    cursor: pointer;
    transition: transform 0.2s;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  .video-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  }

  .video-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    display: flex;
    gap: 8px;
    color: var(--color-text-secondary);
    font-size: 14px;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-accent-primary);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
    text-align: center;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }

  .upload-btn {
    padding: 8px 24px;
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  .load-more-btn {
    padding: 8px 24px;
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
  }

  .load-more-btn:hover {
    background-color: var(--color-bg-subtle);
  }

  .about-tab {
    max-width: 800px;
  }

  .about-section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 12px;
  }

  .section-content {
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  .social-links {
    display: flex;
    gap: 16px;
  }

  .social-link {
    color: var(--color-text-link);
    text-decoration: none;
  }

  .social-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .profile-cover {
      height: 150px;
      margin-bottom: 50px;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
    }

    .profile-stats {
      gap: 16px;
    }

    .video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>