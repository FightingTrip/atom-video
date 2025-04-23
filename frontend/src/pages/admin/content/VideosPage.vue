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
      <div>确认将视频 <strong>{{ approveVideoObj?.title }}</strong> 设置为已审核状态？</div>
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
      <div>确认要删除视频 <strong>{{ deleteVideoObj?.title }}</strong> 吗？此操作不可逆。</div>
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
  import adminService from '@/services/admin'
  import type { AdminVideo } from '@/services/admin'
  import { useAdminStore } from '@/stores/admin'
  import { formatDate } from '@/utils/format'

  // 路由和状态
  const router = useRouter()
  const message = useMessage()
  const adminStore = useAdminStore()

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
  const videos = ref<AdminVideo[]>([])

  // 预览状态
  const showPreview = ref(false)
  const currentVideo = ref<AdminVideo | null>(null)

  // 审核状态
  const showApproveModal = ref(false)
  const approveVideoObj = ref<AdminVideo | null>(null)
  const showRejectModal = ref(false)
  const rejectData = reactive({
    reason: '',
    comment: ''
  })

  // 删除状态
  const showDeleteModal = ref(false)
  const deleteVideoObj = ref<AdminVideo | null>(null)

  // 下拉选项
  const statusOptions = [
    { label: '已发布', value: 'published' },
    { label: '待审核', value: 'pending' },
    { label: '已拒绝', value: 'rejected' },
    { label: '草稿', value: 'draft' }
  ]

  const categoryOptions = [
    { label: '技术', value: '技术' },
    { label: '教育', value: '教育' },
    { label: '娱乐', value: '娱乐' },
    { label: '游戏', value: '游戏' },
    { label: '音乐', value: '音乐' },
    { label: '科学', value: '科学' }
  ]

  const rejectReasons = [
    { label: '内容违规', value: 'inappropriate' },
    { label: '版权问题', value: 'copyright' },
    { label: '内容低质量', value: 'low_quality' },
    { label: '内容不符合社区规范', value: 'community_guidelines' },
    { label: '其他原因', value: 'other' }
  ]

  // 表格列定义
  const columns: DataTableColumns<AdminVideo> = [
    {
      title: '视频ID',
      key: 'id',
      width: 100,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '标题',
      key: 'title',
      width: 200,
      ellipsis: {
        tooltip: true
      },
      sorter: 'default'
    },
    {
      title: '缩略图',
      key: 'thumbnailUrl',
      width: 120,
      render(row) {
        return h('img', {
          src: row.thumbnailUrl,
          alt: row.title,
          style: 'width: 100px; height: 56px; object-fit: cover; border-radius: 4px;'
        })
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
      width: 100,
      render(row) {
        return h(NTag, { size: 'small' }, { default: () => row.category })
      },
      filter: true,
      filterOptions: categoryOptions.map(option => ({ label: option.label, value: option.value }))
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render(row) {
        const statusMap: Record<string, { color: string, text: string }> = {
          published: { color: 'success', text: '已发布' },
          pending: { color: 'warning', text: '待审核' },
          rejected: { color: 'error', text: '已拒绝' },
          draft: { color: 'default', text: '草稿' }
        }
        const status = statusMap[row.status] || { color: 'default', text: row.status }
        return h(NTag, { type: status.color as any, size: 'small' }, { default: () => status.text })
      },
      filter: true,
      filterOptions: statusOptions.map(option => ({ label: option.label, value: option.value }))
    },
    {
      title: '上传时间',
      key: 'createdAt',
      width: 150,
      render(row) {
        return formatDate(row.createdAt, 'YYYY-MM-DD HH:mm')
      },
      sorter: 'default'
    },
    {
      title: '播放量',
      key: 'viewCount',
      width: 100,
      render(row) {
        return row.viewCount.toLocaleString()
      },
      sorter: 'default'
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render(row) {
        return h(NSpace, {}, {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                onClick: () => previewVideo(row)
              },
              { default: () => '预览' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: () => editVideo(row)
              },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => deleteVideo(row)
              },
              { default: () => '删除' }
            )
          ]
        })
      }
    }
  ]

  // 初始化
  onMounted(async () => {
    await fetchVideos()
  })

  // 获取视频列表
  async function fetchVideos() {
    loading.value = true

    try {
      const params: Record<string, any> = {
        page: pagination.page,
        pageSize: pagination.pageSize
      }

      // 添加筛选条件
      if (searchQuery.value) {
        params.query = searchQuery.value
      }

      if (statusFilter.value) {
        params.status = statusFilter.value
      }

      if (categoryFilter.value) {
        params.category = categoryFilter.value
      }

      if (dateRange.value && dateRange.value.length === 2) {
        params.startDate = dateRange.value[0]
        params.endDate = dateRange.value[1]
      }

      const result = await adminService.getVideos(params)
      videos.value = result.data
      pagination.itemCount = result.total
    } catch (error) {
      console.error('获取视频列表失败:', error)
      message.error('获取视频列表失败')
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  function refreshData() {
    fetchVideos()
  }

  // 分页处理
  function handlePageChange(page: number) {
    pagination.page = page
    fetchVideos()
  }

  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchVideos()
  }

  // 排序处理
  function handleSorterChange(sorter: any) {
    if (!sorter || !sorter.columnKey) return

    const params: Record<string, any> = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy: sorter.columnKey,
      sortOrder: sorter.order
    }

    fetchVideos()
  }

  // 搜索处理
  function handleSearch() {
    pagination.page = 1
    fetchVideos()
  }

  // 重置筛选
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = null
    categoryFilter.value = null
    dateRange.value = null
    pagination.page = 1
    fetchVideos()
  }

  // 操作方法
  function previewVideo(video: AdminVideo) {
    currentVideo.value = video
    showPreview.value = true
  }

  function editVideo(video: AdminVideo) {
    router.push(`/admin/content/videos/${video.id}`)
  }

  function deleteVideo(video: AdminVideo) {
    deleteVideoObj.value = video
    showDeleteModal.value = true
  }

  async function confirmDelete() {
    if (!deleteVideoObj.value) return

    try {
      const result = await adminService.deleteVideo(deleteVideoObj.value.id)
      if (result.success) {
        message.success('视频删除成功')
        fetchVideos()
      } else {
        message.error('视频删除失败: ' + result.message)
      }
    } catch (error) {
      console.error('删除视频失败:', error)
      message.error('删除视频失败')
    } finally {
      showDeleteModal.value = false
      deleteVideoObj.value = null
    }
  }

  // 审核相关
  function approveVideo(video: AdminVideo) {
    approveVideoObj.value = video
    showApproveModal.value = true
  }

  function rejectVideo(video: AdminVideo) {
    approveVideoObj.value = video
    showRejectModal.value = true
    rejectData.reason = ''
    rejectData.comment = ''
  }

  async function confirmApprove() {
    if (!approveVideoObj.value) return

    try {
      const result = await adminService.updateVideo(approveVideoObj.value.id, {
        status: 'published',
        publishedAt: new Date().toISOString()
      })

      message.success('视频审核通过')
      fetchVideos()
    } catch (error) {
      console.error('更新视频状态失败:', error)
      message.error('操作失败')
    } finally {
      showApproveModal.value = false
      approveVideoObj.value = null
    }
  }

  async function confirmReject() {
    if (!approveVideoObj.value || !rejectData.reason) {
      message.warning('请选择拒绝原因')
      return
    }

    try {
      const result = await adminService.updateVideo(approveVideoObj.value.id, {
        status: 'rejected',
        rejectReason: rejectData.reason,
        rejectComment: rejectData.comment,
        publishedAt: null
      })

      message.success('视频已拒绝')
      fetchVideos()
    } catch (error) {
      console.error('更新视频状态失败:', error)
      message.error('操作失败')
    } finally {
      showRejectModal.value = false
      approveVideoObj.value = null
      rejectData.reason = ''
      rejectData.comment = ''
    }
  }

  // 导出视频列表
  function exportVideos() {
    try {
      // 创建要导出的数据
      const exportData = videos.value.map(video => ({
        ID: video.id,
        标题: video.title,
        作者: video.author,
        分类: video.category,
        状态: video.status,
        上传时间: formatDate(video.createdAt, 'YYYY-MM-DD HH:mm'),
        发布时间: video.publishedAt ? formatDate(video.publishedAt, 'YYYY-MM-DD HH:mm') : '',
        播放量: video.viewCount,
        点赞数: video.likeCount,
        评论数: video.commentCount
      }))

      // 转换为CSV格式
      const replacer = (key: string, value: any) => value === null ? '' : value
      const header = Object.keys(exportData[0])
      let csv = exportData.map(row => header.map(fieldName => 
        JSON.stringify(row[fieldName as keyof typeof row], replacer)).join(','))
      csv.unshift(header.join(','))
      const csvArray = csv.join('\r\n')

      // 创建下载链接
      const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `videos_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      message.success('视频列表导出成功')
    } catch (error) {
      console.error('导出失败:', error)
      message.error('导出失败')
    }
  }
</script>

<style scoped>
  .videos-page {
    padding: 16px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .page-title {
    margin: 0;
    font-size: 24px;
    line-height: 32px;
  }

  .filter-card {
    margin-bottom: 16px;
  }

  .filter-buttons {
    display: flex;
    gap: 8px;
  }

  .data-card {
    margin-bottom: 16px;
  }

  .video-preview {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .video-player-container {
    position: relative;
    width: 100%;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-thumbnail {
    width: 100%;
    display: block;
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
    color: #fff;
    opacity: 0.8;
    transition: all 0.2s;
  }

  .play-icon:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .video-info {
    padding: 0 8px;
  }

  .video-description {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
  }

  .video-meta {
    margin: 12px 0;
    color: #666;
    font-size: 13px;
  }

  .video-tags {
    margin: 12px 0;
  }

  .video-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
</style>