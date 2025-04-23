/**
* 管理后台播放列表管理页面
*
* 用于管理员查看和管理所有播放列表
*/
<template>
  <div class="playlists-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">播放列表管理</h1>
      <div class="page-actions">
        <n-button-group>
          <n-button @click="refreshData">
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            刷新
          </n-button>
          <n-button @click="exportPlaylists">
            <template #icon>
              <n-icon>
                <DownloadOutline />
              </n-icon>
            </template>
            导出
          </n-button>
        </n-button-group>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <n-card class="filter-card">
      <n-grid :cols="24" :x-gap="12">
        <n-grid-item :span="6">
          <n-input v-model:value="searchQuery" placeholder="搜索播放列表标题/ID/关键词">
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="visibilityFilter" :options="visibilityOptions" placeholder="可见性" clearable />
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="channelFilter" :options="channelOptions" placeholder="所属频道" clearable />
        </n-grid-item>
        <n-grid-item :span="4">
          <n-date-picker v-model:value="dateRange" type="daterange" clearable />
        </n-grid-item>
        <n-grid-item :span="6">
          <div class="filter-buttons">
            <n-button type="primary" @click="handleSearch">查询</n-button>
            <n-button @click="resetFilters">重置</n-button>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 数据表格 -->
    <n-card class="data-card">
      <n-data-table ref="table" :columns="columns" :data="playlists" :pagination="pagination" :loading="loading"
        :row-key="row => row.id" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
        @update:sorter="handleSorterChange" />
    </n-card>

    <!-- 播放列表详情抽屉 -->
    <n-drawer v-model:show="showDetail" :width="640" placement="right">
      <n-drawer-content :title="currentPlaylist ? currentPlaylist.title : '播放列表详情'">
        <div v-if="currentPlaylist" class="playlist-detail">
          <div class="playlist-cover">
            <img :src="currentPlaylist.thumbnailUrl" alt="播放列表封面" />
          </div>
          <div class="playlist-info">
            <h3>{{ currentPlaylist.title }}</h3>
            <p class="playlist-description">{{ currentPlaylist.description || '无描述' }}</p>
            <div class="playlist-meta">
              <n-space>
                <span>
                  <n-icon>
                    <PersonOutline />
                  </n-icon>
                  {{ currentPlaylist.channelName }}
                </span>
                <span>
                  <n-icon>
                    <VideocamOutline />
                  </n-icon>
                  {{ currentPlaylist.videoCount }} 个视频
                </span>
                <span>
                  <n-icon>
                    <EyeOutline />
                  </n-icon>
                  {{ formatNumber(currentPlaylist.viewCount) }} 次观看
                </span>
                <span>
                  <n-tag :type="getVisibilityTagType(currentPlaylist.visibility)">
                    {{ formatVisibility(currentPlaylist.visibility) }}
                  </n-tag>
                </span>
              </n-space>
            </div>
            <div class="playlist-dates">
              <p>创建时间: {{ formatDate(currentPlaylist.createdAt) }}</p>
              <p>更新时间: {{ formatDate(currentPlaylist.updatedAt) }}</p>
            </div>
          </div>

          <!-- 播放列表中的视频 -->
          <div class="playlist-videos">
            <h4>包含的视频 ({{ playlistVideos.length }})</h4>
            <n-list v-if="playlistVideos.length > 0">
              <n-list-item v-for="(video, index) in playlistVideos" :key="video.id">
                <n-thing>
                  <template #avatar>
                    <div class="video-index">{{ index + 1 }}</div>
                  </template>
                  <template #header>
                    <div class="video-title">{{ video.title }}</div>
                  </template>
                  <template #description>
                    <div class="video-meta">
                      <span>{{ formatDuration(video.duration) }}</span>
                      <span class="dot-divider">•</span>
                      <span>{{ formatNumber(video.views) }} 次观看</span>
                    </div>
                  </template>
                  <template #action>
                    <n-button text @click="viewVideo(video)">
                      <n-icon>
                        <EyeOutline />
                      </n-icon>
                    </n-button>
                    <n-button text @click="removeFromPlaylist(video)">
                      <n-icon>
                        <TrashOutline />
                      </n-icon>
                    </n-button>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
            <n-empty v-else description="该播放列表暂无视频" />
          </div>

          <div class="playlist-actions">
            <n-space>
              <n-button type="primary" @click="editPlaylist(currentPlaylist)">编辑播放列表</n-button>
              <n-button type="error" @click="deletePlaylist(currentPlaylist)">删除播放列表</n-button>
              <n-button @click="showDetail = false">关闭</n-button>
            </n-space>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>

    <!-- 编辑播放列表对话框 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑播放列表" style="width: 500px">
      <n-form ref="editForm" :model="editData" label-placement="left" label-width="80px" :rules="formRules">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="editData.title" placeholder="请输入播放列表标题" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="editData.description" type="textarea" placeholder="请输入播放列表描述" :rows="3" />
        </n-form-item>
        <n-form-item label="可见性" path="visibility">
          <n-select v-model:value="editData.visibility" :options="visibilityOptions" placeholder="请选择可见性" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" @click="confirmEdit" :loading="submitting">保存</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 删除播放列表确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="删除播放列表" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="showDeleteModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除播放列表 <strong>{{ deletePlaylist?.title }}</strong> 吗？此操作不可逆。</div>
    </n-modal>

    <!-- 视频移除确认对话框 -->
    <n-modal v-model:show="showRemoveVideoModal" preset="dialog" title="移除视频" positive-text="确认移除" negative-text="取消"
      @positive-click="confirmRemoveVideo" @negative-click="showRemoveVideoModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要从播放列表中移除视频 <strong>{{ removeVideo?.title }}</strong> 吗？</div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import {
    NButton,
    NButtonGroup,
    NCard,
    NDataTable,
    NInput,
    NSelect,
    NDatePicker,
    NGrid,
    NGridItem,
    NIcon,
    NModal,
    NForm,
    NFormItem,
    useMessage,
    NTag,
    NSpace,
    NPopover,
    NTooltip,
    NDrawer,
    NDrawerContent,
    NList,
    NListItem,
    NThing,
    NEmpty
  } from 'naive-ui'
  import {
    ReloadOutline,
    DownloadOutline,
    SearchOutline,
    CreateOutline,
    TrashOutline,
    EyeOutline,
    PlayCircleOutline,
    PersonOutline,
    VideocamOutline,
    TimeOutline,
    ThumbsUpOutline,
    AlertCircleOutline,
    CloseCircleOutline,
    ListOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'
  import { formatDate, formatNumber } from '@/utils/format'
  import dayjs from 'dayjs'

  // 路由
  const router = useRouter()
  const message = useMessage()

  // 加载状态
  const loading = ref(false)
  const submitting = ref(false)

  // 搜索筛选
  const searchQuery = ref('')
  const visibilityFilter = ref(null)
  const channelFilter = ref(null)
  const dateRange = ref(null)

  // 表格数据
  const playlists = ref([])
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 50]
  })

  // 可见性选项
  const visibilityOptions = [
    { label: '公开', value: 'public' },
    { label: '私密', value: 'private' },
    { label: '不公开', value: 'unlisted' }
  ]

  // 频道选项（实际应用中从API获取）
  const channelOptions = [
    { label: 'Atom 技术频道', value: '1' },
    { label: '前端开发者', value: '2' },
    { label: 'AI研究实验室', value: '3' }
  ]

  // 详情抽屉
  const showDetail = ref(false)
  const currentPlaylist = ref(null)
  const playlistVideos = ref([])

  // 编辑表单
  const showEditModal = ref(false)
  const editData = reactive({
    id: '',
    title: '',
    description: '',
    visibility: 'public'
  })

  // 删除对话框
  const showDeleteModal = ref(false)
  const deletePlaylist = ref(null)

  // 移除视频对话框
  const showRemoveVideoModal = ref(false)
  const removeVideo = ref(null)

  // 表单验证规则
  const formRules = {
    title: [
      { required: true, message: '请输入播放列表标题', trigger: 'blur' },
      { min: 2, max: 100, message: '标题长度应在2-100个字符之间', trigger: 'blur' }
    ]
  }

  // 表格列定义
  const columns = computed(() => {
    return [
      {
        title: 'ID',
        key: 'id',
        width: 80,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '封面',
        key: 'thumbnailUrl',
        width: 100,
        render(row) {
          return h('img', {
            src: row.thumbnailUrl,
            style: 'width: 80px; height: 45px; object-fit: cover; border-radius: 4px;'
          })
        }
      },
      {
        title: '标题',
        key: 'title',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '所属频道',
        key: 'channelName',
        width: 120
      },
      {
        title: '视频数量',
        key: 'videoCount',
        width: 100,
        sorter: 'default'
      },
      {
        title: '观看次数',
        key: 'viewCount',
        width: 100,
        sorter: 'default',
        render(row) {
          return formatNumber(row.viewCount)
        }
      },
      {
        title: '可见性',
        key: 'visibility',
        width: 100,
        render(row) {
          return h(
            NTag,
            {
              type: getVisibilityTagType(row.visibility),
              size: 'small'
            },
            { default: () => formatVisibility(row.visibility) }
          )
        },
        filters: [
          { text: '公开', value: 'public' },
          { text: '私密', value: 'private' },
          { text: '不公开', value: 'unlisted' }
        ],
        filterOptionValue: visibilityFilter.value
      },
      {
        title: '创建时间',
        key: 'createdAt',
        width: 150,
        sorter: 'default',
        render(row) {
          return formatDate(row.createdAt)
        }
      },
      {
        title: '更新时间',
        key: 'updatedAt',
        width: 150,
        sorter: 'default',
        render(row) {
          return formatDate(row.updatedAt)
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 150,
        fixed: 'right',
        render(row) {
          return h(NSpace, {}, {
            default: () => [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  ghost: true,
                  onClick: () => viewPlaylist(row)
                },
                { default: () => '详情' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  onClick: () => editPlaylist(row)
                },
                { default: () => '编辑' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true,
                  onClick: () => deletePlaylist(row)
                },
                { default: () => '删除' }
              )
            ]
          })
        }
      }
    ]
  })

  // 初始化
  onMounted(() => {
    loadData()
  })

  // 加载数据
  async function loadData() {
    loading.value = true
    try {
      // 模拟加载数据
      await new Promise(resolve => setTimeout(resolve, 800))

      // 模拟数据
      playlists.value = Array.from({ length: 20 }, (_, i) => ({
        id: `pl-${1000 + i}`,
        title: `播放列表 ${i + 1}`,
        description: `这是播放列表 ${i + 1} 的详细描述，包含了一系列精选视频。`,
        thumbnailUrl: `https://picsum.photos/400/225?random=${i}`,
        channelId: ['1', '2', '3'][i % 3],
        channelName: ['Atom 技术频道', '前端开发者', 'AI研究实验室'][i % 3],
        videoCount: Math.floor(Math.random() * 20) + 1,
        viewCount: Math.floor(Math.random() * 10000),
        visibility: ['public', 'private', 'unlisted'][i % 3],
        createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().subtract(Math.floor(Math.random() * 10), 'day').format('YYYY-MM-DD HH:mm:ss')
      }))

      pagination.itemCount = 100 // 模拟总数
    } catch (error) {
      console.error('加载播放列表失败:', error)
      message.error('加载播放列表失败')
    } finally {
      loading.value = false
    }
  }

  // 查看播放列表详情
  async function viewPlaylist(playlist) {
    currentPlaylist.value = playlist
    showDetail.value = true

    // 加载播放列表中的视频
    try {
      // 模拟加载视频
      await new Promise(resolve => setTimeout(resolve, 600))

      // 模拟数据
      playlistVideos.value = Array.from({ length: playlist.videoCount }, (_, i) => ({
        id: `v-${playlist.id}-${i}`,
        title: `视频 ${i + 1} - ${Math.random().toString(36).substring(2, 10)}`,
        duration: Math.floor(Math.random() * 600) + 60,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500),
        thumbnail: `https://picsum.photos/320/180?random=${playlist.id}-${i}`
      }))
    } catch (error) {
      console.error('加载播放列表视频失败:', error)
      message.error('无法加载视频列表')
    }
  }

  // 编辑播放列表
  function editPlaylist(playlist) {
    editData.id = playlist.id
    editData.title = playlist.title
    editData.description = playlist.description || ''
    editData.visibility = playlist.visibility

    showEditModal.value = true
  }

  // 确认编辑
  async function confirmEdit() {
    if (!editData.title.trim()) {
      message.warning('请输入播放列表标题')
      return
    }

    submitting.value = true

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))

      // 更新列表数据
      const index = playlists.value.findIndex(item => item.id === editData.id)
      if (index !== -1) {
        playlists.value[index] = {
          ...playlists.value[index],
          title: editData.title,
          description: editData.description,
          visibility: editData.visibility,
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }

      // 如果当前正在查看此播放列表，也更新详情
      if (currentPlaylist.value && currentPlaylist.value.id === editData.id) {
        currentPlaylist.value = {
          ...currentPlaylist.value,
          title: editData.title,
          description: editData.description,
          visibility: editData.visibility,
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }

      message.success('播放列表已更新')
      showEditModal.value = false
    } catch (error) {
      console.error('更新播放列表失败:', error)
      message.error('更新播放列表失败')
    } finally {
      submitting.value = false
    }
  }

  // 删除播放列表
  function deletePlaylist(playlist) {
    deletePlaylist.value = playlist
    showDeleteModal.value = true
  }

  // 确认删除
  async function confirmDelete() {
    if (!deletePlaylist.value) return

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 600))

      // 从列表中移除
      playlists.value = playlists.value.filter(item => item.id !== deletePlaylist.value.id)

      // 如果当前正在查看此播放列表，关闭详情抽屉
      if (currentPlaylist.value && currentPlaylist.value.id === deletePlaylist.value.id) {
        showDetail.value = false
      }

      message.success('播放列表已删除')
    } catch (error) {
      console.error('删除播放列表失败:', error)
      message.error('删除播放列表失败')
    }
  }

  // 查看视频
  function viewVideo(video) {
    router.push(`/admin/content/videos/${video.id}`)
  }

  // 从播放列表中移除视频
  function removeFromPlaylist(video) {
    removeVideo.value = video
    showRemoveVideoModal.value = true
  }

  // 确认移除视频
  async function confirmRemoveVideo() {
    if (!removeVideo.value || !currentPlaylist.value) return

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从视频列表中移除
      playlistVideos.value = playlistVideos.value.filter(v => v.id !== removeVideo.value.id)

      // 更新视频计数
      if (currentPlaylist.value) {
        currentPlaylist.value.videoCount--

        // 同时更新表格中的数据
        const index = playlists.value.findIndex(p => p.id === currentPlaylist.value.id)
        if (index !== -1) {
          playlists.value[index].videoCount--
        }
      }

      message.success('视频已从播放列表中移除')
    } catch (error) {
      console.error('移除视频失败:', error)
      message.error('移除视频失败')
    }
  }

  // 搜索
  function handleSearch() {
    pagination.page = 1
    loadData()
  }

  // 重置筛选
  function resetFilters() {
    searchQuery.value = ''
    visibilityFilter.value = null
    channelFilter.value = null
    dateRange.value = null
    pagination.page = 1
    loadData()
  }

  // 刷新数据
  function refreshData() {
    loadData()
  }

  // 导出数据
  function exportPlaylists() {
    message.info('导出功能开发中')
  }

  // 页码变化
  function handlePageChange(page) {
    pagination.page = page
    loadData()
  }

  // 每页条数变化
  function handlePageSizeChange(pageSize) {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadData()
  }

  // 排序变化
  function handleSorterChange(sorter) {
    console.log('排序变化:', sorter)
    loadData()
  }

  // 格式化可见性
  function formatVisibility(visibility: string): string {
    const map = {
      'public': '公开',
      'private': '私密',
      'unlisted': '不公开'
    }
    return map[visibility] || visibility
  }

  // 获取可见性标签类型
  function getVisibilityTagType(visibility: string): 'success' | 'warning' | 'error' | 'default' {
    const map = {
      'public': 'success',
      'private': 'error',
      'unlisted': 'warning'
    }
    return map[visibility] || 'default'
  }

  // 格式化时长
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
</script>

