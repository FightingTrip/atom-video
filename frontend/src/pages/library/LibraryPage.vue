/**
* @file LibraryPage.vue
* @description 媒体库页面，展示用户收藏的视频内容
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="library-page">
    <header class="library-header">
      <h1>视频图书馆</h1>
      <div class="filter-section">
        <el-select v-model="selectedType" placeholder="视频类型" clearable>
          <el-option v-for="type in videoTypes" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>
        <el-select v-model="selectedDifficulty" placeholder="难度等级" clearable>
          <el-option v-for="level in difficultyLevels" :key="level.value" :label="level.label" :value="level.value" />
        </el-select>
        <el-input v-model="searchQuery" placeholder="搜索视频..." prefix-icon="el-icon-search" clearable />
      </div>
    </header>

    <main class="video-grid">
      <VideoList :videos="filteredVideos" :loading="loading" @video-click="navigateToVideo" />
    </main>

    <div v-if="!loading && filteredVideos.length === 0" class="no-results">
      <el-empty description="没有找到匹配的视频" />
    </div>

    <div class="pagination-container">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalVideos"
        :page-sizes="[12, 24, 36, 48]" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import type { IVideo, VideoType, DifficultyLevel } from '@atom-video/shared-types';
  import { generateVideoList } from '@/mock/videos';
  import VideoList from '@/components/business/video/VideoList.vue';

  const router = useRouter();

  // 状态
  const videos = ref<IVideo[]>([]);
  const loading = ref(true);
  const currentPage = ref(1);
  const pageSize = ref(12);
  const totalVideos = ref(0);
  const searchQuery = ref('');
  const selectedType = ref<VideoType | ''>('');
  const selectedDifficulty = ref<DifficultyLevel | ''>('');

  // 常量
  const videoTypes = [
    { value: 'TUTORIAL', label: '教程' },
    { value: 'CODE_REVIEW', label: '代码评审' },
    { value: 'LIVE_CODING', label: '实时编程' },
    { value: 'TECH_TALK', label: '技术讲座' }
  ];

  const difficultyLevels = [
    { value: 'BEGINNER', label: '入门' },
    { value: 'INTERMEDIATE', label: '中级' },
    { value: 'ADVANCED', label: '高级' }
  ];

  // 计算属性
  const filteredVideos = computed(() => {
    let result = videos.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedType.value) {
      result = result.filter(video => video.videoType === selectedType.value);
    }

    if (selectedDifficulty.value) {
      result = result.filter(video => video.difficultyLevel === selectedDifficulty.value);
    }

    return result;
  });

  // 方法
  const loadVideos = async () => {
    loading.value = true;
    try {
      // 这里使用模拟数据，实际项目中应该调用API
      const mockVideos = generateVideoList(100);
      videos.value = mockVideos;
      totalVideos.value = mockVideos.length;
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const navigateToVideo = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
  };

  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
  };

  // 生命周期钩子
  onMounted(() => {
    loadVideos();
  });
</script>

<style scoped>
  .library-page {
    padding: 24px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .library-header {
    margin-bottom: 24px;
  }

  .library-header h1 {
    font-size: 28px;
    margin-bottom: 16px;
  }

  .filter-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .filter-section .el-select {
    width: 160px;
  }

  .filter-section .el-input {
    width: 240px;
  }

  .video-grid {
    margin-bottom: 24px;
  }

  .no-results {
    text-align: center;
    padding: 48px 0;
  }

  .pagination-container {
    text-align: center;
    margin-top: 24px;
  }
</style>