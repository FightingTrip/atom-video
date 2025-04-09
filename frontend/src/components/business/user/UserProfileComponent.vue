/**
* @file UserProfileComponent.vue
* @description 用户资料展示组件 - 业务组件，用于展示用户资料信息，不是页面组件
* @author Atom Video Team
* @date 2025-04-08
*/

<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-cover" :style="{ backgroundImage: `url(${userProfile.coverImage})` }">
        <div class="profile-avatar-container">
          <n-avatar :src="userProfile.avatar" size="large" round class="profile-avatar" />
        </div>
      </div>
      <div class="profile-info">
        <h1 class="profile-name">{{ userProfile.nickname }}</h1>
        <p class="profile-username">@{{ userProfile.username }}</p>
        <p class="profile-bio">{{ userProfile.bio || '这个用户很懒，还没有填写个人简介' }}</p>
        <div class="user-stats">
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
          <n-button v-if="isCurrentUser" type="primary" ghost @click="handleEditProfile">
            编辑资料
          </n-button>
          <n-button v-else type="primary" :quaternary="isFollowing" @click="handleToggleFollow">
            {{ isFollowing ? '已关注' : '关注' }}
          </n-button>
        </div>
      </div>
    </div>

    <div class="profile-tabs">
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id" :tab="tab.name">
          <!-- 视频列表 -->
          <div v-if="tab.id === 'videos'" class="videos-tab">
            <n-spin :show="loading" description="加载中..." size="large">
              <n-empty v-if="userVideos.length === 0" description="">
                <template #icon>
                  <div class="empty-icon">📺</div>
                </template>
                <template #description>
                  <p class="empty-text">{{ isCurrentUser ? '你还没有上传任何视频' : '该用户还没有上传任何视频' }}</p>
                </template>
                <template #extra>
                  <n-button v-if="isCurrentUser" type="primary" @click="handleUploadVideo">上传视频</n-button>
                </template>
              </n-empty>
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
                <n-button text @click="loadMoreVideos">加载更多</n-button>
              </div>
            </n-spin>
          </div>

          <!-- 收藏列表 -->
          <div v-if="tab.id === 'favorites'" class="favorites-tab">
            <n-spin :show="loading" description="加载中..." size="large">
              <n-empty v-if="favoriteVideos.length === 0" description="">
                <template #icon>
                  <div class="empty-icon">❤️</div>
                </template>
                <template #description>
                  <p class="empty-text">{{ isCurrentUser ? '你还没有收藏任何视频' : '该用户还没有收藏任何视频' }}</p>
                </template>
              </n-empty>
              <div v-else class="video-grid">
                <div v-for="video in favoriteVideos" :key="video.id" class="video-card"
                  @click="handleVideoClick(video)">
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
                <n-button text @click="loadMoreFavorites">加载更多</n-button>
              </div>
            </n-spin>
          </div>

          <!-- 关于页面 -->
          <div v-if="tab.id === 'about'" class="about-tab">
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
                <n-tag v-for="(link, index) in userProfile.socialLinks" :key="index" class="social-link"
                  :bordered="false" type="primary">
                  <a :href="link.url" target="_blank" class="social-link-text">
                    {{ link.platform }}
                  </a>
                </n-tag>
              </div>
              <p v-else class="section-content">暂无社交链接</p>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { NButton, NTabs, NTabPane, NEmpty, NSpin, NAvatar, NTag } from 'naive-ui';

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
    width: 100%;
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .profile-header {
    position: relative;
    margin-bottom: var(--spacing-lg);
  }

  .profile-cover {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .profile-avatar-container {
    position: absolute;
    bottom: -40px;
    left: var(--spacing-lg);
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    border: 4px solid var(--card-bg);
    object-fit: cover;
  }

  .profile-info {
    padding: var(--spacing-xl) var(--spacing-lg) var(--spacing-lg);
    margin-top: 20px;
  }

  .profile-name {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-xs) 0;
  }

  .profile-username {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .profile-bio {
    margin-top: 8px;
    margin-bottom: 16px;
    color: var(--text-color);
    line-height: 1.5;
    max-width: 80%;
    background-color: rgba(0, 0, 0, 0.03);
    padding: 8px 12px;
    border-radius: 8px;
  }

  [data-theme="dark"] .profile-bio,
  .dark-mode .profile-bio {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .user-stats {
    display: flex;
    justify-content: flex-start;
    gap: 24px;
    margin: 16px 0;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
  }

  .stat-label {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin-top: 4px;
  }

  .profile-actions {
    margin-bottom: var(--spacing-lg);
  }

  .profile-tabs {
    padding: 0 var(--spacing-lg) var(--spacing-lg);
  }

  .favorites-tab {
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    padding: var(--spacing-lg);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
  }

  .video-card {
    background-color: var(--bg-color-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform var(--transition-normal);
    cursor: pointer;
  }

  .video-card:hover {
    transform: scale(1.05);
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
  }

  .video-thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
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
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
  }

  .video-info {
    padding: var(--spacing-md);
  }

  .video-title {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: var(--spacing-sm);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-color-secondary);
    font-size: var(--text-sm);
  }

  .about-tab {
    padding: var(--spacing-lg) 0;
  }

  .about-section {
    margin-bottom: var(--spacing-xl);
  }

  .section-title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }

  .section-content {
    font-size: var(--text-md);
    color: var(--text-primary);
    line-height: 1.6;
  }

  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .social-link {
    margin-right: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .social-link-text {
    color: inherit;
    text-decoration: none;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
  }

  .empty-text {
    color: var(--text-color-secondary);
    font-size: var(--text-base);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-lg);
  }

  /* 暗色模式特定样式 */
  :root.dark .favorites-tab,
  .dark-mode .favorites-tab {
    background-color: var(--bg-color-dark);
  }

  :root.dark .video-card,
  .dark-mode .video-card {
    background-color: var(--bg-color-darker);
  }

  :root.dark .video-title,
  .dark-mode .video-title {
    color: var(--text-color-dark);
  }

  :root.dark .video-meta,
  .dark-mode .video-meta {
    color: var(--text-color-secondary-dark);
  }

  :root.dark .empty-text,
  .dark-mode .empty-text {
    color: var(--text-color-secondary-dark);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .profile-header {
      margin-bottom: var(--spacing-md);
    }

    .profile-cover {
      height: 150px;
    }

    .profile-avatar-container {
      bottom: -30px;
      left: var(--spacing-md);
    }

    .profile-avatar {
      width: 60px;
      height: 60px;
    }

    .profile-info {
      padding: var(--spacing-lg) var(--spacing-md) var(--spacing-md);
    }

    .profile-name {
      font-size: var(--text-xl);
    }

    .user-stats {
      gap: var(--spacing-lg);
    }

    .favorites-tab {
      padding: var(--spacing-md);
    }

    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-sm);
    }

    .video-title {
      font-size: var(--text-sm);
    }

    .video-meta {
      font-size: var(--text-xs);
    }
  }
</style>