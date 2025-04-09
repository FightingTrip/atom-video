<!-- 搜索结果组件 -->
<template>
  <div class="search-results">
    <div class="search-header">
      <h2>搜索结果: "{{ searchQuery }}"</h2>
      <div class="search-filters">
        <el-select v-model="filterType" placeholder="筛选类型" @change="handleFilterChange">
          <el-option label="全部" value="all" />
          <el-option label="视频" value="video" />
          <el-option label="频道" value="channel" />
          <el-option label="播放列表" value="playlist" />
        </el-select>
        <el-select v-model="sortBy" placeholder="排序方式" @change="handleSortChange">
          <el-option label="相关度" value="relevance" />
          <el-option label="上传日期" value="date" />
          <el-option label="观看次数" value="views" />
          <el-option label="评分" value="rating" />
        </el-select>
      </div>
    </div>

    <div class="search-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="视频" name="videos">
          <VideoListComponent :videos="filteredVideos" @video-click="handleVideoClick" />
        </el-tab-pane>
        <el-tab-pane label="频道" name="channels">
          <div class="channel-list">
            <div v-for="channel in channels" :key="channel.id" class="channel-item"
              @click="handleChannelClick(channel)">
              <img :src="channel.avatar" :alt="channel.name" class="channel-avatar" />
              <div class="channel-info">
                <h3 class="channel-name">{{ channel.name }}</h3>
                <p class="channel-stats">{{ channel.subscribers }} 订阅者 · {{ channel.videos }} 个视频</p>
                <p class="channel-description">{{ channel.description }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="播放列表" name="playlists">
          <div class="playlist-list">
            <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item"
              @click="handlePlaylistClick(playlist)">
              <div class="playlist-thumbnail">
                <img :src="playlist.thumbnail" :alt="playlist.title" />
                <div class="video-count">{{ playlist.videoCount }} 个视频</div>
              </div>
              <div class="playlist-info">
                <h3 class="playlist-title">{{ playlist.title }}</h3>
                <p class="playlist-creator">由 {{ playlist.creator }} 创建</p>
                <p class="playlist-description">{{ playlist.description }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="search-pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        :page-sizes="[12, 24, 36, 48]" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { IVideo } from '@atom-video/shared-types';
  import VideoListComponent from '@/components/business/video/VideoListComponent.vue';
  import { mockVideos } from '@/mock/video';

  const route = useRoute();
  const router = useRouter();

  // 状态
  const searchQuery = ref(route.query.q as string || '');
  const filterType = ref('all');
  const sortBy = ref('relevance');
  const activeTab = ref('videos');
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(100);

  // 模拟数据
  const channels = ref([
    {
      id: '1',
      name: '示例频道 1',
      avatar: 'https://picsum.photos/100/100?random=1',
      subscribers: 1000,
      videos: 50,
      description: '这是一个示例频道的描述'
    },
    {
      id: '2',
      name: '示例频道 2',
      avatar: 'https://picsum.photos/100/100?random=2',
      subscribers: 2000,
      videos: 100,
      description: '这是另一个示例频道的描述'
    }
  ]);

  const playlists = ref([
    {
      id: '1',
      title: '示例播放列表 1',
      thumbnail: 'https://picsum.photos/300/168?random=1',
      videoCount: 10,
      creator: '创建者 1',
      description: '这是一个示例播放列表的描述'
    },
    {
      id: '2',
      title: '示例播放列表 2',
      thumbnail: 'https://picsum.photos/300/168?random=2',
      videoCount: 20,
      creator: '创建者 2',
      description: '这是另一个示例播放列表的描述'
    }
  ]);

  // 计算属性
  const filteredVideos = computed(() => {
    let videos = [...mockVideos];

    // 根据搜索查询过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      videos = videos.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
      );
    }

    // 根据排序方式排序
    switch (sortBy.value) {
      case 'relevance':
        // 这里可以根据实际需求实现相关度排序
        break;
      case 'date':
        videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'views':
        videos.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        videos.sort((a, b) => b.rating - a.rating);
        break;
    }

    // 分页
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return videos.slice(start, end);
  });

  // 方法
  const handleVideoClick = (video: IVideo) => {
    router.push(`/video/${video.id}`);
  };

  const handleChannelClick = (channel: any) => {
    router.push(`/channel/${channel.id}`);
  };

  const handlePlaylistClick = (playlist: any) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handleFilterChange = () => {
    // 重新加载数据
    loadSearchResults();
  };

  const handleSortChange = () => {
    // 重新加载数据
    loadSearchResults();
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    loadSearchResults();
  };

  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    loadSearchResults();
  };

  const loadSearchResults = () => {
    // 加载搜索结果
    console.log('加载搜索结果:', {
      query: searchQuery.value,
      filterType: filterType.value,
      sortBy: sortBy.value,
      page: currentPage.value,
      pageSize: pageSize.value
    });
  };
</script>

<style scoped>
  .search-results {
    padding: 20px;
  }

  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .search-filters {
    display: flex;
    gap: 16px;
  }

  .search-content {
    margin-bottom: 20px;
  }

  .search-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .channel-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .channel-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .channel-item:hover {
    background-color: var(--hover-bg);
  }

  .channel-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .channel-info {
    flex: 1;
  }

  .channel-name {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
  }

  .channel-stats {
    margin: 0 0 8px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .channel-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .playlist-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .playlist-item {
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .playlist-item:hover {
    transform: translateY(-4px);
  }

  .playlist-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
  }

  .playlist-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-count {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .playlist-info {
    padding: 12px;
  }

  .playlist-title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
  }

  .playlist-creator {
    margin: 0 0 8px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .playlist-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>