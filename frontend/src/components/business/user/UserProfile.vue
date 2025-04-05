/**
* @file UserProfile.vue
* @description 用户资料业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

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
    padding: 2rem;
  }

  .profile-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
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
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 60px 60px;
  }

  .user-info {
    flex: 1;
  }

  .username {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  .bio {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .stats {
    display: flex;
    gap: 2rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-item .value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .stat-item .label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .profile-actions {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  @media (max-width: 768px) {
    .user-profile {
      padding: 1rem;
    }

    .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .stats {
      justify-content: center;
    }
  }
</style>