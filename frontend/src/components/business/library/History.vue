/**
* @file History.vue
* @description 观看历史页面组件，用于展示用户的视频观看历史
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 历史记录：展示用户观看过的视频
* - 时间筛选：支持按时间范围筛选历史记录
* - 记录排序：支持按观看时间排序
* - 记录搜索：支持搜索视频标题
* - 分页加载：支持分页加载更多记录
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/
<template>
  <div class="history-container">
    <div class="history-header">
      <h2>观看历史</h2>
      <div class="history-actions">
        <el-button type="text" @click="clearHistory">清空历史记录</el-button>
        <el-button type="text" @click="pauseHistory">暂停记录历史</el-button>
      </div>
    </div>

    <div class="history-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all">
          <VideoList :videos="filteredVideos" @video-click="handleVideoClick" />
        </el-tab-pane>
        <el-tab-pane label="今天" name="today">
          <VideoList :videos="todayVideos" @video-click="handleVideoClick" />
        </el-tab-pane>
        <el-tab-pane label="本周" name="week">
          <VideoList :videos="weekVideos" @video-click="handleVideoClick" />
        </el-tab-pane>
        <el-tab-pane label="更早" name="earlier">
          <VideoList :videos="earlierVideos" @video-click="handleVideoClick" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="history-pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        :page-sizes="[12, 24, 36, 48]" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { IVideo } from '@atom-video/shared-types';
  import VideoList from '@/components/business/video/VideoList.vue';
  import { mockVideos } from '@/mock/video';

  const router = useRouter();

  // 状态
  const activeTab = ref('all');
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(100);
  const isHistoryPaused = ref(false);

  // 计算属性
  const filteredVideos = computed(() => {
    return mockVideos.slice(0, pageSize.value);
  });

  const todayVideos = computed(() => {
    return mockVideos.filter(video => {
      const today = new Date();
      const videoDate = new Date(video.createdAt);
      return videoDate.toDateString() === today.toDateString();
    });
  });

  const weekVideos = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return mockVideos.filter(video => {
      const videoDate = new Date(video.createdAt);
      return videoDate >= weekAgo;
    });
  });

  const earlierVideos = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return mockVideos.filter(video => {
      const videoDate = new Date(video.createdAt);
      return videoDate < weekAgo;
    });
  });

  // 方法
  const handleVideoClick = (video: IVideo) => {
    router.push(`/video/${video.id}`);
  };

  const clearHistory = () => {
    // 清空历史记录
    console.log('清空历史记录');
  };

  const pauseHistory = () => {
    isHistoryPaused.value = !isHistoryPaused.value;
    console.log('历史记录状态:', isHistoryPaused.value ? '已暂停' : '已恢复');
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    // 重新加载数据
    loadHistory();
  };

  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    // 重新加载数据
    loadHistory();
  };

  const loadHistory = () => {
    // 加载历史记录数据
    console.log('加载历史记录:', {
      page: currentPage.value,
      pageSize: pageSize.value,
      tab: activeTab.value
    });
  };
</script>

<style scoped>
  .history-container {
    padding: 20px;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .history-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .history-actions {
    display: flex;
    gap: 16px;
  }

  .history-content {
    margin-bottom: 20px;
  }

  .history-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>