<!--
 * @description 用户个人主页
 * @features
 * - 用户基本信息展示
 * - 用户视频列表
 * - 用户统计数据
 * - 关注/取消关注功能
 -->
<template>
  <div class="profile-page">
    <!-- 个人资料头部 -->
    <div class="profile-header relative">
      <!-- 封面图 -->
      <div class="cover-image h-64 bg-gradient-to-r from-blue-500 to-purple-600"></div>

      <!-- 个人信息卡片 -->
      <div class="profile-card max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <!-- 头像 -->
            <n-avatar :src="user?.avatar" :size="120" round
              class="border-4 border-white dark:border-gray-800 shadow-lg" />

            <!-- 用户信息 -->
            <div class="flex-grow">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold">{{ user?.nickname }}</h1>
                <n-icon v-if="user?.verified" class="text-primary">
                  <CheckmarkCircle />
                </n-icon>
              </div>
              <div class="text-gray-600 dark:text-gray-400 mb-4">@{{ user?.username }}</div>
              <div class="flex items-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <n-icon>
                    <VideocamOutline />
                  </n-icon>
                  <span>{{ formatNumber(stats.videos) }} 个视频</span>
                </div>
                <div class="flex items-center gap-2">
                  <n-icon>
                    <PeopleOutline />
                  </n-icon>
                  <span>{{ formatNumber(stats.followers) }} 位粉丝</span>
                </div>
                <div class="flex items-center gap-2">
                  <n-icon>
                    <HeartOutline />
                  </n-icon>
                  <span>{{ formatNumber(stats.likes) }} 获赞</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3">
              <n-button v-if="isCurrentUser" type="primary" @click="router.push('/settings')">
                编辑资料
              </n-button>
              <n-button v-else type="primary" :ghost="user?.isFollowed" @click="handleFollow">
                {{ user?.isFollowed ? '已关注' : '关注' }}
              </n-button>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="mt-6">
            <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ user?.bio || '这个人很懒，什么都没写~' }}</p>
          </div>

          <!-- 社交链接 -->
          <div v-if="user?.social" class="mt-4 flex gap-4">
            <a v-if="user.social.website" :href="user.social.website" target="_blank"
              class="text-gray-600 hover:text-primary">
              <n-icon>
                <Globe />
              </n-icon>
            </a>
            <a v-if="user.social.github" :href="`https://github.com/${user.social.github}`" target="_blank"
              class="text-gray-600 hover:text-primary">
              <n-icon>
                <LogoGithub />
              </n-icon>
            </a>
            <a v-if="user.social.twitter" :href="`https://twitter.com/${user.social.twitter}`" target="_blank"
              class="text-gray-600 hover:text-primary">
              <n-icon>
                <LogoTwitter />
              </n-icon>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content max-w-6xl mx-auto px-4 py-8">
      <n-tabs type="line" animated>
        <!-- 视频列表 -->
        <n-tab-pane name="videos" tab="视频">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <VideoCard v-for="video in videos" :key="video.id" :video="video" />
          </div>
          <div v-if="!videos.length" class="text-center py-16 text-gray-500">
            暂无视频
          </div>
          <div v-if="hasMore" class="text-center mt-8">
            <n-button :loading="loading" @click="loadMore">
              加载更多
            </n-button>
          </div>
        </n-tab-pane>

        <!-- 喜欢的视频 -->
        <n-tab-pane name="likes" tab="喜欢">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <VideoCard v-for="video in likedVideos" :key="video.id" :video="video" />
          </div>
          <div v-if="!likedVideos.length" class="text-center py-16 text-gray-500">
            暂无喜欢的视频
          </div>
          <div v-if="hasMoreLikes" class="text-center mt-8">
            <n-button :loading="loadingLikes" @click="loadMoreLikes">
              加载更多
            </n-button>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useMessage } from 'naive-ui';
  import {
    NAvatar,
    NButton,
    NTabs,
    NTabPane,
    NIcon
  } from 'naive-ui';
  import {
    CheckmarkCircle,
    VideocamOutline,
    PeopleOutline,
    HeartOutline,
    Globe,
    LogoGithub,
    LogoTwitter
  } from '@vicons/ionicons5';
  import VideoCard from '@/components/video/VideoCard.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useUserStore } from '@/stores/user';
  import type { User, Video } from '@/types';

  const route = useRoute();
  const router = useRouter();
  const message = useMessage();
  const authStore = useAuthStore();
  const userStore = useUserStore();

  // 用户数据
  const user = ref<User | null>(null);
  const stats = ref({
    videos: 0,
    followers: 0,
    likes: 0
  });

  // 视频列表数据
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const hasMore = ref(false);
  const currentPage = ref(1);

  // 喜欢的视频列表数据
  const likedVideos = ref<Video[]>([]);
  const loadingLikes = ref(false);
  const hasMoreLikes = ref(false);
  const currentLikePage = ref(1);

  // 判断是否为当前用户的主页
  const isCurrentUser = computed(() => {
    return authStore.user?.id === route.params.id;
  });

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '亿';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const userId = route.params.id as string;
      const data = await userStore.getUserInfo(userId);
      user.value = data.user;
      stats.value = data.stats;
    } catch (error) {
      message.error('获取用户信息失败');
    }
  };

  // 获取用户视频列表
  const fetchVideos = async (page = 1) => {
    if (loading.value) return;

    try {
      loading.value = true;
      const userId = route.params.id as string;
      const data = await userStore.getUserVideos(userId, page);

      if (page === 1) {
        videos.value = data.videos;
      } else {
        videos.value.push(...data.videos);
      }

      hasMore.value = data.hasMore;
      currentPage.value = page;
    } catch (error) {
      message.error('获取视频列表失败');
    } finally {
      loading.value = false;
    }
  };

  // 获取喜欢的视频列表
  const fetchLikedVideos = async (page = 1) => {
    if (loadingLikes.value) return;

    try {
      loadingLikes.value = true;
      const userId = route.params.id as string;
      const data = await userStore.getUserLikedVideos(userId, page);

      if (page === 1) {
        likedVideos.value = data.videos;
      } else {
        likedVideos.value.push(...data.videos);
      }

      hasMoreLikes.value = data.hasMore;
      currentLikePage.value = page;
    } catch (error) {
      message.error('获取喜欢的视频失败');
    } finally {
      loadingLikes.value = false;
    }
  };

  // 加载更多视频
  const loadMore = () => {
    fetchVideos(currentPage.value + 1);
  };

  // 加载更多喜欢的视频
  const loadMoreLikes = () => {
    fetchLikedVideos(currentLikePage.value + 1);
  };

  // 关注/取消关注
  const handleFollow = async () => {
    if (!authStore.isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      const userId = route.params.id as string;
      const isFollowed = await userStore.toggleFollow(userId);
      if (user.value) {
        user.value.isFollowed = isFollowed;
        stats.value.followers += isFollowed ? 1 : -1;
      }
      message.success(isFollowed ? '关注成功' : '取消关注成功');
    } catch (error) {
      message.error('操作失败');
    }
  };

  onMounted(() => {
    fetchUserInfo();
    fetchVideos();
    fetchLikedVideos();
  });
</script>

<style scoped>
  .profile-page {
    @apply min-h-screen bg-gray-50 dark:bg-gray-900;
  }

  .profile-header {
    @apply bg-white dark:bg-gray-800 shadow-sm;
  }

  .cover-image {
    @apply w-full object-cover;
  }

  .profile-card {
    @apply mb-6;
  }

  .profile-content {
    @apply mt-6;
  }
</style>