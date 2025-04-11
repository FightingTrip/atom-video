/**
* 管理后台举报处理页面
*
* 用于管理员处理用户举报内容
*/
<template>
  <div class="reports-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">举报处理</h1>
      <div class="page-actions">
        <n-button @click="refreshData">
          <template #icon>
            <n-icon>
              <ReloadOutline />
            </n-icon>
          </template>
          刷新
        </n-button>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <n-card class="filter-card">
      <n-grid :cols="4" :x-gap="12">
        <n-grid-item>
          <n-select v-model:value="filterOptions.status" placeholder="处理状态" :options="statusOptions" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-select v-model:value="filterOptions.type" placeholder="举报类型" :options="typeOptions" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-date-picker v-model:value="filterOptions.dateRange" type="daterange" clearable placeholder="举报时间范围"
            style="width: 100%" />
        </n-grid-item>
        <n-grid-item>
          <n-button type="primary" block @click="applyFilters">应用筛选</n-button>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 举报数据表格 -->
    <n-card>
      <n-tabs v-model:value="currentTab" type="line">
        <n-tab-pane name="pending" tab="待处理">
          <n-data-table ref="pendingTable" :columns="columns" :data="pendingReports" :loading="loading"
            :pagination="pagination" :row-key="row => row.id" @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange" :scroll-x="1200" />
        </n-tab-pane>
        <n-tab-pane name="processed" tab="已处理">
          <n-data-table ref="processedTable" :columns="columns" :data="processedReports" :loading="loading"
            :pagination="pagination" :row-key="row => row.id" @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange" :scroll-x="1200" />
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- 举报详情模态框 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="举报详情" style="width: 700px">
      <template v-if="currentReport">
        <div class="report-detail">
          <div class="report-header">
            <n-descriptions label-placement="left" :column="2" bordered>
              <n-descriptions-item label="举报ID">
                {{ currentReport.id }}
              </n-descriptions-item>
              <n-descriptions-item label="举报时间">
                {{ currentReport.createdAt }}
              </n-descriptions-item>
              <n-descriptions-item label="举报类型">
                {{ getReportTypeName(currentReport.type) }}
              </n-descriptions-item>
              <n-descriptions-item label="状态">
                <n-tag :type="getStatusType(currentReport.status)">
                  {{ getStatusName(currentReport.status) }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="举报人">
                <div class="user-info">
                  <n-avatar size="small" :src="currentReport.reporter.avatarUrl" />
                  <span>{{ currentReport.reporter.username }}</span>
                </div>
              </n-descriptions-item>
              <n-descriptions-item label="处理人" v-if="currentReport.handler">
                <div class="user-info">
                  <n-avatar size="small" :src="currentReport.handler.avatarUrl" />
                  <span>{{ currentReport.handler.username }}</span>
                </div>
              </n-descriptions-item>
            </n-descriptions>
          </div>

          <n-divider title-placement="left">举报内容</n-divider>

          <div class="report-content">
            <n-card title="举报原因" size="small">
              <p>{{ currentReport.reason }}</p>
            </n-card>

            <n-card title="被举报内容" size="small" class="mt-4">
              <div v-if="currentReport.contentType === 'VIDEO'" class="reported-content">
                <div class="video-info">
                  <n-image width="120" :src="currentReport.targetContent.thumbnailUrl"
                    fallback-src="/placeholder-thumbnail.jpg" />
                  <div class="video-details">
                    <h3>{{ currentReport.targetContent.title }}</h3>
                    <p>上传者: {{ currentReport.targetContent.uploader }}</p>
                    <p>上传时间: {{ currentReport.targetContent.createdAt }}</p>
                  </div>
                </div>
              </div>
              <div v-else-if="currentReport.contentType === 'COMMENT'" class="reported-content">
                <div class="comment-info">
                  <p><strong>评论内容:</strong> {{ currentReport.targetContent.content }}</p>
                  <p>评论者: {{ currentReport.targetContent.commenter }}</p>
                  <p>评论时间: {{ currentReport.targetContent.createdAt }}</p>
                </div>
              </div>
              <div v-else-if="currentReport.contentType === 'USER'" class="reported-content">
                <div class="user-info-large">
                  <n-avatar :size="48" :src="currentReport.targetContent.avatarUrl" />
                  <div class="user-details">
                    <h3>{{ currentReport.targetContent.username }}</h3>
                    <p>注册时间: {{ currentReport.targetContent.createdAt }}</p>
                  </div>
                </div>
              </div>
            </n-card>
          </div>

          <n-divider title-placement="left">处理结果</n-divider>

          <div v-if="currentReport.status === 'PENDING'" class="report-action">
            <n-form ref="actionForm" :model="actionData" :rules="actionRules" label-placement="left" label-width="80px">
              <n-form-item label="处理结果" path="action">
                <n-radio-group v-model:value="actionData.action">
                  <n-space>
                    <n-radio value="APPROVE">属实并处理</n-radio>
                    <n-radio value="REJECT">驳回举报</n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
              <n-form-item label="处理备注" path="note">
                <n-input v-model:value="actionData.note" type="textarea" placeholder="请输入处理备注" />
              </n-form-item>
            </n-form>
            <div class="action-buttons">
              <n-button type="primary" @click="handleReportAction" :loading="submitting">提交处理结果</n-button>
            </div>
          </div>
          <div v-else class="report-result">
            <n-descriptions label-placement="left" bordered>
              <n-descriptions-item label="处理结果">
                <n-tag :type="currentReport.result === 'APPROVE' ? 'success' : 'error'">
                  {{ currentReport.result === 'APPROVE' ? '属实并处理' : '驳回举报' }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="处理时间">
                {{ currentReport.processedAt }}
              </n-descriptions-item>
              <n-descriptions-item label="处理备注" span="2">
                {{ currentReport.note || '无' }}
              </n-descriptions-item>
            </n-descriptions>
          </div>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, computed, onMounted, watch } from 'vue'
  import {
    NButton,
    NCard,
    NDataTable,
    NSelect,
    NGrid,
    NGridItem,
    NModal,
    NTabs,
    NTabPane,
    NForm,
    NFormItem,
    NInput,
    NRadioGroup,
    NRadio,
    NSpace,
    NAvatar,
    NIcon,
    NDivider,
    NTag,
    NImage,
    NDescriptions,
    NDescriptionsItem,
    NDatePicker,
    useMessage,
    FormInst,
    FormRules,
    DataTableColumns
  } from 'naive-ui'
  import {
    ReloadOutline,
    EyeOutline,
    CheckmarkCircleOutline,
    CloseCircleOutline,
    AlertCircleOutline,
    TimeOutline
  } from '@vicons/ionicons5'

  // 消息提示
  const message = useMessage()

  // 状态
  const loading = ref(false)
  const submitting = ref(false)
  const currentTab = ref('pending')
  const pendingTable = ref(null)
  const processedTable = ref(null)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 50],
    showSizePicker: true,
    prefix({ itemCount }: { itemCount: number }) {
      return `共 ${itemCount} 条举报`
    }
  })

  // 举报数据
  interface ReportedContent {
    id: string
    title?: string
    content?: string
    thumbnailUrl?: string
    uploader?: string
    commenter?: string
    createdAt: string
    username?: string
    avatarUrl?: string
  }

  interface User {
    id: string
    username: string
    avatarUrl?: string
  }

  interface Report {
    id: string
    type: string
    status: string
    reason: string
    createdAt: string
    processedAt?: string
    contentType: 'VIDEO' | 'COMMENT' | 'USER'
    targetContent: ReportedContent
    reporter: User
    handler?: User
    result?: 'APPROVE' | 'REJECT'
    note?: string
  }

  const reports = ref<Report[]>([])
  const pendingReports = computed(() =>
    reports.value.filter(report => report.status === 'PENDING')
  )
  const processedReports = computed(() =>
    reports.value.filter(report => report.status !== 'PENDING')
  )

  // 模态框状态
  const showDetailModal = ref(false)
  const currentReport = ref<Report | null>(null)

  // 处理表单
  const actionForm = ref<FormInst | null>(null)
  const actionData = reactive({
    action: 'REJECT',
    note: ''
  })
  const actionRules: FormRules = {
    action: [
      { required: true, message: '请选择处理结果', trigger: 'change' }
    ]
  }

  // 筛选选项
  const filterOptions = reactive({
    status: null,
    type: null,
    dateRange: null
  })

  // 下拉选项
  const statusOptions = [
    { label: '待处理', value: 'PENDING' },
    { label: '已处理', value: 'PROCESSED' }
  ]

  const typeOptions = [
    { label: '违法违规', value: 'ILLEGAL' },
    { label: '色情低俗', value: 'PORNOGRAPHY' },
    { label: '暴力血腥', value: 'VIOLENCE' },
    { label: '政治敏感', value: 'POLITICS' },
    { label: '侵权', value: 'COPYRIGHT' },
    { label: '垃圾信息', value: 'SPAM' },
    { label: '其他', value: 'OTHER' }
  ]

  // 获取状态类型
  const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'warning',
      'PROCESSED': 'success'
    }
    return statusMap[status] || 'default'
  }

  // 获取状态名称
  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待处理',
      'PROCESSED': '已处理'
    }
    return statusMap[status] || status
  }

  // 获取举报类型名称
  const getReportTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'ILLEGAL': '违法违规',
      'PORNOGRAPHY': '色情低俗',
      'VIOLENCE': '暴力血腥',
      'POLITICS': '政治敏感',
      'COPYRIGHT': '侵权',
      'SPAM': '垃圾信息',
      'OTHER': '其他'
    }
    return typeMap[type] || type
  }

  // 获取内容类型名称
  const getContentTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'VIDEO': '视频',
      'COMMENT': '评论',
      'USER': '用户'
    }
    return typeMap[type] || type
  }

  // 表格列定义
  const createColumns = (): DataTableColumns<Report> => {
    return [
      {
        title: '举报ID',
        key: 'id',
        width: 100,
      },
      {
        title: '举报类型',
        key: 'type',
        width: 100,
        render(row) {
          return getReportTypeName(row.type)
        }
      },
      {
        title: '内容类型',
        key: 'contentType',
        width: 100,
        render(row) {
          return getContentTypeName(row.contentType)
        }
      },
      {
        title: '举报内容',
        key: 'content',
        width: 250,
        ellipsis: {
          tooltip: true
        },
        render(row) {
          if (row.contentType === 'VIDEO') {
            return row.targetContent.title
          } else if (row.contentType === 'COMMENT') {
            return row.targetContent.content
          } else if (row.contentType === 'USER') {
            return row.targetContent.username
          }
          return '未知内容'
        }
      },
      {
        title: '举报原因',
        key: 'reason',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '举报人',
        key: 'reporter',
        width: 120,
        render(row) {
          return row.reporter.username
        }
      },
      {
        title: '举报时间',
        key: 'createdAt',
        width: 180,
      },
      {
        title: '状态',
        key: 'status',
        width: 100,
        render(row) {
          return h(
            NTag,
            {
              type: getStatusType(row.status),
              size: 'small',
            },
            {
              default: () => getStatusName(row.status),
            }
          )
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 100,
        fixed: 'right',
        render(row) {
          return h(
            NButton,
            {
              type: 'primary',
              size: 'small',
              onClick: () => viewReportDetail(row),
              renderIcon: () => h(NIcon, null, { default: () => h(EyeOutline) }),
            },
            { default: () => '查看' }
          )
        }
      }
    ]
  }

  const columns = createColumns()

  // 刷新数据
  const refreshData = async () => {
    loading.value = true
    try {
      // 模拟获取数据
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟数据
      reports.value = [
        {
          id: 'R001',
          type: 'ILLEGAL',
          status: 'PENDING',
          reason: '该视频含有违法内容，宣传违禁物品',
          createdAt: '2023-06-15 10:30:45',
          contentType: 'VIDEO',
          targetContent: {
            id: 'V001',
            title: '生活妙招分享第10期',
            thumbnailUrl: '/api/thumbnails/v1.jpg',
            uploader: '生活达人',
            createdAt: '2023-06-10',
          },
          reporter: {
            id: 'U001',
            username: '用户A',
            avatarUrl: '/api/avatars/u1.jpg'
          }
        },
        {
          id: 'R002',
          type: 'PORNOGRAPHY',
          status: 'PROCESSED',
          reason: '评论内容低俗，不适合公开场合',
          createdAt: '2023-06-14 15:20:30',
          processedAt: '2023-06-14 16:45:12',
          contentType: 'COMMENT',
          targetContent: {
            id: 'C001',
            content: '这个内容太过低俗，已被举报',
            commenter: '用户B',
            createdAt: '2023-06-13',
          },
          reporter: {
            id: 'U003',
            username: '用户C',
            avatarUrl: '/api/avatars/u3.jpg'
          },
          handler: {
            id: 'A001',
            username: '管理员小王',
            avatarUrl: '/api/avatars/a1.jpg'
          },
          result: 'APPROVE',
          note: '评论内容确实违规，已删除该评论并对用户进行警告'
        },
        {
          id: 'R003',
          type: 'SPAM',
          status: 'PENDING',
          reason: '该用户频繁发布广告内容，影响用户体验',
          createdAt: '2023-06-16 09:15:22',
          contentType: 'USER',
          targetContent: {
            id: 'U005',
            username: '推广大师',
            avatarUrl: '/api/avatars/u5.jpg',
            createdAt: '2023-05-01',
          },
          reporter: {
            id: 'U006',
            username: '正义用户',
            avatarUrl: '/api/avatars/u6.jpg'
          }
        },
        {
          id: 'R004',
          type: 'COPYRIGHT',
          status: 'PROCESSED',
          reason: '侵犯我的原创视频版权，未经授权搬运',
          createdAt: '2023-06-13 14:30:00',
          processedAt: '2023-06-15 11:20:15',
          contentType: 'VIDEO',
          targetContent: {
            id: 'V003',
            title: '原创音乐分享',
            thumbnailUrl: '/api/thumbnails/v3.jpg',
            uploader: '搬运工',
            createdAt: '2023-06-12',
          },
          reporter: {
            id: 'U008',
            username: '原创音乐人',
            avatarUrl: '/api/avatars/u8.jpg'
          },
          handler: {
            id: 'A002',
            username: '管理员小李',
            avatarUrl: '/api/avatars/a2.jpg'
          },
          result: 'APPROVE',
          note: '经核实，确认为侵权内容，已删除视频'
        },
        {
          id: 'R005',
          type: 'OTHER',
          status: 'PROCESSED',
          reason: '该用户在评论区人身攻击',
          createdAt: '2023-06-12 18:40:50',
          processedAt: '2023-06-13 09:10:30',
          contentType: 'COMMENT',
          targetContent: {
            id: 'C005',
            content: '这条评论已被删除',
            commenter: '喷子用户',
            createdAt: '2023-06-12',
          },
          reporter: {
            id: 'U010',
            username: '受害者',
            avatarUrl: '/api/avatars/u10.jpg'
          },
          handler: {
            id: 'A001',
            username: '管理员小王',
            avatarUrl: '/api/avatars/a1.jpg'
          },
          result: 'REJECT',
          note: '经核实，评论内容未构成人身攻击，属于正常讨论范围'
        }
      ]

      pagination.itemCount = reports.value.length

      // 根据当前选项卡更新分页数量
      updatePaginationCount()

      message.success('数据刷新成功')
    } catch (error) {
      message.error('获取数据失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 更新分页计数
  const updatePaginationCount = () => {
    if (currentTab.value === 'pending') {
      pagination.itemCount = pendingReports.value.length
    } else {
      pagination.itemCount = processedReports.value.length
    }
  }

  // 分页处理
  const handlePageChange = (page: number) => {
    pagination.page = page
  }

  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }

  // 应用筛选
  const applyFilters = () => {
    pagination.page = 1
    refreshData()
  }

  // 查看举报详情
  const viewReportDetail = (report: Report) => {
    currentReport.value = report
    actionData.action = 'REJECT'
    actionData.note = ''
    showDetailModal.value = true
  }

  // 处理举报
  const handleReportAction = () => {
    actionForm.value?.validate(async (errors) => {
      if (errors) return

      submitting.value = true
      try {
        // 模拟处理操作
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (!currentReport.value) return

        // 更新报告状态
        const index = reports.value.findIndex(r => r.id === currentReport.value?.id)
        if (index !== -1) {
          reports.value[index] = {
            ...reports.value[index],
            status: 'PROCESSED',
            result: actionData.action as any,
            note: actionData.note,
            processedAt: new Date().toLocaleString(),
            handler: {
              id: 'A001',
              username: '当前管理员',
              avatarUrl: '/api/avatars/a1.jpg'
            }
          }

          // 更新当前显示的举报数据
          currentReport.value = reports.value[index]
        }

        updatePaginationCount()
        message.success('举报处理成功')
      } catch (error) {
        message.error('处理失败')
        console.error(error)
      } finally {
        submitting.value = false
      }
    })
  }

  // 监听选项卡变化
  watch(currentTab, () => {
    updatePaginationCount()
  })

  // 初始化
  onMounted(() => {
    refreshData()
  })
</script>

<style scoped>
  .reports-page {
    padding: var(--content-padding);
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    font-weight: 500;
  }

  .filter-card {
    margin-bottom: 16px;
  }

  .report-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-info-large {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-details h3 {
    margin: 0;
    margin-bottom: 4px;
  }

  .user-details p {
    margin: 0;
    color: var(--text-color-secondary);
  }

  .video-info {
    display: flex;
    gap: 16px;
  }

  .video-details {
    display: flex;
    flex-direction: column;
  }

  .video-details h3 {
    margin: 0;
    margin-bottom: 4px;
  }

  .video-details p {
    margin: 0;
    margin-bottom: 4px;
    color: var(--text-color-secondary);
  }

  .mt-4 {
    margin-top: 16px;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
</style>