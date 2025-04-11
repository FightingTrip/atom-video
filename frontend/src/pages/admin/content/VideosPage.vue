/**
* 管理后台视频管理页面
*
* 用于管理员查看、审核和管理所有视频
*/
<template>
  <div class="videos-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">视频管理</h1>
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
          <n-button @click="exportVideos">
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
          <n-input v-model:value="searchQuery" placeholder="搜索视频标题/ID/关键词">
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="statusFilter" :options="statusOptions" placeholder="视频状态" clearable />
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="categoryFilter" :options="categoryOptions" placeholder="视频分类" clearable />
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
      <n-data-table ref="table" :columns="columns" :data="videos" :pagination="pagination" :loading="loading"
        :row-key="row => row.id" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
        @update:sorter="handleSorterChange" />
    </n-card>

    <!-- 视频预览抽屉 -->
    <n-drawer v-model:show="showPreview" :width="640" placement="right">
      <n-drawer-content title="视频预览">
        <div v-if="currentVideo" class="video-preview">
          <div class="video-player-container">
            <img :src="currentVideo.thumbnailUrl" class="video-thumbnail" alt="视频缩略图" />
            <div class="video-player-overlay">
              <n-icon size="48" class="play-icon">
                <PlayCircleOutline />
              </n-icon>
            </div>
          </div>
          <div class="video-info">
            <h3>{{ currentVideo.title }}</h3>
            <p class="video-description">{{ currentVideo.description }}</p>
            <div class="video-meta">
              <n-space>
                <span><n-icon>
                    <PersonOutline />
                  </n-icon> {{ currentVideo.author }}</span>
                <span><n-icon>
                    <TimeOutline />
                  </n-icon> {{ currentVideo.duration }}</span>
                <span><n-icon>
                    <EyeOutline />
                  </n-icon> {{ currentVideo.viewCount }}</span>
                <span><n-icon>
                    <ThumbsUpOutline />
                  </n-icon> {{ currentVideo.likeCount }}</span>
              </n-space>
            </div>
            <div class="video-tags">
              <n-tag v-for="tag in currentVideo.tags" :key="tag" size="small" style="margin-right: 8px;">
                {{ tag }}
              </n-tag>
            </div>
          </div>
          <div class="video-actions">
            <n-space>
              <n-button type="primary" @click="approveVideo(currentVideo)">通过审核</n-button>
              <n-button type="error" @click="rejectVideo(currentVideo)">拒绝视频</n-button>
              <n-button @click="showPreview = false">关闭</n-button>
            </n-space>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>

    <!-- 视频审核确认对话框 -->
    <n-modal v-model:show="showApproveModal" preset="dialog" title="确认审核通过" positive-text="确认" negative-text="取消"
      @positive-click="confirmApprove" @negative-click="showApproveModal = false">
      <template #icon>
        <n-icon color="#18a058">
          <CheckmarkCircleOutline />
        </n-icon>
      </template>
      <div>确认将视频 <strong>{{ approveVideo?.title }}</strong> 设置为已审核状态？</div>
    </n-modal>

    <!-- 视频拒绝对话框 -->
    <n-modal v-model:show="showRejectModal" preset="card" title="拒绝视频" style="width: 500px">
      <n-form ref="rejectForm" :model="rejectData" label-placement="left" label-width="80px">
        <n-form-item label="拒绝原因" path="reason">
          <n-select v-model:value="rejectData.reason" :options="rejectReasons" placeholder="请选择拒绝原因" />
        </n-form-item>
        <n-form-item label="详细说明" path="comment">
          <n-input v-model:value="rejectData.comment" type="textarea" placeholder="请输入详细说明" :rows="3" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="showRejectModal = false">取消</n-button>
          <n-button type="error" @click="confirmReject">确认拒绝</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 删除视频确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="删除视频" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="showDeleteModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除视频 <strong>{{ deleteVideo?.title }}</strong> 吗？此操作不可逆。</div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, onMounted } from 'vue'
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
    NDrawerContent
  } from 'naive-ui'
  import {
    ReloadOutline,
    DownloadOutline,
    SearchOutline,
    CreateOutline,
    TrashOutline,
    EyeOutline,
    PlayCircleOutline,
    CheckmarkCircleOutline,
    PersonOutline,
    TimeOutline,
    ThumbsUpOutline,
    AlertCircleOutline,
    CloseCircleOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'
  import type { FormInst } from 'naive-ui'

  // 视频数据类型
  interface Video {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    videoUrl: string
    author: string
    authorId: string
    category: string
    duration: string
    status: string
    tags: string[]
    createdAt: string
    publishedAt: string | null
    viewCount: number
    likeCount: number
    commentCount: number
  }

  // 路由和状态
  const router = useRouter()
  const message = useMessage()

  // 搜索筛选状态
  const searchQuery = ref('')
  const statusFilter = ref(null)
  const categoryFilter = ref(null)
  const dateRange = ref(null)

  // 表格状态
  const loading = ref(false)
  const table = ref(null)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 50],
    showSizePicker: true,
    prefix({ itemCount }: { itemCount: number }) {
      return `共 ${itemCount} 个视频`
    }
  })

  // 视频列表数据
  const videos = ref<Video[]>([])

  // 预览状态
  const showPreview = ref(false)
  const currentVideo = ref<Video | null>(null)

  // 审核状态
  const showApproveModal = ref(false)
  const approveVideo = ref<Video | null>(null)
  const showRejectModal = ref(false)
  const rejectVideo = ref<Video | null>(null)
  const rejectForm = ref<FormInst | null>(null)
  const rejectData = reactive({
    reason: '',
    comment: ''
  })

  // 删除状态
  const showDeleteModal = ref(false)
  const deleteVideo = ref<Video | null>(null)

  // 筛选选项
  const statusOptions = [
    { label: '待审核', value: 'PENDING' },
    { label: '已发布', value: 'PUBLISHED' },
    { label: '已拒绝', value: 'REJECTED' },
    { label: '草稿', value: 'DRAFT' },
    { label: '私密', value: 'PRIVATE' }
  ]

  const categoryOptions = [
    { label: '游戏', value: 'GAME' },
    { label: '音乐', value: 'MUSIC' },
    { label: '教育', value: 'EDUCATION' },
    { label: '科技', value: 'TECH' },
    { label: '美食', value: 'FOOD' },
    { label: '旅行', value: 'TRAVEL' },
    { label: '体育', value: 'SPORTS' },
    { label: '娱乐', value: 'ENTERTAINMENT' },
    { label: '动漫', value: 'ANIME' },
    { label: '电影', value: 'MOVIE' }
  ]

  const rejectReasons = [
    { label: '违反社区规范', value: 'VIOLATION' },
    { label: '低质量内容', value: 'LOW_QUALITY' },
    { label: '侵犯版权', value: 'COPYRIGHT' },
    { label: '包含不适当内容', value: 'INAPPROPRIATE' },
    { label: '其他原因', value: 'OTHER' }
  ]

  // 渲染视频状态标签
  function renderStatus(status: string) {
    const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'default', text: string }> = {
      'PUBLISHED': { type: 'success', text: '已发布' },
      'PENDING': { type: 'warning', text: '待审核' },
      'REJECTED': { type: 'error', text: '已拒绝' },
      'DRAFT': { type: 'default', text: '草稿' },
      'PRIVATE': { type: 'info', text: '私密' }
    }

    const info = statusMap[status] || { type: 'default', text: status }

    return h(NTag, { type: info.type, size: 'small' }, { default: () => info.text })
  }

  // 表格列配置
  const columns = ref<DataTableColumns<Video>>([
    {
      title: '缩略图',
      key: 'thumbnail',
      width: 100,
      render(row) {
        return h('img', {
          src: row.thumbnailUrl,
          alt: '缩略图',
          style: 'width: 80px; height: 45px; object-fit: cover; border-radius: 4px;',
          onClick: () => {
            currentVideo.value = row
            showPreview.value = true
          },
          style: {
            cursor: 'pointer',
            width: '80px',
            height: '45px',
            objectFit: 'cover',
            borderRadius: '4px'
          }
        })
      }
    },
    {
      title: '视频标题',
      key: 'title',
      width: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '作者',
      key: 'author',
      width: 120
    },
    {
      title: '分类',
      key: 'category',
      width: 100
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render(row) {
        return renderStatus(row.status)
      },
      filters: statusOptions.map(option => ({
        label: option.label,
        value: option.value
      })),
      filterOptionValue: null,
      filterOption: (value, row) => row.status === value
    },
    {
      title: '时长',
      key: 'duration',
      width: 80
    },
    {
      title: '上传时间',
      key: 'createdAt',
      width: 120,
      sorter: 'default'
    },
    {
      title: '观看数',
      key: 'viewCount',
      width: 100,
      sorter: 'default'
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render(row) {
        return h(NSpace, { align: 'center' }, {
          default: () => [
            // 预览按钮
            h(
              NTooltip,
              { trigger: 'hover', placement: 'top' },
              {
                trigger: () => h(
                  NButton,
                  {
                    size: 'small',
                    quaternary: true,
                    circle: true,
                    onClick: () => {
                      currentVideo.value = row
                      showPreview.value = true
                    }
                  },
                  { icon: () => h(NIcon, null, { default: () => h(EyeOutline) }) }
                ),
                default: () => '预览视频'
              }
            ),
            // 编辑按钮
            h(
              NTooltip,
              { trigger: 'hover', placement: 'top' },
              {
                trigger: () => h(
                  NButton,
                  {
                    size: 'small',
                    quaternary: true,
                    circle: true,
                    onClick: () => viewVideoDetail(row)
                  },
                  { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }
                ),
                default: () => '编辑视频'
              }
            ),
            // 审核按钮
            row.status === 'PENDING' ? h(
              NTooltip,
              { trigger: 'hover', placement: 'top' },
              {
                trigger: () => h(
                  NButton,
                  {
                    size: 'small',
                    quaternary: true,
                    circle: true,
                    onClick: () => handleApproveAction(row)
                  },
                  { icon: () => h(NIcon, null, { default: () => h(CheckmarkCircleOutline) }) }
                ),
                default: () => '通过审核'
              }
            ) : null,
            // 删除按钮
            h(
              NTooltip,
              { trigger: 'hover', placement: 'top' },
              {
                trigger: () => h(
                  NButton,
                  {
                    size: 'small',
                    quaternary: true,
                    circle: true,
                    onClick: () => deleteVideoModal(row)
                  },
                  { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
                ),
                default: () => '删除视频'
              }
            )
          ].filter(Boolean)
        })
      }
    }
  ])

  // 加载视频数据
  async function loadVideos() {
    loading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成模拟数据
      const mockVideos: Video[] = Array.from({ length: 100 }, (_, index) => {
        const id = `vid-${index + 1}`.padStart(8, '0')
        const statusOptions = ['PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'PENDING', 'REJECTED', 'DRAFT', 'PRIVATE']
        const categories = ['GAME', 'MUSIC', 'EDUCATION', 'TECH', 'FOOD', 'TRAVEL', 'SPORTS', 'ENTERTAINMENT', 'ANIME', 'MOVIE']

        // 随机日期生成
        const createdDate = new Date()
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 100))

        // 随机视频状态
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
        // 只有已发布状态才有发布日期
        const publishedAt = status === 'PUBLISHED' ? new Date(createdDate.getTime() + 86400000).toISOString().split('T')[0] : null

        // 随机时长
        const minutes = Math.floor(Math.random() * 15)
        const seconds = Math.floor(Math.random() * 60)
        const duration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`

        return {
          id: id,
          title: `测试视频 ${id} - ${['游戏实况', '音乐MV', '教学视频', '技术分享', '美食制作'][Math.floor(Math.random() * 5)]}`,
          description: `这是一个测试视频描述，用于演示视频管理功能。这个视频属于${categories[Math.floor(Math.random() * categories.length)]}类别。`,
          thumbnailUrl: `https://picsum.photos/id/${(index % 50) + 100}/320/180`,
          videoUrl: `https://example.com/videos/${id}`,
          author: `用户${Math.floor(Math.random() * 1000)}`,
          authorId: `user-${Math.floor(Math.random() * 1000)}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          duration: duration,
          status: status,
          tags: ['标签1', '标签2', '标签3'].slice(0, Math.floor(Math.random() * 3) + 1),
          createdAt: createdDate.toISOString().split('T')[0],
          publishedAt: publishedAt,
          viewCount: Math.floor(Math.random() * 10000),
          likeCount: Math.floor(Math.random() * 1000),
          commentCount: Math.floor(Math.random() * 100)
        }
      })

      // 过滤和排序
      let filteredVideos = [...mockVideos]

      // 应用搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filteredVideos = filteredVideos.filter(video =>
          video.title.toLowerCase().includes(query) ||
          video.id.toLowerCase().includes(query) ||
          video.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // 应用状态过滤
      if (statusFilter.value) {
        filteredVideos = filteredVideos.filter(video => video.status === statusFilter.value)
      }

      // 应用分类过滤
      if (categoryFilter.value) {
        filteredVideos = filteredVideos.filter(video => video.category === categoryFilter.value)
      }

      // 应用日期过滤
      if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        const startDate = new Date(dateRange.value[0])
        const endDate = new Date(dateRange.value[1])

        filteredVideos = filteredVideos.filter(video => {
          const createdDate = new Date(video.createdAt)
          return createdDate >= startDate && createdDate <= endDate
        })
      }

      // 设置总数
      pagination.itemCount = filteredVideos.length

      // 分页
      const start = (pagination.page - 1) * pagination.pageSize
      const paginatedVideos = filteredVideos.slice(start, start + pagination.pageSize)

      videos.value = paginatedVideos
    } catch (error) {
      console.error('加载视频数据失败:', error)
      message.error('加载视频数据失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索处理
  function handleSearch() {
    pagination.page = 1
    loadVideos()
  }

  // 重置过滤器
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = null
    categoryFilter.value = null
    dateRange.value = null
    pagination.page = 1
    loadVideos()
  }

  // 分页变化
  function handlePageChange(page: number) {
    pagination.page = page
    loadVideos()
  }

  // 每页条数变化
  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadVideos()
  }

  // 排序变化
  function handleSorterChange() {
    loadVideos()
  }

  // 刷新数据
  function refreshData() {
    loadVideos()
  }

  // 导出视频
  function exportVideos() {
    message.success('视频数据导出成功')
  }

  // 查看视频详情
  function viewVideoDetail(video: Video) {
    router.push(`/admin/content/videos/${video.id}`)
  }

  // 处理审核通过操作
  function handleApproveAction(video: Video) {
    approveVideo.value = video
    showApproveModal.value = true
  }

  // 确认通过视频审核
  async function confirmApprove() {
    if (!approveVideo.value) return

    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新本地列表
    const index = videos.value.findIndex(v => v.id === approveVideo.value?.id)
    if (index !== -1) {
      videos.value[index].status = 'PUBLISHED'
      videos.value[index].publishedAt = new Date().toISOString().split('T')[0]
    }

    message.success(`视频 "${approveVideo.value.title}" 已通过审核并发布`)
    showApproveModal.value = false
    approveVideo.value = null
  }

  // 处理拒绝视频
  function handleRejectAction(video: Video) {
    rejectVideo.value = video
    rejectData.reason = ''
    rejectData.comment = ''
    showRejectModal.value = true
  }

  // 确认拒绝视频
  async function confirmReject() {
    if (!rejectVideo.value) return

    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新本地列表
    const index = videos.value.findIndex(v => v.id === rejectVideo.value?.id)
    if (index !== -1) {
      videos.value[index].status = 'REJECTED'
    }

    message.success(`视频 "${rejectVideo.value.title}" 已拒绝`)
    showRejectModal.value = false
    rejectVideo.value = null
  }

  // 打开删除视频确认框
  function deleteVideoModal(video: Video) {
    deleteVideo.value = video
    showDeleteModal.value = true
  }

  // 确认删除视频
  async function confirmDelete() {
    if (!deleteVideo.value) return

    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 从本地列表中移除
    videos.value = videos.value.filter(v => v.id !== deleteVideo.value?.id)

    message.success(`视频 "${deleteVideo.value.title}" 已删除`)
    showDeleteModal.value = false
    deleteVideo.value = null
  }

  // 预览视频
  function previewVideo(video: Video) {
    currentVideo.value = video
    showPreview.value = true
  }

  // 初始化
  onMounted(() => {
    loadVideos()
  })
</script>

<style scoped>
  .videos-page {
    width: 100%;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 500;
  }

  .filter-card {
    margin-bottom: 24px;
  }

  .filter-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .data-card {
    margin-bottom: 24px;
  }

  .video-preview {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .video-player-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-player-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .play-icon {
    color: white;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .play-icon:hover {
    opacity: 1;
  }

  .video-info {
    padding: 8px 0;
  }

  .video-description {
    margin: 8px 0;
    color: var(--text-color-secondary);
  }

  .video-meta {
    margin: 12px 0;
    color: var(--text-color-secondary);
  }

  .video-tags {
    margin: 12px 0;
  }

  .video-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .filter-buttons {
      margin-top: 16px;
    }
  }
</style>