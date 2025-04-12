/**
* 管理后台用户详情页面
*
* 展示用户详细信息及相关数据
*/
<template>
  <div class="user-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <n-button quaternary circle @click="goBack">
          <template #icon>
            <n-icon>
              <ArrowBackOutline />
            </n-icon>
          </template>
        </n-button>
        <h1 class="page-title">用户详情</h1>
      </div>
      <div class="header-actions">
        <n-space>
          <n-button :type="userInfo.status === 'ACTIVE' ? 'warning' : 'success'" @click="handleStatusChange">
            {{ userInfo.status === 'ACTIVE' ? '禁用用户' : '启用用户' }}
          </n-button>
          <n-button type="error" @click="showDeleteConfirm = true">
            删除用户
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 加载状态 -->
    <n-spin :show="loading">
      <template #description>
        加载用户数据中...
      </template>

      <!-- 用户基本信息卡片 -->
      <n-card class="user-info-card">
        <n-grid :cols="24" :x-gap="24">
          <!-- 用户头像和基本信息 -->
          <n-grid-item :span="6">
            <div class="user-avatar-container">
              <n-avatar round :size="120" :src="userInfo.avatar" fallback-src="https://i.pravatar.cc/300" />
              <div class="user-status">
                <n-tag :type="getStatusType(userInfo.status)">
                  {{ getStatusLabel(userInfo.status) }}
                </n-tag>
              </div>
              <div class="user-id">ID: {{ userId }}</div>
            </div>
          </n-grid-item>

          <!-- 用户详细信息 -->
          <n-grid-item :span="18">
            <div class="user-details">
              <div class="user-name">{{ userInfo.username }}</div>
              <div class="user-role">
                <n-tag :type="getRoleType(userInfo.role)">
                  {{ getRoleLabel(userInfo.role) }}
                </n-tag>
              </div>

              <n-descriptions :column="2" label-placement="left" bordered>
                <n-descriptions-item label="邮箱">
                  {{ userInfo.email }}
                </n-descriptions-item>
                <n-descriptions-item label="手机">
                  {{ userInfo.phone || '未设置' }}
                </n-descriptions-item>
                <n-descriptions-item label="注册时间">
                  {{ userInfo.createdAt }}
                </n-descriptions-item>
                <n-descriptions-item label="最后登录">
                  {{ userInfo.lastLogin }}
                </n-descriptions-item>
                <n-descriptions-item label="IP地址">
                  {{ userInfo.lastIp || '未记录' }}
                </n-descriptions-item>
                <n-descriptions-item label="地区">
                  {{ userInfo.region || '未知' }}
                </n-descriptions-item>
              </n-descriptions>
            </div>
          </n-grid-item>
        </n-grid>
      </n-card>

      <!-- 用户内容数据统计 -->
      <n-card title="用户数据统计" class="stats-card">
        <n-grid :cols="24" :x-gap="12" :y-gap="12">
          <n-grid-item :span="6">
            <n-statistic label="视频数量">
              <template #value>
                <n-number-animation ref="videoCount" :from="0" :to="userStats.videoCount" :duration="1000" />
              </template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item :span="6">
            <n-statistic label="评论数量">
              <template #value>
                <n-number-animation ref="commentCount" :from="0" :to="userStats.commentCount" :duration="1000" />
              </template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item :span="6">
            <n-statistic label="获赞数">
              <template #value>
                <n-number-animation ref="likeCount" :from="0" :to="userStats.likeCount" :duration="1000" />
              </template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item :span="6">
            <n-statistic label="粉丝数">
              <template #value>
                <n-number-animation ref="followerCount" :from="0" :to="userStats.followerCount" :duration="1000" />
              </template>
            </n-statistic>
          </n-grid-item>
        </n-grid>
      </n-card>

      <!-- 用户标签页内容 -->
      <n-card class="tabs-card">
        <n-tabs type="line" animated>
          <!-- 用户视频标签页 -->
          <n-tab-pane name="videos" tab="用户视频">
            <n-data-table :columns="videoColumns" :data="userVideos" :pagination="videoPagination" :bordered="false" />
          </n-tab-pane>

          <!-- 用户评论标签页 -->
          <n-tab-pane name="comments" tab="用户评论">
            <n-data-table :columns="commentColumns" :data="userComments" :pagination="commentPagination"
              :bordered="false" />
          </n-tab-pane>

          <!-- 用户活动记录标签页 -->
          <n-tab-pane name="activities" tab="活动记录">
            <n-timeline>
              <n-timeline-item v-for="activity in userActivities" :key="activity.id"
                :type="getActivityType(activity.type)" :title="activity.title" :time="activity.time"
                :content="activity.content" />
            </n-timeline>
          </n-tab-pane>

          <!-- 用户操作记录标签页 -->
          <n-tab-pane name="logs" tab="操作日志">
            <n-data-table :columns="logColumns" :data="userLogs" :pagination="logPagination" :bordered="false" />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-spin>

    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteConfirm" preset="dialog" title="删除用户" positive-text="确认删除" negative-text="取消"
      @positive-click="deleteUser" @negative-click="showDeleteConfirm = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要永久删除用户 <strong>{{ userInfo.username }}</strong> 吗？此操作不可撤销，用户所有数据将被删除。</div>
    </n-modal>

    <!-- 状态修改确认对话框 -->
    <n-modal v-model:show="showStatusConfirm" preset="dialog" :title="userInfo.status === 'ACTIVE' ? '禁用用户' : '启用用户'"
      positive-text="确认" negative-text="取消" @positive-click="changeUserStatus"
      @negative-click="showStatusConfirm = false">
      <template #icon>
        <n-icon>
          <component :is="userInfo.status === 'ACTIVE' ? LockClosedOutline : LockOpenOutline" />
        </n-icon>
      </template>
      <div>确认要{{ userInfo.status === 'ACTIVE' ? '禁用' : '启用' }}用户 <strong>{{ userInfo.username }}</strong> 吗？</div>
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
    NAvatar,
    NTag,
    NDescriptions,
    NDescriptionsItem,
    NTabs,
    NTabPane,
    NDataTable,
    NTimeline,
    NTimelineItem,
    NIcon,
    NSpace,
    NGrid,
    NGridItem,
    NStatistic,
    NNumberAnimation,
    NModal,
    useMessage
  } from 'naive-ui'
  import {
    ArrowBackOutline,
    AlertCircleOutline,
    LockClosedOutline,
    LockOpenOutline,
    VideocamOutline,
    ChatboxOutline,
    LogOutOutline,
    PersonOutline,
    ThumbsUpOutline,
    CreateOutline,
    AlertOutline,
    TimeOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'

  // 路由和状态管理
  const route = useRoute()
  const router = useRouter()
  const message = useMessage()

  // 获取用户ID参数
  const userId = route.params.id as string

  // 页面状态
  const loading = ref(true)
  const showDeleteConfirm = ref(false)
  const showStatusConfirm = ref(false)

  // 用户信息
  const userInfo = reactive({
    id: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    createdAt: '',
    lastLogin: '',
    lastIp: '',
    region: '',
    avatar: ''
  })

  // 用户统计数据
  const userStats = reactive({
    videoCount: 0,
    commentCount: 0,
    likeCount: 0,
    followerCount: 0
  })

  // 用户视频数据
  const userVideos = ref([])
  const videoColumns = ref<DataTableColumns>([
    { title: '视频ID', key: 'id', width: 80 },
    { title: '视频标题', key: 'title', width: 200 },
    { title: '发布时间', key: 'publishedAt', width: 150 },
    { title: '观看数', key: 'viewCount', width: 100 },
    { title: '点赞数', key: 'likeCount', width: 100 },
    { title: '评论数', key: 'commentCount', width: 100 },
    { title: '状态', key: 'status', width: 100 }
  ])
  const videoPagination = reactive({
    page: 1,
    pageSize: 5,
    itemCount: 0,
    showSizePicker: false
  })

  // 用户评论数据
  const userComments = ref([])
  const commentColumns = ref<DataTableColumns>([
    { title: '评论ID', key: 'id', width: 80 },
    { title: '评论内容', key: 'content', width: 300 },
    { title: '视频', key: 'videoTitle', width: 200 },
    { title: '评论时间', key: 'createdAt', width: 150 },
    { title: '点赞数', key: 'likeCount', width: 100 }
  ])
  const commentPagination = reactive({
    page: 1,
    pageSize: 5,
    itemCount: 0,
    showSizePicker: false
  })

  // 用户活动数据
  const userActivities = ref([])

  // 用户日志数据
  const userLogs = ref([])
  const logColumns = ref<DataTableColumns>([
    { title: '时间', key: 'timestamp', width: 150 },
    { title: '操作', key: 'action', width: 150 },
    { title: '详情', key: 'details', width: 300 },
    { title: 'IP地址', key: 'ip', width: 150 }
  ])
  const logPagination = reactive({
    page: 1,
    pageSize: 5,
    itemCount: 0,
    showSizePicker: false
  })

  // 获取用户状态标签类型
  function getStatusType(status: string) {
    const typeMap: Record<string, 'success' | 'warning' | 'error'> = {
      'ACTIVE': 'success',
      'INACTIVE': 'warning',
      'BANNED': 'error'
    }
    return typeMap[status] || 'default'
  }

  // 获取用户状态标签文本
  function getStatusLabel(status: string) {
    const labelMap: Record<string, string> = {
      'ACTIVE': '已激活',
      'INACTIVE': '未激活',
      'BANNED': '已禁用'
    }
    return labelMap[status] || status
  }

  // 获取用户角色标签类型
  function getRoleType(role: string) {
    const typeMap: Record<string, 'default' | 'primary' | 'info' | 'success'> = {
      'USER': 'default',
      'CREATOR': 'info',
      'ADMIN': 'primary',
      'MODERATOR': 'success'
    }
    return typeMap[role] || 'default'
  }

  // 获取用户角色标签文本
  function getRoleLabel(role: string) {
    const labelMap: Record<string, string> = {
      'USER': '普通用户',
      'CREATOR': '创作者',
      'ADMIN': '管理员',
      'MODERATOR': '内容审核员'
    }
    return labelMap[role] || role
  }

  // 获取活动类型
  function getActivityType(type: string) {
    const typeMap: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
      'LOGIN': 'info',
      'UPLOAD': 'success',
      'COMMENT': 'default',
      'LIKE': 'info',
      'FOLLOW': 'success',
      'REPORT': 'warning',
      'WARNING': 'error'
    }
    return typeMap[type] || 'default'
  }

  // 返回上一页
  function goBack() {
    router.go(-1)
  }

  // 处理用户状态变更
  function handleStatusChange() {
    showStatusConfirm.value = true
  }

  // 确认用户状态变更
  async function changeUserStatus() {
    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    const newStatus = userInfo.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE'
    userInfo.status = newStatus

    message.success(`用户${newStatus === 'ACTIVE' ? '启用' : '禁用'}成功`)
  }

  // 删除用户
  async function deleteUser() {
    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    message.success(`用户${userInfo.username}已删除`)
    router.push('/admin/users/list')
  }

  // 加载用户数据
  async function loadUserData() {
    loading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成模拟用户数据
      Object.assign(userInfo, {
        id: userId,
        username: `用户${userId}`,
        email: `user${userId}@example.com`,
        phone: '13800138000',
        role: ['USER', 'CREATOR', 'MODERATOR', 'ADMIN'][Math.floor(Math.random() * 4)],
        status: ['ACTIVE', 'INACTIVE', 'BANNED'][Math.floor(Math.random() * 3)],
        createdAt: '2025-01-15',
        lastLogin: '2025-04-10',
        lastIp: '192.168.1.1',
        region: '中国',
        avatar: `https://i.pravatar.cc/300?img=${parseInt(userId as string) % 70}`
      })

      // 生成统计数据
      Object.assign(userStats, {
        videoCount: Math.floor(Math.random() * 50),
        commentCount: Math.floor(Math.random() * 200),
        likeCount: Math.floor(Math.random() * 1000),
        followerCount: Math.floor(Math.random() * 500)
      })

      // 生成视频数据
      const videos = []
      for (let i = 0; i < 10; i++) {
        videos.push({
          id: `v${i + 1}`,
          title: `视频标题 ${i + 1}`,
          publishedAt: '2025-03-15',
          viewCount: Math.floor(Math.random() * 1000),
          likeCount: Math.floor(Math.random() * 100),
          commentCount: Math.floor(Math.random() * 50),
          status: ['PUBLISHED', 'DRAFT', 'PRIVATE'][Math.floor(Math.random() * 3)]
        })
      }
      userVideos.value = videos
      videoPagination.itemCount = videos.length

      // 生成评论数据
      const comments = []
      for (let i = 0; i < 15; i++) {
        comments.push({
          id: `c${i + 1}`,
          content: `这是评论内容 ${i + 1}，用于测试展示。`,
          videoTitle: `视频标题 ${Math.floor(Math.random() * 10) + 1}`,
          createdAt: '2025-04-01',
          likeCount: Math.floor(Math.random() * 20)
        })
      }
      userComments.value = comments
      commentPagination.itemCount = comments.length

      // 生成活动数据
      const activities = []
      const activityTypes = ['LOGIN', 'UPLOAD', 'COMMENT', 'LIKE', 'FOLLOW', 'REPORT', 'WARNING']
      const activityTitles = {
        'LOGIN': '用户登录',
        'UPLOAD': '上传视频',
        'COMMENT': '发表评论',
        'LIKE': '点赞内容',
        'FOLLOW': '关注用户',
        'REPORT': '举报内容',
        'WARNING': '收到警告'
      }

      for (let i = 0; i < 10; i++) {
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
        activities.push({
          id: i + 1,
          type: type,
          title: activityTitles[type],
          time: '2025-04-10',
          content: `用户${type === 'LOGIN' ? '登录了系统' : type === 'UPLOAD' ? '上传了新视频' : type === 'COMMENT' ? '评论了视频' : type === 'LIKE' ? '点赞了视频' : type === 'FOLLOW' ? '关注了创作者' : type === 'REPORT' ? '举报了不当内容' : '收到了系统警告'}`
        })
      }
      userActivities.value = activities

      // 生成日志数据
      const logs = []
      const logActions = ['登录', '登出', '修改资料', '上传视频', '删除视频', '评论']

      for (let i = 0; i < 20; i++) {
        const action = logActions[Math.floor(Math.random() * logActions.length)]
        logs.push({
          id: `log${i + 1}`,
          timestamp: '2025-04-10 12:30:45',
          action: action,
          details: `用户进行了${action}操作`,
          ip: '192.168.1.1'
        })
      }
      userLogs.value = logs
      logPagination.itemCount = logs.length
    } catch (error) {
      console.error('加载用户数据失败:', error)
      message.error('加载用户数据失败')
    } finally {
      loading.value = false
    }
  }

  // 页面挂载时加载数据
  onMounted(() => {
    loadUserData()
  })
</script>

<style scoped>
  .user-detail-page {
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

  .user-info-card,
  .stats-card,
  .tabs-card {
    margin-bottom: 24px;
  }

  .user-avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .user-status {
    margin-top: 8px;
  }

  .user-id {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  .user-details {
    height: 100%;
  }

  .user-name {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .user-role {
    margin-bottom: 16px;
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
      justify-content: space-between;
    }
  }
</style>