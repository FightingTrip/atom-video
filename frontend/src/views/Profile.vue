<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="cover-photo">
        <img :src="user.coverPhoto" alt="封面照片">
      </div>
      <div class="profile-info">
        <img :src="user.avatar" :alt="user.username" class="avatar">
        <div class="user-details">
          <h1 class="username">{{ user.username }}</h1>
          <p class="bio">{{ user.bio }}</p>
          <div class="stats">
            <div class="stat">
              <span class="count">{{ user.subscribers }}</span>
              <span class="label">订阅者</span>
            </div>
            <div class="stat">
              <span class="count">{{ user.videos }}</span>
              <span class="label">视频</span>
            </div>
            <div class="stat">
              <span class="count">{{ user.views }}</span>
              <span class="label">总观看</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="content-section">
      <div v-if="currentTab === 'videos'" class="videos-grid">
        <VideoCard 
          v-for="video in userVideos" 
          :key="video.id" 
          :video="video" 
        />
      </div>
      <div v-else-if="currentTab === 'playlists'" class="playlists-grid">
        <!-- 播放列表内容 -->
      </div>
      <div v-else-if="currentTab === 'about'" class="about-section">
        <!-- 关于内容 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VideoCard from '@/components/VideoCard.vue';

const currentTab = ref('videos');

const tabs = [
  { id: 'videos', label: '视频' },
  { id: 'playlists', label: '播放列表' },
  { id: 'about', label: '关于' }
];

// 模拟数据
const user = {
  username: '用户名',
  avatar: '/default-avatar.png',
  coverPhoto: '/default-cover.jpg',
  bio: '这是个人简介',
  subscribers: 1000,
  videos: 50,
  views: 100000
};

const userVideos = [
  {
    id: 1,
    title: '示例视频标题',
    thumbnail: '/default-thumbnail.jpg',
    duration: '10:30',
    views: 1000,
    uploadDate: '2024-03-20',
    creator: {
      name: '用户名',
      avatar: '/default-avatar.png'
    }
  }
  // 更多视频...
];
</script>

<style scoped>
.profile-page {
  @apply max-w-7xl mx-auto px-4 py-8;
}

.profile-header {
  @apply relative mb-8;
}

.cover-photo {
  @apply h-48 md:h-64 w-full overflow-hidden rounded-lg;
}

.cover-photo img {
  @apply w-full h-full object-cover;
}

.profile-info {
  @apply flex items-start gap-6 -mt-16 px-4;
}

.avatar {
  @apply w-32 h-32 rounded-full border-4 border-white shadow-lg;
}

.user-details {
  @apply flex-1 pt-16;
}

.username {
  @apply text-2xl font-bold mb-2;
}

.bio {
  @apply text-gray-600 mb-4;
}

.stats {
  @apply flex gap-6;
}

.stat {
  @apply flex flex-col items-center;
}

.count {
  @apply font-semibold text-lg;
}

.label {
  @apply text-sm text-gray-600;
}

.content-tabs {
  @apply flex gap-4 border-b mb-6;
}

.tab {
  @apply px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent;
}

.tab.active {
  @apply text-blue-600 border-blue-600;
}

.videos-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}
</style> 