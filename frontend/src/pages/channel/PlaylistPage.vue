<!--
 * @file PlaylistPage.vue
 * @description 播放列表页面，显示播放列表中的视频
 * @created 2025-04-08
 * @last-modified 2025-04-08
 -->

<template>
  <div class="playlist-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <n-result status="error" title="加载失败" :description="error">
        <template #footer>
          <n-button @click="loadPlaylist" type="primary">重试</n-button>
          <n-button @click="$router.push('/')" class="ml-2">返回首页</n-button>
        </template>
      </n-result>
    </div>

    <!-- 播放列表内容 -->
    <template v-else>
      <div class="playlist-header">
        <div class="playlist-thumbnail">
          <img :src="playlist.thumbnailUrl" alt="播放列表缩略图" />
          <div class="playlist-count">
            <n-icon>
              <ListOutline />
            </n-icon>
            {{ playlist.videoCount }}个视频
          </div>
        </div>

        <div class="playlist-info">
          <div class="playlist-title-container">
            <h1 class="playlist-title">{{ playlist.title }}</h1>
            <n-tag v-if="playlist.visibility !== 'public'" size="small"
              :type="playlist.visibility === 'private' ? 'error' : 'warning'">
              {{ playlist.visibility === 'private' ? '私密' : '不公开' }}
            </n-tag>
          </div>

          <p v-if="playlist.description" class="playlist-description">{{ playlist.description }}</p>

          <div class="playlist-meta">
            <div class="channel-info" @click="navigateToChannel">
              <n-avatar round size="small" :src="channelAvatar" />
              <span class="channel-name">{{ channelName }}</span>
            </div>

            <div class="playlist-stats">
              <span class="update-time">{{ formatDate(playlist.updatedAt) }}更新</span>
              <span class="divider">•</span>
              <span class="video-count">{{ playlist.videoCount }}个视频</span>
            </div>
          </div>

          <div class="playlist-actions">
            <n-button-group>
              <n-button type="primary" @click="playAll">
                <template #icon>
                  <n-icon>
                    <PlayOutline />
                  </n-icon>
                </template>
                播放全部
              </n-button>
              <n-button v-if="isOwner" @click="showEditModal = true">
                <template #icon>
                  <n-icon>
                    <PencilOutline />
                  </n-icon>
                </template>
                编辑
              </n-button>
              <n-button v-if="isOwner" @click="showUploadCoverModal = true">
                <template #icon>
                  <n-icon>
                    <ImageOutline />
                  </n-icon>
                </template>
                更换封面
              </n-button>
              <n-button @click="showShareModal = true">
                <template #icon>
                  <n-icon>
                    <ShareSocialOutline />
                  </n-icon>
                </template>
                分享
              </n-button>
              <n-button v-if="!isOwner" @click="savePlaylist">
                <template #icon>
                  <n-icon>
                    <BookmarkOutline />
                  </n-icon>
                </template>
                收藏
              </n-button>
            </n-button-group>
          </div>
        </div>
      </div>

      <!-- 视频列表 -->
      <div v-if="videos.length > 0" class="video-list-container mt-4">
        <playlist-sorter :playlist-id="playlistId" :videos="videos" :title="'播放列表视频'" :can-remove="isOwner"
          @update-videos="handleVideosUpdated" @remove-video="removeVideoHandler" @order-changed="handleOrderChanged" />
      </div>

      <n-empty v-else description="播放列表还没有视频" class="mt-8">
        <template #extra>
          <n-button v-if="isOwner" type="primary" @click="navigateToAdd">
            添加视频
          </n-button>
        </template>
      </n-empty>

      <!-- 视频移除确认弹窗 -->
      <n-modal v-model:show="showRemoveModal" preset="dialog" title="确认移除视频" positive-text="确认" negative-text="取消"
        @positive-click="confirmRemoveVideo" @negative-click="cancelRemoveVideo">
        <div>确定要从播放列表中移除这个视频吗？</div>
      </n-modal>
    </template>

    <!-- 编辑播放列表弹窗 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑播放列表" style="width: 500px;">
      <n-form ref="editPlaylistFormRef" :model="editForm" :rules="formRules">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="editForm.title" placeholder="请输入播放列表标题" />
        </n-form-item>

        <n-form-item label="描述" path="description">
          <n-input type="textarea" v-model:value="editForm.description" placeholder="请输入播放列表描述" rows="3" />
        </n-form-item>

        <n-form-item label="可见性" path="visibility">
          <n-select v-model:value="editForm.visibility" :options="visibilityOptions" />
        </n-form-item>

        <n-form-item>
          <n-button type="primary" @click="submitEdit" :loading="submitting">保存</n-button>
          <n-button class="ml-2" @click="showEditModal = false">取消</n-button>
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 使用增强的分享组件替换原有分享弹窗 -->
    <playlist-share-modal v-model:show="showShareModal" :playlist="playlist" @success="onShareSuccess"
      @error="onShareError" />

    <!-- 使用封面上传组件替换原有上传弹窗 -->
    <n-modal v-model:show="showUploadCoverModal" preset="card" title="更换播放列表封面" style="width: 500px;">
      <div class="upload-cover-container">
        <playlist-cover-upload ref="coverUploadRef" :current-cover="playlist.thumbnailUrl" :disabled="uploading"
          @select-file="handleCoverFileSelected" @upload-error="handleUploadError" />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    NButton,
    NButtonGroup,
    NSpin,
    NEmpty,
    NIcon,
    NAvatar,
    NTag,
    NModal,
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NSelect,
    NResult,
    NUpload,
    NText,
    NP,
    NAlert,
    useMessage
  } from 'naive-ui';
  import {
    PlayOutline,
    ListOutline,
    BookmarkOutline,
    PencilOutline,
    CloseOutline,
    ShareSocialOutline,
    ImageOutline,
    LinkOutline,
  } from '@vicons/ionicons5';
  import { useUserStore } from '@/stores/user';
  import { useToast } from '@/composables/useToast';
  import type { ChannelPlaylist, ChannelVideo } from '@/types/channel';
  import dayjs from 'dayjs';
  import {
    getPlaylistById,
    getPlaylistVideos,
    updatePlaylist,
    removeVideoFromPlaylist,
    setPlaylistThumbnail,
    sharePlaylist,
    updatePlaylistVideoPositions
  } from '@/services/playlist';
  import { getChannelById } from '@/services/channel';

  // 导入新组件
  import PlaylistCoverUpload from '@/components/business/playlist/PlaylistCoverUpload.vue';
  import PlaylistShareModal from '@/components/business/playlist/PlaylistShareModal.vue';
  import PlaylistSorter from '@/components/business/playlist/PlaylistSorter.vue';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const toast = useToast();
  const message = useMessage();

  // 自定义Logo组件
  const LogoWechatIcon = () => {
    return h('svg', {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      style: { fill: 'currentColor' }
    }, [
      h('path', { d: 'M8.691 2C4.301 2 0.5 4.986 0.5 8.759c0 2.071 1.152 3.83 2.969 5.037l-0.766 2.394c-0.036 0.114-0.006 0.239 0.077 0.323 0.057 0.057 0.134 0.088 0.211 0.088 0.042 0 0.083-0.009 0.122-0.026l2.84-1.363c0.866 0.25 1.786 0.389 2.738 0.389 0.307 0 0.61-0.016 0.909-0.046 0.567 1.805 2.47 3.25 4.8 3.65l2.477 1.189c0.039 0.018 0.08 0.027 0.122 0.027 0.078 0 0.154-0.031 0.211-0.088 0.083-0.084 0.113-0.209 0.077-0.323l-0.648-2.025c1.614-1.102 2.679-2.673 2.769-4.436 0.003-0.045 0.004-0.086 0.004-0.127 0-3.534-3.393-6.254-7.68-6.417-0.038-0.002-0.077-0.003-0.115-0.003-0.129 0-0.257 0.009-0.383 0.018C10.483 2.409 9.596 2 8.691 2zM6.051 6.696c0.745 0 1.35 0.605 1.35 1.35s-0.605 1.35-1.35 1.35c-0.745 0-1.35-0.605-1.35-1.35s0.605-1.35 1.35-1.35zM11.33 6.696c0.745 0 1.35 0.605 1.35 1.35s-0.605 1.35-1.35 1.35c-0.745 0-1.35-0.605-1.35-1.35s0.605-1.35 1.35-1.35zM16.103 11.973c-0.393 0-0.711 0.318-0.711 0.711s0.318 0.711 0.711 0.711 0.711-0.318 0.711-0.711-0.318-0.711-0.711-0.711zM19.96 11.973c-0.393 0-0.711 0.318-0.711 0.711s0.318 0.711 0.711 0.711 0.711-0.318 0.711-0.711-0.318-0.711-0.711-0.711z' })
    ]);
  };

  const LogoWeiboIcon = () => {
    return h('svg', {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      style: { fill: 'currentColor' }
    }, [
      h('path', { d: 'M10.098 20c-4.612 0-8.363-2.222-8.363-4.958 0-1.437 0.901-3.084 2.442-4.651 2.05-2.089 4.416-3.028 5.317-2.116 0.396 0.408 0.457 1.121 0.191 2.010-0.137 0.411 0.408 0.457 1.121 0.191 2.010-0.137 0.411 0.408 0.183 0.408 0.183 1.741-0.740 3.251-0.783 3.811 0.025 0.301 0.421 0.275 1.008-0.008 1.687-0.132 0.312 0.040 0.363 0.290 0.434 1.008 0.316 2.129 1.080 2.129 2.427 0 2.736-3.903 4.958-8.516 4.958zM6.723 11.111c-2.335 0.235-4.092 1.736-3.936 3.342s2.212 2.699 4.547 2.465c2.333-0.234 4.092-1.733 3.936-3.341-0.157-1.608-2.212-2.699-4.547-2.465z' }),
      h('path', { d: 'M8.212 16.584c-1.118 0.146-2.147-0.344-2.308-1.106-0.162-0.75 0.604-1.483 1.726-1.634 1.134-0.166 2.147 0.334 2.298 1.084 0.154 0.763-0.612 1.496-1.717 1.657z' }),
      h('path', { d: 'M19.433 9.324c-0.393-0.043-0.83-0.072-1.291-0.083-0.155-0.002-0.276-0.124-0.278-0.279-0.002-0.152 0.115-0.276 0.267-0.281 0.48-0.012 0.936-0.043 1.345-0.088 1.166-0.138 1.973-0.861 1.805-1.622-0.168-0.759-1.252-1.257-2.417-1.113-0.445 0.057-0.875 0.171-1.255 0.323-0.145 0.058-0.309-0.012-0.367-0.157-0.058-0.145 0.011-0.309 0.155-0.368 0.435-0.171 0.925-0.299 1.43-0.361 1.445-0.177 2.817 0.479 3.059 1.614 0.244 1.135-0.729 2.249-2.174 2.483-0.093 0.011-0.183 0.023-0.28 0.033z' }),
      h('path', { d: 'M17.585 11.426c-0.136 0.068-0.3 0.013-0.369-0.121-0.068-0.136-0.015-0.3 0.121-0.368 0.285-0.141 0.487-0.362 0.572-0.621s0.073-0.518-0.021-0.772c-0.169-0.454-0.671-0.712-1.242-0.643-0.36 0.042-0.676 0.211-0.85 0.44-0.094 0.119-0.268 0.139-0.386 0.046-0.12-0.095-0.14-0.267-0.045-0.389 0.277-0.352 0.702-0.59 1.184-0.645 0.856-0.104 1.624 0.316 1.895 1.044 0.136 0.364 0.14 0.76 0.012 1.129-0.128 0.368-0.392 0.683-0.804 0.9z' }),
      h('path', { d: 'M6.871 15.661c-0.381 0.058-0.704-0.108-0.769-0.376-0.062-0.264 0.188-0.528 0.571-0.586 0.383-0.057 0.704 0.108 0.769 0.376 0.062 0.269-0.188 0.53-0.571 0.586z' })
    ]);
  };

  // 基础状态
  const playlistId = ref(route.params.id as string);
  const loading = ref(true);
  const error = ref('');
  const playlist = ref<ChannelPlaylist & { userId?: string }>({} as ChannelPlaylist & { userId?: string });
  const channelId = ref('');
  const channelName = ref('');
  const channelAvatar = ref('');

  // 视频列表状态
  const videos = ref<ChannelVideo[]>([]);
  const loadingVideos = ref(false);
  const loadingMoreVideos = ref(false);
  const hasMoreVideos = ref(false);
  const page = ref(1);
  const pageSize = ref(10);

  // 编辑状态
  const showEditModal = ref(false);
  const submitting = ref(false);
  const editForm = ref({
    title: '',
    description: '',
    visibility: 'public'
  });

  // 表单规则
  const formRules = {
    title: [
      { required: true, message: '请输入播放列表标题', trigger: 'blur' },
      { min: 2, max: 50, message: '标题长度必须在2-50个字符之间', trigger: 'blur' }
    ]
  };

  // 可见性选项
  const visibilityOptions = [
    { label: '公开', value: 'public' },
    { label: '私密', value: 'private' },
    { label: '不公开', value: 'unlisted' }
  ];

  // 添加状态
  const showShareModal = ref(false);
  const showUploadCoverModal = ref(false);
  const shareResult = ref<{ shareLink: string; platform?: string; shareType: string } | null>(null);
  const uploading = ref(false);

  // 模拟定义LogoQQ图标组件
  const LogoQQ = {
    render() {
      return h('svg', {
        viewBox: '0 0 24 24',
        width: '1em',
        height: '1em',
        style: { fill: 'currentColor' }
      }, [
        h('path', { d: 'M21.395 15.035a32.21 32.21 0 0 0-.794-2.955 10.605 10.605 0 0 1-1.524-5.365 10.48 10.48 0 0 0-1.254-4.96 3.07 3.07 0 0 0-1.936-.855 6.887 6.887 0 0 0-3.731 1.442c-.32-.728-.8-1.34-1.515-1.742a3.175 3.175 0 0 0-2.338-.204c-1.85.49-3.43 2.448-3.43 4.502a16.164 16.164 0 0 1-.501 3.886c-.833 3.05-1.805 5.596-1.372 8.94.356 2.758 4.148 4.125 7.441 4.351 3.293-.226 7.084-1.594 7.44-4.351.069-.537.052-1.052-.009-1.541.542.126 1.143.218 1.775.256a2.87 2.87 0 0 0 2.11-.611c.933-.865.803-3.16-.362-4.793z' })
      ]);
    }
  };

  // 计算属性
  const isOwner = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser?.id === playlist.value.userId;
  });

  // 加载播放列表
  async function loadPlaylist() {
    loading.value = true;
    error.value = '';

    try {
      // 调用API加载播放列表
      const playlistData = await getPlaylistById(playlistId.value);
      playlist.value = playlistData;

      // 加载频道信息
      const channelData = await getChannelById(playlistData.channelId);
      channelId.value = channelData.id;
      channelName.value = channelData.name;
      channelAvatar.value = channelData.avatarUrl;

      // 加载视频
      await loadVideos();
    } catch (err) {
      console.error('加载播放列表失败:', err);
      error.value = '无法加载播放列表，请稍后重试';
    } finally {
      loading.value = false;
    }
  }

  // 加载视频
  async function loadVideos(loadMore = false) {
    if (!loadMore) {
      loadingVideos.value = true;
      page.value = 1;
    } else {
      loadingMoreVideos.value = true;
    }

    try {
      // 调用API加载视频
      const response = await getPlaylistVideos(playlistId.value, page.value, pageSize.value);

      if (loadMore) {
        videos.value = [...videos.value, ...response.videos];
      } else {
        videos.value = response.videos;
      }

      hasMoreVideos.value = response.hasMore;

      if (loadMore && response.hasMore) {
        page.value++;
      }
    } catch (err) {
      console.error('加载视频失败:', err);
      toast.error('无法加载视频，请稍后重试');
    } finally {
      loadingVideos.value = false;
      loadingMoreVideos.value = false;
    }
  }

  // 加载更多视频
  function loadMoreVideos() {
    loadVideos(true);
  }

  // 播放视频
  function playVideo(video: ChannelVideo) {
    router.push(`/video/${video.id}`);
  }

  // 播放全部
  function playAll() {
    if (videos.value.length > 0) {
      router.push(`/video/${videos.value[0].id}?playlist=${playlistId.value}`);
    } else {
      toast.warning('没有可播放的视频');
    }
  }

  // 保存播放列表
  function savePlaylist() {
    if (!userStore.isLoggedIn) {
      toast.warning('请先登录');
      router.push('/auth/login');
      return;
    }

    toast.success('播放列表已保存');
  }

  // 移除视频
  async function removeVideo(video: ChannelVideo) {
    try {
      await removeVideoFromPlaylist(playlistId.value, video.id);
      const index = videos.value.findIndex(v => v.id === video.id);
      if (index !== -1) {
        videos.value.splice(index, 1);
        playlist.value.videoCount--;
        toast.success('视频已从播放列表中移除');
      }
    } catch (err) {
      console.error('从播放列表中移除视频失败:', err);
      toast.error('移除失败，请稍后重试');
    }
  }

  // 导航到频道
  function navigateToChannel() {
    router.push(`/channel/${channelId.value}`);
  }

  // 提交编辑
  async function submitEdit() {
    if (!editForm.value.title) {
      toast.warning('请输入播放列表标题');
      return;
    }

    submitting.value = true;

    try {
      // 调用API更新播放列表
      const updatedPlaylist = await updatePlaylist(playlistId.value, {
        title: editForm.value.title,
        description: editForm.value.description,
        visibility: editForm.value.visibility
      });

      // 更新本地数据
      playlist.value = {
        ...playlist.value,
        ...updatedPlaylist
      };

      showEditModal.value = false;
      toast.success('播放列表已更新');
    } catch (err) {
      console.error('更新播放列表失败:', err);
      toast.error('更新失败，请稍后重试');
    } finally {
      submitting.value = false;
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

  // 格式化日期
  function formatDate(date: string): string {
    return dayjs(date).format('YYYY年MM月DD日');
  }

  // 格式化数字
  function formatNumber(num: number): string {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  }

  // 分享成功处理
  function onShareSuccess(result: { shareLink: string; platform?: string; shareType: string }) {
    shareResult.value = result;

    if (result.platform) {
      toast.success(`已生成${result.platform === 'wechat' ? '微信' :
        result.platform === 'weibo' ? '微博' :
          result.platform === 'qq' ? 'QQ' : '社交媒体'
        }分享链接`);
    }

    // 如果是私有播放列表被分享，更新本地状态
    if (playlist.value.visibility === 'private') {
      playlist.value.visibility = 'unlisted';
    }
  }

  // 分享错误处理
  function onShareError(error: string) {
    toast.error(error || '分享失败，请重试');
  }

  // 处理封面图片选择
  async function handleCoverFileSelected(file: File) {
    uploading.value = true;

    try {
      // 在实际应用中，这里应该先将文件上传到服务器获取URL
      // 为了演示，我们使用FileReader创建本地URL
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const imageUrl = e.target?.result as string;

          // 调用API更新封面
          await setPlaylistThumbnail(playlistId.value, imageUrl);

          // 刷新播放列表数据
          await loadPlaylist();

          toast.success('封面更新成功');
          showUploadCoverModal.value = false;
        } catch (error) {
          handleUploadError('更新封面失败，请重试');
        } finally {
          uploading.value = false;
        }
      };

      reader.onerror = () => {
        handleUploadError('读取文件失败，请重试');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      handleUploadError('处理图片失败，请重试');
    }
  }

  // 处理上传错误
  function handleUploadError(error: string) {
    uploading.value = false;
    toast.error(error || '上传失败，请重试');
  }

  // 视频移除相关
  const showRemoveModal = ref(false);
  const videoToRemove = ref<{ index: number; videoId: string } | null>(null);

  // 处理排序后的视频更新
  async function handleOrderChanged(newVideoIds: string[]) {
    try {
      // 调用API更新视频顺序
      await updatePlaylistVideoPositions(playlistId.value, newVideoIds);
      toast.success('视频顺序已更新');

      // 重新加载最新的视频列表
      await loadPlaylistVideos();
    } catch (error) {
      console.error('更新视频顺序失败', error);
      toast.error('更新视频顺序失败，请重试');
    }
  }

  // 处理视频列表更新
  function handleVideosUpdated(updatedVideos: ChannelVideo[]) {
    videos.value = updatedVideos;
  }

  // 处理视频移除
  function removeVideoHandler(index: number, videoId: string) {
    videoToRemove.value = { index, videoId };
    showRemoveModal.value = true;
  }

  // 确认移除视频
  async function confirmRemoveVideo() {
    if (!videoToRemove.value) return;

    try {
      await removeVideoFromPlaylist(playlistId.value, videoToRemove.value.videoId);

      // 从本地数组移除
      videos.value.splice(videoToRemove.value.index, 1);

      toast.success('视频已从播放列表中移除');
    } catch (error) {
      console.error('移除视频失败', error);
      toast.error('移除视频失败，请重试');
    } finally {
      showRemoveModal.value = false;
      videoToRemove.value = null;
    }
  }

  // 取消移除视频
  function cancelRemoveVideo() {
    showRemoveModal.value = false;
    videoToRemove.value = null;
  }

  // 初始化
  onMounted(() => {
    loadPlaylist();

    // 初始化编辑表单
    editForm.value = {
      title: playlist.value.title || '',
      description: playlist.value.description || '',
      visibility: playlist.value.visibility || 'public'
    };
  });
</script>

<style scoped>
  .playlist-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .loading-container,
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    width: 100%;
  }

  /* 播放列表头部 */
  .playlist-header {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    padding: 24px;
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
  }

  .playlist-thumbnail {
    width: 280px;
    flex-shrink: 0;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .playlist-thumbnail img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .playlist-count {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .playlist-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .playlist-title-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .playlist-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);
  }

  .playlist-description {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin-bottom: 16px;
    white-space: pre-line;
    line-height: 1.5;
  }

  .playlist-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    align-items: center;
  }

  .channel-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .channel-name {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 500;
  }

  .playlist-stats {
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  .divider {
    margin: 0 8px;
  }

  .playlist-actions {
    margin-top: auto;
  }

  /* 视频列表 */
  .videos-container {
    margin-top: 16px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  .loading-videos,
  .empty-videos {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .video-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .video-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .video-item:hover {
    background-color: var(--bg-color-secondary);
  }

  .video-index {
    width: 24px;
    text-align: center;
    font-size: 14px;
    color: var(--text-color-secondary);
    font-weight: 500;
  }

  .video-thumbnail {
    width: 160px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .video-thumbnail img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 11px;
  }

  .video-details {
    flex: 1;
    overflow: hidden;
  }

  .video-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 6px;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .video-meta {
    font-size: 13px;
    color: var(--text-color-secondary);
  }

  .video-actions {
    flex-shrink: 0;
  }

  /* 加载更多 */
  .load-more {
    display: flex;
    justify-content: center;
    margin: 24px 0;
  }

  /* 辅助类 */
  .ml-2 {
    margin-left: 8px;
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .playlist-header {
      flex-direction: column;
      gap: 16px;
    }

    .playlist-thumbnail {
      width: 100%;
    }

    .playlist-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .video-item {
      flex-wrap: wrap;
    }

    .video-index {
      display: none;
    }

    .video-thumbnail {
      width: 120px;
    }

    .video-actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
  }

  /* 分享模态框样式 */
  .share-container {
    padding: 10px;
  }

  .share-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* 添加Tailwind工具类 */
  .mb-4 {
    margin-bottom: 1rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .mb-1 {
    margin-bottom: 0.25rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .mt-1 {
    margin-top: 0.25rem;
  }

  .grid {
    display: grid;
  }

  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .gap-4 {
    gap: 1rem;
  }

  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .text-gray-500 {
    color: rgba(107, 114, 128, 1);
  }

  /* 封面上传弹窗样式 */
  .upload-cover-container {
    padding: 10px;
  }

  .current-cover {
    margin-bottom: 1rem;
  }
</style>