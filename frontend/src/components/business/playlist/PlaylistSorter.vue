<template>
  <div class="playlist-sorter">
    <div class="sorter-header">
      <h3 class="sorter-title">{{ title }}</h3>
      <div v-if="isEditing" class="sorter-actions">
        <n-button size="small" @click="cancelEdit">取消</n-button>
        <n-button type="primary" size="small" :loading="saving" @click="saveOrder">保存</n-button>
      </div>
      <div v-else class="sorter-actions">
        <n-button size="small" type="primary" :disabled="videos.length < 2" @click="startEdit">
          重新排序
        </n-button>
      </div>
    </div>

    <n-scrollbar style="max-height: 500px">
      <draggable v-model="sortableVideos" v-bind="dragOptions" :disabled="!isEditing" class="video-list" item-key="id">
        <template #item="{ element, index }">
          <div class="video-item" :class="{ 'is-editing': isEditing }">
            <div class="video-index">{{ index + 1 }}</div>
            <div class="video-thumbnail">
              <img :src="element.coverUrl || element.thumbnailUrl" :alt="element.title" />
              <div class="video-duration">{{ formatDuration(element.duration) }}</div>
            </div>
            <div class="video-details">
              <h4 class="video-title">{{ element.title }}</h4>
              <div class="video-meta">
                <span class="video-author">{{ element.author.nickname }}</span>
                <span class="video-views">{{ formatNumber(element.views) }}次观看</span>
              </div>
            </div>
            <div v-if="isEditing" class="drag-handle">
              <n-icon>
                <menu-outline />
              </n-icon>
            </div>
            <div v-else-if="canRemove" class="video-actions">
              <n-button quaternary circle size="small" @click="removeVideo(element.id)"
                :disabled="removing === element.id" :loading="removing === element.id">
                <template #icon>
                  <n-icon>
                    <close-outline />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
        </template>
      </draggable>
    </n-scrollbar>

    <div v-if="videos.length === 0" class="empty-state">
      <n-empty description="没有找到视频" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, defineEmits, watch } from 'vue';
  import { NButton, NIcon, NEmpty, NScrollbar, useMessage } from 'naive-ui';
  import { CloseOutline, MenuOutline } from '@vicons/ionicons5';
  import { VueDraggableNext as draggable } from 'vue-draggable-next';
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

  // 拖拽配置
  const dragOptions = computed(() => {
    return {
      animation: 200,
      disabled: !isEditing.value,
      ghostClass: 'ghost',
      handle: '.drag-handle'
    };
  });

  // 开始编辑
  function startEdit() {
    if (props.videos.length < 2) {
      message.info('至少需要两个视频才能排序');
      return;
    }
    isEditing.value = true;
  }

  // 取消编辑
  function cancelEdit() {
    isEditing.value = false;
    sortableVideos.value = [...props.videos];
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
    gap: 8px;
    min-height: 50px;
  }

  .video-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background-color: var(--bg-color);
    transition: background-color 0.2s;
  }

  .video-item:hover {
    background-color: var(--hover-color);
  }

  .video-item.is-editing {
    cursor: move;
    border: 1px dashed var(--border-color);
  }

  .video-index {
    width: 24px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color-secondary);
  }

  .video-thumbnail {
    position: relative;
    width: 120px;
    height: 68px;
    border-radius: 4px;
    overflow: hidden;
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
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 12px;
  }

  .video-details {
    flex: 1;
    min-width: 0;
  }

  .video-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .video-meta {
    font-size: 12px;
    color: var(--text-color-secondary);
    display: flex;
    gap: 8px;
  }

  .drag-handle {
    cursor: move;
    padding: 4px;
    color: var(--text-color-secondary);
  }

  .video-actions {
    flex-shrink: 0;
  }

  .empty-state {
    padding: 32px 0;
  }

  .ghost {
    opacity: 0.5;
    background-color: var(--primary-color-hover) !important;
  }

  @media (max-width: 640px) {
    .video-thumbnail {
      width: 80px;
      height: 45px;
    }

    .video-title {
      font-size: 13px;
    }

    .video-meta {
      font-size: 11px;
      flex-direction: column;
      gap: 2px;
    }
  }
</style>