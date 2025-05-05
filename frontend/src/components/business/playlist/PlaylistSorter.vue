<template>
  <div class="playlist-sorter">
    <div class="sorter-header">
      <h3 class="sorter-title">{{ title }}</h3>
      <div class="sorter-actions">
        <n-button size="small" type="primary" @click="handleReorder" :disabled="videos.length < 2">
          {{ isEditing ? '保存顺序' : '重新排序' }}
        </n-button>
        <n-button v-if="isEditing" size="small" @click="cancelEdit">取消</n-button>
      </div>
    </div>

    <n-scrollbar style="max-height: 500px">
      <div class="video-list">
        <div v-for="(video, index) in sortableVideos" :key="video.id" class="video-item"
          :class="{ 'is-editing': isEditing }">
          <div class="video-index">{{ index + 1 }}</div>
          <div class="video-thumbnail">
            <img :src="video.coverUrl || video.thumbnailUrl" :alt="video.title" />
            <div class="video-duration">{{ formatDuration(video.duration) }}</div>
          </div>
          <div class="video-details">
            <h4 class="video-title">{{ video.title }}</h4>
            <div class="video-meta">
              <span class="video-author">{{ video.author.nickname }}</span>
              <span class="video-views">{{ formatNumber(video.views) }}次观看</span>
            </div>
          </div>
          <div v-if="isEditing" class="video-actions">
            <n-button quaternary circle size="small" @click="moveUp(index)" :disabled="index === 0">
              <template #icon>
                <n-icon><arrow-up-outline /></n-icon>
              </template>
            </n-button>
            <n-button quaternary circle size="small" @click="moveDown(index)"
              :disabled="index === sortableVideos.length - 1">
              <template #icon>
                <n-icon><arrow-down-outline /></n-icon>
              </template>
            </n-button>
          </div>
          <div v-else-if="canRemove" class="video-actions">
            <n-button quaternary circle size="small" @click="removeVideo(video.id)" :disabled="removing === video.id"
              :loading="removing === video.id">
              <template #icon>
                <n-icon><close-outline /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </n-scrollbar>

    <div v-if="videos.length === 0" class="empty-state">
      <n-empty description="没有找到视频" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, watch } from 'vue';
  import { NButton, NIcon, NEmpty, NScrollbar, useMessage } from 'naive-ui';
  import { CloseOutline, ArrowUpOutline, ArrowDownOutline } from '@vicons/ionicons5';
  import { updatePlaylistVideoPositions, removeVideoFromPlaylist } from '@/services/playlist';

  const props = defineProps({
    playlistId: {
      type: String,
      required: true
    },
    videos: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: '播放列表视频'
    },
    canRemove: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits<{
    (e: 'update:videos', videos: any[]): void;
    (e: 'video-removed', videoId: string): void;
    (e: 'order-changed', videos: any[]): void;
    (e: 'error', error: string): void;
  }>();

  const message = useMessage();
  const isEditing = ref(false);
  const saving = ref(false);
  const removing = ref<string | null>(null);
  const sortableVideos = ref<any[]>([]);

  // 监听videos变化，更新本地视频列表
  watch(() => props.videos, (newVideos) => {
    sortableVideos.value = [...newVideos];
  }, { deep: true, immediate: true });

  // 处理重新排序按钮点击
  function handleReorder() {
    if (props.videos.length < 2) {
      message.info('至少需要两个视频才能排序');
      return;
    }

    if (isEditing.value) {
      saveOrder();
    } else {
      startEdit();
    }
  }

  // 开始编辑
  function startEdit() {
    isEditing.value = true;
  }

  // 取消编辑
  function cancelEdit() {
    isEditing.value = false;
    sortableVideos.value = [...props.videos];
  }

  // 上移视频
  function moveUp(index: number) {
    if (index <= 0) return;

    const temp = sortableVideos.value[index];
    sortableVideos.value[index] = sortableVideos.value[index - 1];
    sortableVideos.value[index - 1] = temp;

    // 创建新数组以触发更新
    sortableVideos.value = [...sortableVideos.value];
  }

  // 下移视频
  function moveDown(index: number) {
    if (index >= sortableVideos.value.length - 1) return;

    const temp = sortableVideos.value[index];
    sortableVideos.value[index] = sortableVideos.value[index + 1];
    sortableVideos.value[index + 1] = temp;

    // 创建新数组以触发更新
    sortableVideos.value = [...sortableVideos.value];
  }

  // 保存排序
  async function saveOrder() {
    if (!isEditing.value) return;

    saving.value = true;

    try {
      // 收集所有视频位置更新
      const changedPositions = sortableVideos.value.map((video, index) => ({
        videoId: video.id,
        position: index
      }));

      // 检查是否有位置变化
      const hasChanges = changedPositions.some((update, index) => {
        const originalVideo = props.videos.find(v => v.id === update.videoId);
        return originalVideo && props.videos.indexOf(originalVideo) !== index;
      });

      if (hasChanges) {
        // 批量更新所有视频位置
        await updatePlaylistVideoPositions(props.playlistId, changedPositions);

        // 通知父组件顺序已更改
        emit('update:videos', sortableVideos.value);
        emit('order-changed', sortableVideos.value);

        message.success('视频顺序已更新');
      } else {
        message.info('顺序未更改');
      }

      // 完成编辑
      isEditing.value = false;
    } catch (error) {
      console.error('更新视频顺序失败:', error);
      const errorMsg = error instanceof Error ? error.message : '更新顺序失败，请重试';
      emit('error', errorMsg);
      message.error(errorMsg);
    } finally {
      saving.value = false;
    }
  }

  // 移除视频
  async function removeVideo(videoId: string) {
    if (!props.canRemove || removing.value) return;

    removing.value = videoId;

    try {
      // 调用API移除视频
      await removeVideoFromPlaylist(props.playlistId, videoId);

      // 更新本地列表
      const updatedVideos = sortableVideos.value.filter(v => v.id !== videoId);
      sortableVideos.value = updatedVideos;

      // 通知父组件
      emit('update:videos', updatedVideos);
      emit('video-removed', videoId);

      message.success('视频已从播放列表中移除');
    } catch (error) {
      console.error('移除视频失败:', error);
      const errorMsg = error instanceof Error ? error.message : '移除视频失败，请重试';
      emit('error', errorMsg);
      message.error(errorMsg);
    } finally {
      removing.value = null;
    }
  }

  // 格式化时长
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 格式化数字
  function formatNumber(num: number): string {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  }
</script>

<style scoped>
  .playlist-sorter {
    position: relative;
    border-radius: 8px;
    background-color: var(--bg-color-secondary);
    padding: 16px;
  }

  .sorter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .sorter-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
  }

  .sorter-actions {
    display: flex;
    gap: 8px;
  }

  .video-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .video-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    background-color: var(--bg-color);
    transition: background-color 0.2s ease;
  }

  .video-item:hover {
    background-color: var(--hover-color);
  }

  .video-item.is-editing {
    cursor: move;
    border: 1px dashed var(--border-color);
  }

  .video-index {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--text-color-2);
    margin-right: 12px;
  }

  .video-thumbnail {
    position: relative;
    width: 120px;
    height: 68px;
    overflow: hidden;
    border-radius: 4px;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    padding: 1px 4px;
    border-radius: 2px;
  }

  .video-details {
    flex: 1;
    overflow: hidden;
  }

  .video-title {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .video-meta {
    font-size: 12px;
    color: var(--text-color-3);
    display: flex;
    flex-direction: column;
  }

  .video-author {
    margin-bottom: 2px;
  }

  .video-actions {
    margin-left: 8px;
    display: flex;
    gap: 4px;
  }

  .empty-state {
    padding: 32px 0;
    text-align: center;
  }

  @media (max-width: 640px) {
    .video-thumbnail {
      width: 80px;
      height: 45px;
      margin-right: 8px;
    }

    .video-index {
      width: 20px;
      margin-right: 8px;
    }
  }
</style>