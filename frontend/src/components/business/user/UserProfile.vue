/**
* @file UserProfile.vue
* @description 用户资料业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<!--
 * @description 用户资料组件
 * @features
 * - 用户信息展示：头像、用户名、个人简介
 * - 数据统计：视频数、粉丝数、关注数
 * - 头像管理：支持头像上传和更换
 * - 关注功能：支持关注和取消关注
 * - 视频列表：展示用户上传的视频
 * - 响应式布局：适配不同屏幕尺寸
 * - 主题适配：支持亮色和暗色主题
 * @dependencies
 * - naive-ui: UI组件库
 * - @vueuse/core: 实用工具集
 * @props
 * - userId: 用户ID
 * @emits
 * - avatar-update: 头像更新事件
 * - follow-toggle: 关注状态切换事件
 * - video-click: 视频点击事件
 -->

<template>
  <div class="user-profile">
    <!-- 用户基本信息 -->
    <section class="profile-header">
      <div class="avatar-container">
        <Avatar :src="user.avatarUrl" :size="120" />
        <div v-if="isCurrentUser" class="avatar-upload">
          <Button @click="handleAvatarUpload">
            更换头像
          </Button>
        </div>
      </div>
      <div class="user-info">
        <h1 class="username">{{ user.username }}</h1>
        <p class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</p>
        <div class="stats">
          <div class="stat-item">
            <span class="value">{{ user.videoCount }}</span>
            <span class="label">视频</span>
          </div>
          <div class="stat-item">
            <span class="value">{{ user.followerCount }}</span>
            <span class="label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="value">{{ user.followingCount }}</span>
            <span class="label">关注</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 用户操作按钮 -->
    <section class="profile-actions">
      <template v-if="isCurrentUser">
        <Button @click="handleEditProfile">
          编辑资料
        </Button>
      </template>
      <template v-else>
        <Button :type="user.isFollowing ? 'secondary' : 'primary'" @click="handleFollowToggle">
          {{ user.isFollowing ? '取消关注' : '关注' }}
        </Button>
      </template>
    </section>

    <!-- 用户视频列表 -->
    <section class="user-videos">
      <h2 class="section-title">视频列表</h2>
      <VideoGrid :videos="videos" :loading="loading" @video-click="handleVideoClick" />
      <div v-if="hasMore" class="load-more">
        <Button :loading="loading" @click="loadMore">
          加载更多
        </Button>
      </div>
    </section>

    <!-- 加载状态 -->
    <div v-if="loading && !videos.length" class="loading-container">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !error && !videos.length" class="empty-container">
      <EmptyState message="暂无视频" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUser } from '@/composables/useUser';
  import { useVideo } from '@/composables/useVideo';
  import Avatar from '@/components/common/avatar/Avatar.vue';
  import Button from '@/components/common/button/Button.vue';
  import VideoGrid from '@/components/common/video/VideoGrid.vue';
  import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
  import EmptyState from '@/components/common/feedback/EmptyState.vue';
  import type { User, Video } from '@/types';

  const router = useRouter();
  const route = useRoute();

  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);
  const videos = ref<Video[]>([]);
  const currentPage = ref(1);
  const hasMore = ref(true);

  // 组合式函数
  const { fetchUserProfile, updateUserProfile, toggleFollow } = useUser();
  const { fetchUserVideos } = useVideo();

  // 计算属性
  const isCurrentUser = computed(() => {
    return user.value?.id === route.params.id;
  });

  // 方法
  const handleAvatarUpload = () => {
    // TODO: 实现头像上传功能
  };

  const handleEditProfile = () => {
    router.push('/settings/profile');
  };

  const handleFollowToggle = async () => {
    if (!user.value) return;

    try {
      await toggleFollow(user.value.id);
      user.value.isFollowing = !user.value.isFollowing;
      user.value.followerCount += user.value.isFollowing ? 1 : -1;
    } catch (err) {
      error.value = '操作失败';
      console.error('关注/取消关注失败:', err);
    }
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    try {
      loading.value = true;
      error.value = null;
      currentPage.value++;

      const result = await fetchUserVideos({
        userId: user.value?.id,
        page: currentPage.value,
        pageSize: 12,
      });

      videos.value.push(...result);
      hasMore.value = result.length === 12;
    } catch (err) {
      error.value = '加载更多失败';
      console.error('加载更多失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 初始化
  onMounted(async () => {
    try {
      loading.value = true;
      error.value = null;

      // 获取用户信息
      const userId = route.params.id as string;
      user.value = await fetchUserProfile(userId);

      // 获取用户视频
      const result = await fetchUserVideos({
        userId,
        page: 1,
        pageSize: 12,
      });

      videos.value = result;
      hasMore.value = result.length === 12;
    } catch (err) {
      error.value = '加载用户信息失败';
      console.error('加载用户信息失败:', err);
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .user-profile {
    padding: var(--spacing-lg);
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }

  .profile-header {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    background-color: var(--secondary-bg);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .avatar-container {
    position: relative;
  }

  .avatar-upload {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: var(--spacing-sm);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 var(--radius-full) var(--radius-full);
  }

  .user-info {
    flex: 1;
  }

  .username {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
  }

  .bio {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
    line-height: 1.5;
  }

  .stats {
    display: flex;
    gap: var(--spacing-lg);
    background-color: var(--primary-bg);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-item .value {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .stat-item .label {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .profile-actions {
    margin-bottom: var(--spacing-lg);
    background-color: var(--secondary-bg);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .section-title {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }

  .user-videos {
    background-color: var(--secondary-bg);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-lg);
  }

  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    border: 1px solid var(--border-light);
  }

  @media (max-width: 768px) {
    .user-profile {
      padding: var(--spacing-md);
    }

    .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--spacing-md);
    }

    .stats {
      justify-content: center;
    }
  }
</style>