<style scoped>
  .playlists-page {
    padding: 16px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }

  .filter-card {
    margin-bottom: 16px;
  }

  .filter-buttons {
    display: flex;
    gap: 12px;
  }

  .data-card {
    margin-bottom: 24px;
  }

  .playlist-detail {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .playlist-cover {
    width: 100%;
    margin-bottom: 16px;
  }

  .playlist-cover img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }

  .playlist-info h3 {
    font-size: 20px;
    margin: 0 0 8px 0;
  }

  .playlist-description {
    color: var(--n-text-color-2);
    margin: 0 0 16px 0;
    white-space: pre-line;
  }

  .playlist-meta {
    margin-bottom: 12px;
  }

  .playlist-dates {
    font-size: 14px;
    color: var(--n-text-color-3);
  }

  .playlist-dates p {
    margin: 4px 0;
  }

  .playlist-videos {
    margin: 24px 0;
  }

  .playlist-videos h4 {
    font-size: 16px;
    margin: 0 0 12px 0;
  }

  .video-index {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--n-primary-color);
    color: white;
    border-radius: 50%;
    font-size: 12px;
  }

  .video-title {
    font-weight: 500;
  }

  .video-meta {
    font-size: 13px;
    color: var(--n-text-color-3);
  }

  .dot-divider {
    margin: 0 6px;
  }

  .playlist-actions {
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .filter-card :deep(.n-grid-item) {
      width: 100% !important;
    }

    .filter-buttons {
      margin-top: 12px;
    }
  }
</style>