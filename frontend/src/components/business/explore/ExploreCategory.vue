<!-- 探索分类组件 -->
<template>
  <div class="explore-category">
    <div class="category-header">
      <h2>{{ categoryName }}</h2>
      <div class="category-filters">
        <el-select v-model="sortBy" placeholder="排序方式" @change="handleSortChange">
          <el-option label="最新" value="latest" />
          <el-option label="最热" value="hot" />
          <el-option label="评分最高" value="rating" />
        </el-select>
        <el-select v-model="timeRange" placeholder="时间范围" @change="handleTimeRangeChange">
          <el-option label="全部时间" value="all" />
          <el-option label="今天" value="today" />
          <el-option label="本周" value="week" />
          <el-option label="本月" value="month" />
        </el-select>
      </div>
    </div>

    <div class="category-content">
      <VideoList :videos="filteredVideos" @video-click="handleVideoClick" />
    </div>

    <div class="category-pagination">
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
  import VideoList from '@/components/business/video/VideoList.vue';
  import { mockVideos } from '@/mock/video';

  const route = useRoute();
  const router = useRouter();

  // 状态
  const categoryName = ref(route.params.category as string);
  const sortBy = ref('latest');
  const timeRange = ref('all');
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(100);

  // 计算属性
  const filteredVideos = computed(() => {
    let videos = [...mockVideos];

    // 根据时间范围过滤
    if (timeRange.value !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (timeRange.value) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      videos = videos.filter(video => {
        const videoDate = new Date(video.createdAt);
        return videoDate >= filterDate;
      });
    }

    // 根据排序方式排序
    switch (sortBy.value) {
      case 'latest':
        videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'hot':
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

  const handleSortChange = () => {
    // 重新加载数据
    loadVideos();
  };

  const handleTimeRangeChange = () => {
    // 重新加载数据
    loadVideos();
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    loadVideos();
  };

  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    loadVideos();
  };

  const loadVideos = () => {
    // 加载视频数据
    console.log('加载视频:', {
      category: categoryName.value,
      sortBy: sortBy.value,
      timeRange: timeRange.value,
      page: currentPage.value,
      pageSize: pageSize.value
    });
  };
</script>

<style scoped>
  .explore-category {
    padding: 20px;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .category-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .category-filters {
    display: flex;
    gap: 16px;
  }

  .category-content {
    margin-bottom: 20px;
  }

  .category-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>