/**
* 管理后台视频详情页面
*
* 用于管理员查看和编辑视频详情
*/
<template>
  <div class="video-detail-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <div class="header-left">
        <n-button quaternary circle @click="goBack">
          <template #icon>
            <n-icon>
              <ArrowBackOutline />
            </n-icon>
          </template>
        </n-button>
        <h1 class="page-title">视频详情</h1>
      </div>
      <div class="header-actions">
        <n-space>
          <n-button type="primary" :loading="saving" @click="saveVideo">
            保存修改
          </n-button>
          <n-button :type="video.status === 'PENDING' ? 'success' : 'warning'" @click="handleStatusChange">
            {{ video.status === 'PENDING' ? '审核通过' : '撤回审核' }}
          </n-button>
          <n-button type="error" @click="showDeleteConfirm = true">
            删除视频
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 加载状态 -->
    <n-spin :show="loading">
      <template #description>
        加载视频数据中...
      </template>

      <div class="video-content">
        <!-- 视频预览和基本信息 -->
        <div class="video-preview-section">
          <n-card title="视频预览" class="preview-card">
            <div class="video-player">
              <img :src="video.thumbnailUrl" class="video-thumbnail" alt="视频缩略图" />
              <div class="video-player-overlay">
                <n-icon size="48" class="play-icon">
                  <PlayCircleOutline />
                </n-icon>
              </div>
            </div>
            <div class="video-meta">
              <n-tag :type="getStatusType(video.status)">
                {{ getStatusLabel(video.status) }}
              </n-tag>
              <div class="video-id">ID: {{ videoId }}</div>
              <div class="video-stats">
                <n-space>
                  <n-statistic label="观看数" :value="video.viewCount" />
                  <n-statistic label="点赞数" :value="video.likeCount" />
                  <n-statistic label="评论数" :value="video.commentCount" />
                </n-space>
              </div>
            </div>
          </n-card>

          <!-- 上传者信息 -->
          <n-card title="上传者信息" class="uploader-card">
            <div class="uploader-info">
              <n-avatar :src="video.authorAvatar" round size="large" />
              <div class="uploader-details">
                <div class="uploader-name">{{ video.author }}</div>
                <div class="uploader-actions">
                  <n-button size="small" @click="viewUserDetail">
                    查看用户资料
                  </n-button>
                </div>
              </div>
            </div>
            <n-divider />
            <n-descriptions :column="1" label-placement="left">
              <n-descriptions-item label="用户ID">{{ video.authorId }}</n-descriptions-item>
              <n-descriptions-item label="上传时间">{{ video.createdAt }}</n-descriptions-item>
              <n-descriptions-item label="发布时间">{{ video.publishedAt || '未发布' }}</n-descriptions-item>
            </n-descriptions>
          </n-card>
        </div>

        <!-- 视频编辑信息 -->
        <div class="video-edit-section">
          <n-card title="视频信息编辑" class="edit-card">
            <n-form ref="formRef" :model="editData" :rules="rules" label-placement="left" label-width="100px">
              <n-form-item label="视频标题" path="title">
                <n-input v-model:value="editData.title" placeholder="请输入视频标题" />
              </n-form-item>

              <n-form-item label="视频描述" path="description">
                <n-input v-model:value="editData.description" type="textarea" :rows="3" placeholder="请输入视频描述" />
              </n-form-item>

              <n-form-item label="视频标签" path="tags">
                <n-dynamic-tags v-model:value="editData.tags" :max="10" />
              </n-form-item>

              <n-form-item label="视频分类" path="category">
                <n-select v-model:value="editData.category" :options="categoryOptions" />
              </n-form-item>

              <n-form-item label="视频状态" path="status">
                <n-select v-model:value="editData.status" :options="statusOptions" />
              </n-form-item>

              <n-form-item label="可见性" path="visibility">
                <n-select v-model:value="editData.visibility" :options="visibilityOptions" />
              </n-form-item>

              <n-form-item label="是否推荐" path="isRecommended">
                <n-switch v-model:value="editData.isRecommended" />
              </n-form-item>
            </n-form>
          </n-card>

          <!-- 审核历史 -->
          <n-card title="审核历史" class="history-card">
            <n-empty v-if="auditLogs.length === 0" description="暂无审核记录" />
            <n-timeline v-else>
              <n-timeline-item v-for="log in auditLogs" :key="log.id"
                :type="log.action === 'APPROVE' ? 'success' : log.action === 'REJECT' ? 'error' : 'info'"
                :title="getAuditActionText(log.action)" :time="log.time">
                <div class="audit-log-content">
                  {{ log.comment || '无备注' }}
                </div>
                <div class="audit-log-operator">
                  操作人: {{ log.operator }}
                </div>
              </n-timeline-item>
            </n-timeline>
          </n-card>
        </div>
      </div>
    </n-spin>

    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteConfirm" preset="dialog" title="删除视频" positive-text="确认删除" negative-text="取消"
      @positive-click="deleteVideo" @negative-click="showDeleteConfirm = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要永久删除视频 <strong>{{ video.title }}</strong> 吗？此操作不可撤销。</div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    NButton,
    NCard,
    NSpin,
    NSpace,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NSwitch,
    NDynamicTags,
    NTag,
    NIcon,
    NAvatar,
    NDivider,
    NDescriptions,
    NDescriptionsItem,
    NStatistic,
    NTimeline,
    NTimelineItem,
    NEmpty,
    NModal,
    useMessage,
    FormInst,
    FormRules
  } from 'naive-ui'
  import {
    ArrowBackOutline,
    PlayCircleOutline,
    AlertCircleOutline
  } from '@vicons/ionicons5'

  // 路由和状态管理
  const route = useRoute()
  const router = useRouter()
  const message = useMessage()

  // 获取视频ID参数
  const videoId = route.params.id as string

  // 页面状态
  const loading = ref(true)
  const saving = ref(false)
  const showDeleteConfirm = ref(false)
  const formRef = ref<FormInst | null>(null)

  // 视频数据
  const video = reactive({
    id: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    author: '',
    authorId: '',
    authorAvatar: '',
    category: '',
    tags: [] as string[],
    status: '',
    visibility: '',
    duration: '',
    createdAt: '',
    publishedAt: '',
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    isRecommended: false
  })

  // 编辑表单数据
  const editData = reactive({
    title: '',
    description: '',
    tags: [] as string[],
    category: '',
    status: '',
    visibility: '',
    isRecommended: false
  })

  // 审核日志
  const auditLogs = ref<{
    id: string;
    action: 'APPROVE' | 'REJECT' | 'PENDING' | 'UPDATE';
    time: string;
    operator: string;
    comment?: string;
  }[]>([])

  // 表单验证规则
  const rules: FormRules = {
    title: [
      { required: true, message: '请输入视频标题', trigger: 'blur' }
    ],
    category: [
      { required: true, message: '请选择视频分类', trigger: 'change' }
    ],
    status: [
      { required: true, message: '请选择视频状态', trigger: 'change' }
    ],
    visibility: [
      { required: true, message: '请选择可见性', trigger: 'change' }
    ]
  }

  // 下拉选项
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

  const statusOptions = [
    { label: '待审核', value: 'PENDING' },
    { label: '已发布', value: 'PUBLISHED' },
    { label: '已拒绝', value: 'REJECTED' },
    { label: '草稿', value: 'DRAFT' }
  ]

  const visibilityOptions = [
    { label: '公开', value: 'PUBLIC' },
    { label: '私密', value: 'PRIVATE' },
    { label: '链接访问', value: 'UNLISTED' }
  ]

  // 获取视频状态标签类型
  function getStatusType(status: string) {
    const typeMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      'PUBLISHED': 'success',
      'PENDING': 'warning',
      'REJECTED': 'error',
      'DRAFT': 'info'
    }
    return typeMap[status] || 'default'
  }

  // 获取视频状态标签文本
  function getStatusLabel(status: string) {
    const labelMap: Record<string, string> = {
      'PUBLISHED': '已发布',
      'PENDING': '待审核',
      'REJECTED': '已拒绝',
      'DRAFT': '草稿'
    }
    return labelMap[status] || status
  }

  // 获取审核操作文本
  function getAuditActionText(action: string) {
    const actionMap: Record<string, string> = {
      'APPROVE': '审核通过',
      'REJECT': '审核拒绝',
      'PENDING': '提交审核',
      'UPDATE': '更新信息'
    }
    return actionMap[action] || action
  }

  // 返回上一页
  function goBack() {
    router.go(-1)
  }

  // 查看用户详情
  function viewUserDetail() {
    router.push(`/admin/users/${video.authorId}`)
  }

  // 处理状态变更
  function handleStatusChange() {
    if (video.status === 'PENDING') {
      editData.status = 'PUBLISHED'
      message.success('视频已审核通过')

      // 添加审核日志
      auditLogs.value.unshift({
        id: `log-${Date.now()}`,
        action: 'APPROVE',
        time: new Date().toISOString().split('.')[0].replace('T', ' '),
        operator: 'Admin',
        comment: '通过内容审核'
      })
    } else {
      editData.status = 'PENDING'
      message.info('视频已撤回审核')

      // 添加审核日志
      auditLogs.value.unshift({
        id: `log-${Date.now()}`,
        action: 'UPDATE',
        time: new Date().toISOString().split('.')[0].replace('T', ' '),
        operator: 'Admin',
        comment: '撤回审核状态'
      })
    }

    // 同步到视频对象
    video.status = editData.status
  }

  // 保存视频修改
  async function saveVideo() {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      saving.value = true

      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 更新视频对象
      Object.assign(video, editData)

      // 添加操作日志
      auditLogs.value.unshift({
        id: `log-${Date.now()}`,
        action: 'UPDATE',
        time: new Date().toISOString().split('.')[0].replace('T', ' '),
        operator: 'Admin',
        comment: '更新视频信息'
      })

      message.success('视频信息已保存')
    } catch (error) {
      console.error('保存视频失败:', error)
      message.error('保存视频失败')
    } finally {
      saving.value = false
    }
  }

  // 删除视频
  async function deleteVideo() {
    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      message.success('视频已删除')
      router.push('/admin/content/videos')
    } catch (error) {
      console.error('删除视频失败:', error)
      message.error('删除视频失败')
    }
  }

  // 加载视频数据
  async function loadVideoData() {
    loading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 模拟数据
      const mockVideo = {
        id: videoId,
        title: `测试视频 ${videoId}`,
        description: '这是一个测试视频描述，用于演示视频管理功能。这个视频包含了一些测试内容和特效，仅供管理员测试使用。',
        thumbnailUrl: `https://picsum.photos/id/${parseInt(videoId as string, 10) % 30 + 100}/640/360`,
        videoUrl: `https://example.com/videos/${videoId}`,
        author: `用户${Math.floor(Math.random() * 1000)}`,
        authorId: `user-${Math.floor(Math.random() * 1000)}`,
        authorAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        category: categoryOptions[Math.floor(Math.random() * categoryOptions.length)].value,
        tags: ['测试', '示例', 'Demo', '管理员测试'].slice(0, Math.floor(Math.random() * 4) + 1),
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)].value,
        visibility: visibilityOptions[Math.floor(Math.random() * visibilityOptions.length)].value,
        duration: '10:25',
        createdAt: '2025-04-10 14:30:45',
        publishedAt: Math.random() > 0.3 ? '2025-04-11 09:15:30' : '',
        viewCount: Math.floor(Math.random() * 10000),
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 200),
        isRecommended: Math.random() > 0.7
      }

      // 更新视频对象
      Object.assign(video, mockVideo)

      // 更新编辑表单数据
      Object.assign(editData, {
        title: mockVideo.title,
        description: mockVideo.description,
        tags: [...mockVideo.tags],
        category: mockVideo.category,
        status: mockVideo.status,
        visibility: mockVideo.visibility,
        isRecommended: mockVideo.isRecommended
      })

      // 模拟审核日志
      if (mockVideo.status !== 'DRAFT') {
        const mockLogs = []

        // 创建日志
        mockLogs.push({
          id: 'log-1',
          action: 'PENDING' as const,
          time: '2025-04-10 15:00:12',
          operator: mockVideo.author,
          comment: '提交视频审核'
        })

        if (mockVideo.status === 'PUBLISHED') {
          mockLogs.push({
            id: 'log-2',
            action: 'APPROVE' as const,
            time: '2025-04-10 16:45:30',
            operator: 'Admin',
            comment: '内容符合社区规范，审核通过'
          })
        } else if (mockVideo.status === 'REJECTED') {
          mockLogs.push({
            id: 'log-2',
            action: 'REJECT' as const,
            time: '2025-04-10 16:45:30',
            operator: 'Admin',
            comment: '内容不符合社区规范，拒绝发布'
          })
        }

        auditLogs.value = mockLogs
      }
    } catch (error) {
      console.error('加载视频数据失败:', error)
      message.error('加载视频数据失败')
    } finally {
      loading.value = false
    }
  }

  // 初始化
  onMounted(() => {
    loadVideoData()
  })
</script>

<style scoped>
  .video-detail-page {
    width: 100%;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .page-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 500;
  }

  .video-content {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
  }

  .video-preview-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .preview-card,
  .uploader-card,
  .edit-card,
  .history-card {
    margin-bottom: 24px;
  }

  .video-player {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
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

  .video-meta {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .video-id {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  .video-stats {
    margin-top: 8px;
  }

  .uploader-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .uploader-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .uploader-name {
    font-weight: 500;
    font-size: 1.1rem;
  }

  .uploader-actions {
    margin-top: 4px;
  }

  .audit-log-content {
    margin: 4px 0;
  }

  .audit-log-operator {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  @media (max-width: 1024px) {
    .video-content {
      grid-template-columns: 1fr;
    }

    .video-preview-section {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .header-actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>