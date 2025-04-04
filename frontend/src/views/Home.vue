<template>
  <div class="min-h-screen py-4">
    <!-- 分类标签 -->
    <div class="sticky top-14 z-10 bg-white dark:bg-gray-900 pb-4">
      <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-edges">
        <button v-for="tag in tags" :key="tag.id"
          class="px-4 py-1.5 rounded-full transition-colors whitespace-nowrap text-sm font-medium" :class="[
            selectedTag === tag.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]" @click="selectTag(tag.id)">
          <i v-if="tag.icon" :class="['fas', tag.icon, 'mr-2']"></i>
          {{ tag.name }}
        </button>
      </div>
    </div>

    <!-- 视频网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      <template v-if="loading">
        <VideoCardSkeleton v-for="i in 12" :key="i" />
      </template>
      <template v-else-if="error">
        <div class="col-span-full text-center py-8">
          <n-result status="error" :title="error.message">
            <template #footer>
              <n-button @click="loadVideos(true)">重试</n-button>
            </template>
          </n-result>
        </div>
      </template>
      <template v-else-if="filteredVideos.length === 0">
        <div class="col-span-full text-center py-8">
          <n-empty description="暂无视频">
            <template #extra>
              <n-button @click="selectTag('all')">查看全部</n-button>
            </template>
          </n-empty>
        </div>
      </template>
      <template v-else>
        <VideoCard v-for="video in filteredVideos" :key="video.id" :video="video" @click="navigateToVideo(video.id)" />
      </template>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="mt-8 text-center pb-8">
      <n-button :loading="loadingMore" @click="loadMore" type="primary" size="large">
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </n-button>
    </div>

    <!-- 返回顶部 -->
    <n-back-top :right="20" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMessage } from 'naive-ui';
  import VideoCard from '@/components/VideoCard.vue';
  import VideoCardSkeleton from '@/components/VideoCardSkeleton.vue';
  import type { Video } from '@/types';
  import { videoService } from '@/services/video';
  import { useUserStore } from '@/stores/user';
  import { useVideoStore } from '@/stores/video';

  const router = useRouter();
  const message = useMessage();
  const userStore = useUserStore();
  const videoStore = useVideoStore();

  // 状态管理
  const videos = ref<Video[]>([]);
  const loading = ref(true);
  const loadingMore = ref(false);
  const page = ref(1);
  const hasMore = ref(true);
  const selectedTag = ref('all');
  const error = ref<Error | null>(null);

  // 分类标签
  const tags = ref([
    { id: 'all', name: '全部', icon: 'fa-th-large' },
    { id: 'javascript', name: 'JavaScript', icon: 'fa-js' },
    { id: 'typescript', name: 'TypeScript', icon: 'fa-code' },
    { id: 'vue', name: 'Vue', icon: 'fa-vuejs' },
    { id: 'react', name: 'React', icon: 'fa-react' },
    { id: 'nodejs', name: 'Node.js', icon: 'fa-node' },
    { id: 'python', name: 'Python', icon: 'fa-python' },
  ]);

  // 计算属性
  const filteredVideos = computed(() => {
    if (selectedTag.value === 'all') return videos.value;
    return videos.value.filter(video => video.tags.includes(selectedTag.value));
  });

  // 加载视频数据
  const loadVideos = async (reset = false) => {
    if (reset) {
      page.value = 1;
      videos.value = [];
      loading.value = true;
      error.value = null;
    } else {
      loadingMore.value = true;
    }

    try {
      const { videos: newVideos, hasMore: more } = await videoService.getVideos(
        page.value,
        12,
        selectedTag.value
      );

      if (reset) {
        videos.value = newVideos;
      } else {
        videos.value.push(...newVideos);
      }

      hasMore.value = more;
      error.value = null;
    } catch (err) {
      error.value = err as Error;
      message.error('加载视频失败');
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  };

  // 选择标签
  const selectTag = (tagId: string) => {
    if (selectedTag.value === tagId) return;
    selectedTag.value = tagId;
    loadVideos(true);
  };

  // 加载更多
  const loadMore = () => {
    if (loadingMore.value || !hasMore.value) return;
    page.value++;
    loadVideos();
  };

  // 导航到视频详情
  const navigateToVideo = (videoId: string) => {
    router.push(`/video/${videoId}`);
    videoStore.addToHistory(videoId);
  };

  // 生命周期钩子
  onMounted(() => {
    loadVideos();
  });
</script>

<style scoped>
  .mask-edges {
    mask-image: linear-gradient(90deg, transparent, #000 1%, #000 99%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 1%, #000 99%, transparent);
  }

  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>