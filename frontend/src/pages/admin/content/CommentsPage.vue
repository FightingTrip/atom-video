/**
* 管理后台评论管理页面
*
* 用于管理员查看、审核和管理用户评论
*/
<template>
  <div class="comments-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">评论管理</h1>
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
          <n-button @click="batchDelete" :disabled="checkedRowKeys.length === 0">
            <template #icon>
              <n-icon>
                <TrashOutline />
              </n-icon>
            </template>
            批量删除
          </n-button>
        </n-button-group>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <n-card class="filter-card">
      <n-grid :cols="24" :x-gap="12">
        <n-grid-item :span="6">
          <n-input v-model:value="searchQuery" placeholder="搜索评论内容/用户名">
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="statusFilter" :options="statusOptions" placeholder="评论状态" clearable />
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="videoFilter" :options="videoOptions" placeholder="视频筛选" clearable />
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
      <n-data-table ref="table" :columns="columns" :data="comments" :pagination="pagination" :loading="loading"
        :row-key="row => row.id" @update:checked-row-keys="handleCheck" @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange" @update:sorter="handleSorterChange" />
    </n-card>

    <!-- 评论详情抽屉 -->
    <n-drawer v-model:show="showDetail" :width="500" placement="right">
      <n-drawer-content :title="`评论详情 - ID: ${currentComment?.id || ''}`">
        <div v-if="currentComment" class="comment-detail">
          <div class="comment-video">
            <h3>所属视频</h3>
            <n-card size="small" class="video-card">
              <div class="video-info">
                <img :src="currentComment.videoThumbnail" class="video-thumbnail" alt="视频缩略图" />
                <div class="video-meta">
                  <div class="video-title">{{ currentComment.videoTitle }}</div>
                  <div class="video-author">上传者: {{ currentComment.videoAuthor }}</div>
                </div>
              </div>
              <n-button size="small" @click="viewVideo(currentComment.videoId)">查看视频</n-button>
            </n-card>
          </div>

          <div class="comment-user">
            <h3>评论用户</h3>
            <n-card size="small" class="user-card">
              <div class="user-info">
                <n-avatar :src="currentComment.userAvatar" round size="medium" />
                <div class="user-meta">
                  <div class="user-name">{{ currentComment.userName }}</div>
                  <div class="user-id">ID: {{ currentComment.userId }}</div>
                </div>
              </div>
              <n-button size="small" @click="viewUser(currentComment.userId)">查看用户</n-button>
            </n-card>
          </div>

          <div class="comment-content">
            <h3>评论内容</h3>
            <n-card size="small" class="content-card">
              <div class="content-text">{{ currentComment.content }}</div>
              <div class="content-meta">
                <div class="content-time">发布时间: {{ currentComment.createdAt }}</div>
                <div class="content-likes">点赞数: {{ currentComment.likeCount }}</div>
              </div>
            </n-card>
          </div>

          <div class="comment-actions">
            <h3>操作</h3>
            <n-card size="small" class="actions-card">
              <n-space>
                <n-button type="primary" @click="approveComment(currentComment)"
                  :disabled="currentComment.status === 'APPROVED'">
                  通过审核
                </n-button>
                <n-button type="warning" @click="rejectComment(currentComment)"
                  :disabled="currentComment.status === 'REJECTED'">
                  拒绝评论
                </n-button>
                <n-button type="error" @click="deleteCommentModal(currentComment)">删除评论</n-button>
              </n-space>
            </n-card>
          </div>

          <div class="comment-replies" v-if="currentComment.replies && currentComment.replies.length > 0">
            <h3>回复列表</h3>
            <n-list>
              <n-list-item v-for="reply in currentComment.replies" :key="reply.id">
                <n-thing :title="reply.userName" :description="reply.createdAt">
                  {{ reply.content }}
                </n-thing>
              </n-list-item>
            </n-list>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>

    <!-- 删除评论确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="删除评论" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="showDeleteModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除该评论吗？此操作不可逆。</div>
      <div class="delete-comment-content">
        {{ deleteComment?.content }}
      </div>
    </n-modal>

    <!-- 批量删除确认对话框 -->
    <n-modal v-model:show="showBatchDeleteModal" preset="dialog" title="批量删除评论" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmBatchDelete" @negative-click="showBatchDeleteModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除选中的 <strong>{{ checkedRowKeys.length }}</strong> 条评论吗？此操作不可逆。</div>
    </n-modal>

    <!-- 评论审核原因对话框 -->
    <n-modal v-model:show="showRejectModal" preset="card" title="拒绝评论" style="width: 500px">
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
    NDrawer,
    NDrawerContent,
    NAvatar,
    NList,
    NListItem,
    NThing
  } from 'naive-ui'
  import {
    ReloadOutline,
    SearchOutline,
    EyeOutline,
    TrashOutline,
    AlertCircleOutline,
    CheckmarkCircleOutline,
    CloseCircleOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'
  import type { FormInst } from 'naive-ui'

  // 评论数据类型
  interface Comment {
    id: string
    content: string
    userId: string
    userName: string
    userAvatar: string
    videoId: string
    videoTitle: string
    videoAuthor: string
    videoThumbnail: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    likeCount: number
    createdAt: string
    replies?: {
      id: string
      content: string
      userId: string
      userName: string
      createdAt: string
    }[]
  }

  // 路由
  const router = useRouter()
  const message = useMessage()

  // 搜索筛选状态
  const searchQuery = ref('')
  const statusFilter = ref(null)
  const videoFilter = ref(null)
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
      return `共 ${itemCount} 条评论`
    }
  })

  // 选中行
  const checkedRowKeys = ref<string[]>([])

  // 评论列表数据
  const comments = ref<Comment[]>([])

  // 详情查看
  const showDetail = ref(false)
  const currentComment = ref<Comment | null>(null)

  // 删除状态
  const showDeleteModal = ref(false)
  const deleteComment = ref<Comment | null>(null)
  const showBatchDeleteModal = ref(false)

  // 拒绝评论
  const showRejectModal = ref(false)
  const rejectComment = ref<Comment | null>(null)
  const rejectForm = ref<FormInst | null>(null)
  const rejectData = reactive({
    reason: '',
    comment: ''
  })

  // 筛选选项
  const statusOptions = [
    { label: '待审核', value: 'PENDING' },
    { label: '已通过', value: 'APPROVED' },
    { label: '已拒绝', value: 'REJECTED' }
  ]

  // 视频筛选选项（模拟数据）
  const videoOptions = [
    { label: '热门视频', value: 'hot' },
    { label: '最新视频', value: 'new' },
    { label: '推荐视频', value: 'recommended' }
  ]

  // 拒绝原因
  const rejectReasons = [
    { label: '垃圾评论', value: 'SPAM' },
    { label: '违反社区规范', value: 'VIOLATION' },
    { label: '包含不适当内容', value: 'INAPPROPRIATE' },
    { label: '骚扰/仇恨言论', value: 'HARASSMENT' },
    { label: '其他原因', value: 'OTHER' }
  ]

  // 渲染评论状态标签
  function renderStatus(status: string) {
    const statusMap: Record<string, { type: 'success' | 'warning' | 'error', text: string }> = {
      'APPROVED': { type: 'success', text: '已通过' },
      'PENDING': { type: 'warning', text: '待审核' },
      'REJECTED': { type: 'error', text: '已拒绝' }
    }

    const info = statusMap[status] || { type: 'default', text: status }

    return h(NTag, { type: info.type, size: 'small' }, { default: () => info.text })
  }

  // 表格列配置
  const columns = ref<DataTableColumns<Comment>>([
    {
      type: 'selection',
      fixed: 'left'
    },
    {
      title: '评论内容',
      key: 'content',
      width: 250,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '用户',
      key: 'userName',
      width: 120
    },
    {
      title: '视频',
      key: 'videoTitle',
      width: 200,
      ellipsis: {
        tooltip: true
      }
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
      title: '点赞数',
      key: 'likeCount',
      width: 80,
      sorter: 'default'
    },
    {
      title: '发布时间',
      key: 'createdAt',
      width: 150,
      sorter: 'default'
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render(row) {
        return h(NSpace, { align: 'center' }, {
          default: () => [
            // 查看按钮
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => viewDetail(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(EyeOutline) }) }
            ),
            // 通过按钮
            row.status === 'PENDING' ? h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => approveComment(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(CheckmarkCircleOutline) }) }
            ) : null,
            // 拒绝按钮
            row.status === 'PENDING' ? h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => handleRejectComment(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(CloseCircleOutline) }) }
            ) : null,
            // 删除按钮
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => deleteCommentModal(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
            )
          ].filter(Boolean)
        })
      }
    }
  ])

  // 加载评论数据
  async function loadComments() {
    loading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成模拟数据
      const mockComments: Comment[] = Array.from({ length: 100 }, (_, index) => {
        const id = `comment-${index + 1}`.padStart(8, '0')
        const statusOptions = ['APPROVED', 'PENDING', 'PENDING', 'REJECTED']
        const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
        const videoTitles = [
          '2023年度最佳游戏评测',
          '如何在30天内学会弹吉他',
          '美食vlog：探秘成都小吃',
          '编程教程：Vue.js入门到精通',
          '旅行记录：云南行摄影集'
        ]

        // 随机日期生成
        const createdDate = new Date()
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30))
        const createdAtStr = createdDate.toISOString().split('.')[0].replace('T', ' ')

        // 随机回复生成
        const hasReplies = Math.random() > 0.7
        const replies = hasReplies ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, replyIndex) => ({
          id: `reply-${id}-${replyIndex}`,
          content: `这是对评论 ${id} 的回复，回复内容 ${replyIndex + 1}`,
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          userName: userNames[Math.floor(Math.random() * userNames.length)],
          createdAt: new Date(createdDate.getTime() + (replyIndex + 1) * 3600000).toISOString().split('.')[0].replace('T', ' ')
        })) : []

        return {
          id,
          content: `这是测试评论${index + 1}，评论内容包含一些随机的文字，用于测试评论管理功能。${Math.random() > 0.7 ? '这个评论比较长，包含了更多的文字内容，用于测试内容省略功能。' : ''}`,
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          userName: userNames[Math.floor(Math.random() * userNames.length)],
          userAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          videoId: `video-${Math.floor(Math.random() * 100)}`,
          videoTitle: videoTitles[Math.floor(Math.random() * videoTitles.length)],
          videoAuthor: userNames[Math.floor(Math.random() * userNames.length)],
          videoThumbnail: `https://picsum.photos/id/${index % 30 + 100}/320/180`,
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          likeCount: Math.floor(Math.random() * 50),
          createdAt: createdAtStr,
          replies: replies.length > 0 ? replies : undefined
        }
      })

      // 过滤和排序
      let filteredComments = [...mockComments]

      // 应用搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filteredComments = filteredComments.filter(comment =>
          comment.content.toLowerCase().includes(query) ||
          comment.userName.toLowerCase().includes(query)
        )
      }

      // 应用状态过滤
      if (statusFilter.value) {
        filteredComments = filteredComments.filter(comment => comment.status === statusFilter.value)
      }

      // 应用视频过滤
      if (videoFilter.value) {
        // 这里是模拟过滤，实际项目中应该有更精确的筛选逻辑
        filteredComments = filteredComments.filter(() => Math.random() > 0.5)
      }

      // 应用日期过滤
      if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        const startDate = new Date(dateRange.value[0])
        const endDate = new Date(dateRange.value[1])

        filteredComments = filteredComments.filter(comment => {
          const createdDate = new Date(comment.createdAt)
          return createdDate >= startDate && createdDate <= endDate
        })
      }

      // 设置总数
      pagination.itemCount = filteredComments.length

      // 分页
      const start = (pagination.page - 1) * pagination.pageSize
      const paginatedComments = filteredComments.slice(start, start + pagination.pageSize)

      comments.value = paginatedComments
    } catch (error) {
      console.error('加载评论数据失败:', error)
      message.error('加载评论数据失败')
    } finally {
      loading.value = false
    }
  }

  // 处理表格选择变更
  function handleCheck(keys: string[]) {
    checkedRowKeys.value = keys
  }

  // 搜索处理
  function handleSearch() {
    pagination.page = 1
    loadComments()
  }

  // 重置过滤器
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = null
    videoFilter.value = null
    dateRange.value = null
    pagination.page = 1
    loadComments()
  }

  // 分页变化
  function handlePageChange(page: number) {
    pagination.page = page
    loadComments()
  }

  // 每页条数变化
  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadComments()
  }

  // 排序变化
  function handleSorterChange() {
    loadComments()
  }

  // 刷新数据
  function refreshData() {
    loadComments()
  }

  // 查看评论详情
  function viewDetail(comment: Comment) {
    currentComment.value = comment
    showDetail.value = true
  }

  // 查看视频
  function viewVideo(videoId: string) {
    router.push(`/admin/content/videos/${videoId}`)
  }

  // 查看用户
  function viewUser(userId: string) {
    router.push(`/admin/users/${userId}`)
  }

  // 通过评论
  async function approveComment(comment: Comment) {
    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = comments.value.findIndex(c => c.id === comment.id)
      if (index !== -1) {
        comments.value[index].status = 'APPROVED'
        // 如果当前详情显示的是这条评论，更新当前评论
        if (currentComment.value && currentComment.value.id === comment.id) {
          currentComment.value.status = 'APPROVED'
        }
      }

      message.success('评论已通过审核')
    } catch (error) {
      console.error('通过评论失败:', error)
      message.error('操作失败')
    }
  }

  // 打开拒绝评论对话框
  function handleRejectComment(comment: Comment) {
    rejectComment.value = comment
    rejectData.reason = ''
    rejectData.comment = ''
    showRejectModal.value = true
  }

  // 确认拒绝评论
  async function confirmReject() {
    if (!rejectComment.value) return

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = comments.value.findIndex(c => c.id === rejectComment.value?.id)
      if (index !== -1) {
        comments.value[index].status = 'REJECTED'
        // 如果当前详情显示的是这条评论，更新当前评论
        if (currentComment.value && currentComment.value.id === rejectComment.value.id) {
          currentComment.value.status = 'REJECTED'
        }
      }

      message.success('评论已拒绝')
      showRejectModal.value = false
      rejectComment.value = null
    } catch (error) {
      console.error('拒绝评论失败:', error)
      message.error('操作失败')
    }
  }

  // 打开删除评论对话框
  function deleteCommentModal(comment: Comment) {
    deleteComment.value = comment
    showDeleteModal.value = true
  }

  // 确认删除单条评论
  async function confirmDelete() {
    if (!deleteComment.value) return

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从列表中删除
      comments.value = comments.value.filter(c => c.id !== deleteComment.value?.id)

      // 如果在详情中，关闭详情
      if (currentComment.value && currentComment.value.id === deleteComment.value.id) {
        showDetail.value = false
        currentComment.value = null
      }

      message.success('评论已删除')
      showDeleteModal.value = false
      deleteComment.value = null
    } catch (error) {
      console.error('删除评论失败:', error)
      message.error('删除失败')
    }
  }

  // 批量删除对话框
  function batchDelete() {
    if (checkedRowKeys.value.length === 0) {
      message.warning('请选择要删除的评论')
      return
    }

    showBatchDeleteModal.value = true
  }

  // 确认批量删除
  async function confirmBatchDelete() {
    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从列表中删除选中的评论
      comments.value = comments.value.filter(c => !checkedRowKeys.value.includes(c.id))

      // 如果当前详情显示的评论在删除列表中，关闭详情
      if (currentComment.value && checkedRowKeys.value.includes(currentComment.value.id)) {
        showDetail.value = false
        currentComment.value = null
      }

      message.success(`已删除${checkedRowKeys.value.length}条评论`)
      showBatchDeleteModal.value = false
      checkedRowKeys.value = []
    } catch (error) {
      console.error('批量删除评论失败:', error)
      message.error('批量删除失败')
    }
  }

  // 初始化
  onMounted(() => {
    loadComments()
  })
</script>

<style scoped>
  .comments-page {
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

  .comment-detail {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .video-card,
  .user-card,
  .content-card,
  .actions-card {
    margin-top: 8px;
  }

  .video-info {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .video-thumbnail {
    width: 120px;
    height: 68px;
    object-fit: cover;
    border-radius: 4px;
  }

  .video-meta,
  .user-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .video-title {
    font-weight: 500;
  }

  .video-author,
  .user-id {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
  }

  .user-info {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  .user-name {
    font-weight: 500;
  }

  .content-text {
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .content-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--text-color-secondary);
  }

  .delete-comment-content {
    margin-top: 12px;
    padding: 12px;
    background-color: var(--card-color);
    border-radius: 4px;
    font-style: italic;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 500;
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