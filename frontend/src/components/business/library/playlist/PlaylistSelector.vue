<template>
  <Dialog :visible="visible" :header="title" :style="{ width: '450px' }" :modal="true" :closable="true"
    @update:visible="$emit('update:visible', $event)">
    <div class="playlist-selector">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-content-center my-4">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </div>

      <!-- 播放列表列表 -->
      <div v-else-if="playlists.length > 0" class="playlists-container">
        <div class="flex align-items-center mb-3">
          <span class="text-lg font-semibold">选择播放列表</span>
          <Button icon="pi pi-plus" class="p-button-text p-button-rounded ml-auto" @click="showCreateForm = true"
            v-tooltip.top="'创建新播放列表'" />
        </div>

        <div v-if="!showCreateForm" class="playlist-list">
          <div v-for="playlist in playlists" :key="playlist.id"
            class="playlist-item p-3 mb-2 flex align-items-center cursor-pointer"
            :class="{ 'playlist-item-selected': selectedPlaylistId === playlist.id }" @click="selectPlaylist(playlist)">
            <div class="playlist-thumbnail mr-3">
              <img :src="playlist.thumbnailUrl" alt="播放列表缩略图" class="w-full h-full object-cover rounded" />
            </div>
            <div class="playlist-info flex-1">
              <div class="playlist-title font-medium truncate">{{ playlist.title }}</div>
              <div class="playlist-meta text-sm text-color-secondary">
                {{ playlist.videoCount }}个视频 · {{ playlist.visibility === 'public' ? '公开' : (playlist.visibility ===
                  'private' ? '私密' : '未列出') }}
              </div>
            </div>
            <div class="playlist-action">
              <Button v-if="selectedPlaylistId === playlist.id" icon="pi pi-check" class="p-button-rounded p-button-sm"
                @click.stop="addToPlaylist(playlist.id)" />
              <Button v-else icon="pi pi-plus" class="p-button-rounded p-button-outlined p-button-sm"
                @click.stop="addToPlaylist(playlist.id)" />
            </div>
          </div>
        </div>

        <!-- 创建播放列表表单 -->
        <div v-else class="create-playlist-form">
          <div class="text-lg font-semibold mb-3">创建新播放列表</div>
          <form @submit.prevent="createNewPlaylist">
            <div class="field mb-3">
              <label for="playlist-title" class="block mb-1">标题 <span class="text-red-500">*</span></label>
              <InputText id="playlist-title" v-model="newPlaylist.title" class="w-full"
                :class="{ 'p-invalid': submitted && !newPlaylist.title }" placeholder="输入播放列表标题" required />
              <small v-if="submitted && !newPlaylist.title" class="p-error">请输入播放列表标题</small>
            </div>

            <div class="field mb-3">
              <label for="playlist-description" class="block mb-1">描述</label>
              <Textarea id="playlist-description" v-model="newPlaylist.description" class="w-full"
                placeholder="输入播放列表描述" rows="3" />
            </div>

            <div class="field mb-3">
              <label for="playlist-visibility" class="block mb-1">可见性</label>
              <Dropdown id="playlist-visibility" v-model="newPlaylist.visibility" :options="visibilityOptions"
                optionLabel="label" optionValue="value" placeholder="选择可见性" class="w-full" />
            </div>

            <div class="flex justify-content-end mt-4">
              <Button type="button" label="取消" class="p-button-text mr-2" @click="showCreateForm = false" />
              <Button type="submit" label="创建并添加" :loading="creatingPlaylist" />
            </div>
          </form>
        </div>
      </div>

      <!-- 无播放列表状态 -->
      <div v-else-if="!loading" class="no-playlists flex flex-column align-items-center p-4">
        <i class="pi pi-list text-5xl mb-3 text-color-secondary"></i>
        <div class="text-xl font-medium mb-2">没有播放列表</div>
        <div class="text-color-secondary text-center mb-4">
          创建一个播放列表来组织你喜欢的视频
        </div>
        <Button label="创建播放列表" @click="showCreateForm = true" />
      </div>
    </div>

    <template #footer>
      <Button label="取消" icon="pi pi-times" class="p-button-text" @click="$emit('update:visible', false)" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { usePlaylistStore } from '@/stores/playlist';
  import { useToast } from '@/composables/useToast';

  const playlistStore = usePlaylistStore();
  const toast = useToast();

  // 组件属性
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '添加到播放列表'
    }
  });

  // 组件事件
  const emit = defineEmits(['update:visible', 'added']);

  // 状态
  const loading = ref(false);
  const playlists = computed(() => playlistStore.userPlaylists);
  const selectedPlaylistId = ref('');
  const showCreateForm = ref(false);
  const submitted = ref(false);
  const creatingPlaylist = ref(false);

  // 新播放列表表单
  const newPlaylist = ref({
    title: '',
    description: '',
    visibility: 'private'
  });

  // 可见性选项
  const visibilityOptions = [
    { label: '公开', value: 'public' },
    { label: '私密', value: 'private' },
    { label: '未列出', value: 'unlisted' }
  ];

  // 监听对话框可见性变化
  watch(() => props.visible, async (newValue) => {
    if (newValue) {
      selectedPlaylistId.value = '';
      showCreateForm.value = false;
      resetNewPlaylistForm();

      // 加载用户播放列表
      if (playlists.value.length === 0) {
        await fetchUserPlaylists();
      }
    }
  });

  // 方法
  async function fetchUserPlaylists() {
    try {
      loading.value = true;
      await playlistStore.fetchUserPlaylists();
    } catch (error) {
      console.error('加载播放列表失败', error);
    } finally {
      loading.value = false;
    }
  }

  function selectPlaylist(playlist: any) {
    selectedPlaylistId.value = playlist.id;
  }

  async function addToPlaylist(playlistId: string) {
    try {
      loading.value = true;
      await playlistStore.addVideoToPlaylist(playlistId, props.videoId);

      toast.success('视频已添加到播放列表');

      emit('added', playlistId);
      emit('update:visible', false);
    } catch (error: any) {
      toast.error(error.message || '无法添加视频到播放列表');
    } finally {
      loading.value = false;
    }
  }

  async function createNewPlaylist() {
    submitted.value = true;

    if (!newPlaylist.value.title) {
      return;
    }

    try {
      creatingPlaylist.value = true;

      // 创建播放列表并添加视频
      const data = {
        title: newPlaylist.value.title,
        description: newPlaylist.value.description,
        visibility: newPlaylist.value.visibility as 'public' | 'private' | 'unlisted',
        videoIds: [props.videoId]
      };

      const playlist = await playlistStore.createPlaylist(data);

      toast.success('视频已添加到新播放列表');

      emit('added', playlist.id);
      emit('update:visible', false);
    } catch (error: any) {
      toast.error(error.message || '无法创建播放列表');
    } finally {
      creatingPlaylist.value = false;
      showCreateForm.value = false;
      resetNewPlaylistForm();
    }
  }

  function resetNewPlaylistForm() {
    newPlaylist.value = {
      title: '',
      description: '',
      visibility: 'private'
    };
    submitted.value = false;
  }

  // 初始化
  onMounted(async () => {
    if (props.visible && playlists.value.length === 0) {
      await fetchUserPlaylists();
    }
  });
</script>

<style scoped>
  .playlist-selector {
    min-height: 250px;
  }

  .playlists-container {
    max-height: 400px;
    overflow-y: auto;
  }

  .playlist-item {
    border-radius: 8px;
    transition: all 0.2s;
    background-color: var(--surface-card);
    border: 1px solid var(--surface-border);
  }

  .playlist-item:hover {
    background-color: var(--surface-hover);
    border-color: var(--primary-color);
  }

  .playlist-item-selected {
    background-color: var(--primary-color-lightest);
    border-color: var(--primary-color);
  }

  .playlist-thumbnail {
    width: 72px;
    height: 48px;
    overflow: hidden;
    border-radius: 4px;
  }

  .no-playlists {
    min-height: 250px;
  }

  .create-playlist-form {
    padding: 1rem 0;
  }
</style>