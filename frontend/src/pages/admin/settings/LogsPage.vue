/**
* 管理后台系统日志页面
*
* 用于管理员查看系统运行日志
*/
<template>
  <div class="logs-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">系统日志</h1>
      <div class="page-actions">
        <n-space>
          <n-button @click="refreshLogs">
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            刷新
          </n-button>
          <n-button type="primary" @click="exportLogs">
            <template #icon>
              <n-icon>
                <DownloadOutline />
              </n-icon>
            </template>
            导出日志
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <n-card class="filter-card">
      <n-grid :cols="5" :x-gap="12">
        <n-grid-item>
          <n-select v-model:value="filterOptions.level" placeholder="日志级别" :options="levelOptions" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-select v-model:value="filterOptions.module" placeholder="系统模块" :options="moduleOptions" clearable />
        </n-grid-item>
        <n-grid-item span="2">
          <n-date-picker v-model:value="filterOptions.dateRange" type="datetimerange" clearable placeholder="时间范围"
            style="width: 100%" />
        </n-grid-item>
        <n-grid-item>
          <n-input v-model:value="filterOptions.keyword" placeholder="关键词搜索" clearable>
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
      </n-grid>
      <div class="filter-actions">
        <n-button type="primary" @click="applyFilters">应用筛选</n-button>
      </div>
    </n-card>

    <!-- 日志数据表格 -->
    <n-card>
      <n-data-table ref="table" :columns="columns" :data="logs" :loading="loading" :pagination="pagination"
        :row-key="row => row.id" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
        :scroll-x="1200" />
    </n-card>

    <!-- 日志详情模态框 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="日志详情" style="width: 700px">
      <template v-if="currentLog">
        <div class="log-detail">
          <n-descriptions label-placement="left" :column="2" bordered>
            <n-descriptions-item label="日志ID">
              {{ currentLog.id }}
            </n-descriptions-item>
            <n-descriptions-item label="时间">
              {{ currentLog.timestamp }}
            </n-descriptions-item>
            <n-descriptions-item label="级别">
              <n-tag :type="getLevelType(currentLog.level)">
                {{ currentLog.level }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="模块">
              {{ currentLog.module }}
            </n-descriptions-item>
            <n-descriptions-item label="IP地址" v-if="currentLog.ipAddress">
              {{ currentLog.ipAddress }}
            </n-descriptions-item>
            <n-descriptions-item label="用户" v-if="currentLog.user">
              {{ currentLog.user }}
            </n-descriptions-item>
          </n-descriptions>

          <n-divider title-placement="left">日志内容</n-divider>

          <div class="log-message">
            {{ currentLog.message }}
          </div>

          <template v-if="currentLog.context">
            <n-divider title-placement="left">上下文信息</n-divider>

            <n-code :code="formatJSON(currentLog.context)" language="json" />
          </template>

          <template v-if="currentLog.stack">
            <n-divider title-placement="left">堆栈信息</n-divider>

            <n-code :code="currentLog.stack" language="plaintext" />
          </template>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, onMounted } from 'vue'
  import {
    NButton,
    NCard,
    NDataTable,
    NSelect,
    NInput,
    NGrid,
    NGridItem,
    NModal,
    NSpace,
    NIcon,
    NDivider,
    NTag,
    NDescriptions,
    NDescriptionsItem,
    NDatePicker,
    NCode,
    useMessage,
    DataTableColumns
  } from 'naive-ui'
  import {
    DownloadOutline,
    ReloadOutline,
    SearchOutline,
    EyeOutline,
    TimeOutline,
    AlertCircleOutline,
    InformationCircleOutline,
    WarningOutline,
    BugOutline
  } from '@vicons/ionicons5'

  // 消息提示
  const message = useMessage()

  // 状态
  const loading = ref(false)
  const table = ref(null)
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    itemCount: 0,
    pageSizes: [20, 50, 100],
    showSizePicker: true,
    prefix({ itemCount }: { itemCount: number }) {
      return `共 ${itemCount} 条日志`
    }
  })

  // 日志数据
  interface Log {
    id: string
    timestamp: string
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
    module: string
    message: string
    ipAddress?: string
    user?: string
    context?: Record<string, any>
    stack?: string
  }

  const logs = ref<Log[]>([])
  const currentLog = ref<Log | null>(null)

  // 模态框状态
  const showDetailModal = ref(false)

  // 筛选选项
  const filterOptions = reactive({
    level: null,
    module: null,
    dateRange: null,
    keyword: ''
  })

  // 下拉选项
  const levelOptions = [
    { label: 'DEBUG', value: 'DEBUG' },
    { label: 'INFO', value: 'INFO' },
    { label: 'WARN', value: 'WARN' },
    { label: 'ERROR', value: 'ERROR' },
    { label: 'FATAL', value: 'FATAL' }
  ]

  const moduleOptions = [
    { label: '认证模块', value: 'AUTH' },
    { label: '用户模块', value: 'USER' },
    { label: '视频模块', value: 'VIDEO' },
    { label: '评论模块', value: 'COMMENT' },
    { label: '系统模块', value: 'SYSTEM' },
    { label: '数据库模块', value: 'DATABASE' },
    { label: '文件模块', value: 'FILE' }
  ]

  // 获取级别类型
  const getLevelType = (level: string) => {
    const typeMap: Record<string, string> = {
      'DEBUG': 'default',
      'INFO': 'info',
      'WARN': 'warning',
      'ERROR': 'error',
      'FATAL': 'error'
    }
    return typeMap[level] || 'default'
  }

  // 表格列定义
  const createColumns = (): DataTableColumns<Log> => {
    return [
      {
        title: '时间',
        key: 'timestamp',
        width: 180,
        fixed: 'left',
        sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      },
      {
        title: '级别',
        key: 'level',
        width: 100,
        filters: levelOptions.map(option => ({
          label: option.label,
          value: option.value
        })),
        filterMultiple: true,
        filterOptionValue: null,
        render(row) {
          return h(
            NTag,
            {
              type: getLevelType(row.level),
              size: 'small',
            },
            {
              default: () => row.level,
            }
          )
        }
      },
      {
        title: '模块',
        key: 'module',
        width: 120,
        filters: moduleOptions.map(option => ({
          label: option.label,
          value: option.value
        })),
        filterMultiple: true,
        filterOptionValue: null
      },
      {
        title: '消息',
        key: 'message',
        width: 400,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: 'IP地址',
        key: 'ipAddress',
        width: 140
      },
      {
        title: '用户',
        key: 'user',
        width: 120
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
              onClick: () => viewLogDetail(row),
              renderIcon: () => h(NIcon, null, { default: () => h(EyeOutline) }),
            },
            { default: () => '查看' }
          )
        }
      }
    ]
  }

  const columns = createColumns()

  // 格式化JSON
  const formatJSON = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch (error) {
      return JSON.stringify(obj)
    }
  }

  // 刷新日志
  const refreshLogs = async () => {
    loading.value = true
    try {
      // 模拟获取数据
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟数据
      logs.value = [
        {
          id: 'L001',
          timestamp: '2023-06-18 09:12:45',
          level: 'INFO',
          module: 'AUTH',
          message: '用户登录成功',
          ipAddress: '192.168.1.100',
          user: 'admin',
          context: {
            userId: 'U001',
            loginType: 'password',
            browserInfo: 'Chrome 114.0.0.0'
          }
        },
        {
          id: 'L002',
          timestamp: '2023-06-18 08:56:32',
          level: 'ERROR',
          module: 'VIDEO',
          message: '视频上传失败：文件格式不支持',
          ipAddress: '192.168.1.105',
          user: 'creator1',
          context: {
            videoId: 'V123',
            fileType: 'wmv',
            fileSize: '128MB'
          },
          stack: 'Error: 不支持的视频格式\n    at VideoService.validateVideo (/app/services/video.js:156:23)\n    at VideoController.uploadVideo (/app/controllers/video.js:48:12)'
        },
        {
          id: 'L003',
          timestamp: '2023-06-18 08:30:15',
          level: 'WARN',
          module: 'DATABASE',
          message: '数据库连接池接近上限',
          context: {
            poolSize: 45,
            maxSize: 50,
            activeConnections: 42
          }
        },
        {
          id: 'L004',
          timestamp: '2023-06-18 07:45:21',
          level: 'DEBUG',
          module: 'SYSTEM',
          message: '系统状态检查完成',
          context: {
            cpuUsage: '32%',
            memoryUsage: '64%',
            diskSpace: '76%',
            activeUsers: 156
          }
        },
        {
          id: 'L005',
          timestamp: '2023-06-18 07:30:00',
          level: 'INFO',
          module: 'SYSTEM',
          message: '系统启动完成',
          context: {
            startupTime: '3.2s',
            environment: 'production',
            nodeVersion: '18.15.0'
          }
        },
        {
          id: 'L006',
          timestamp: '2023-06-17 23:12:45',
          level: 'ERROR',
          module: 'FILE',
          message: '文件存储服务连接失败',
          context: {
            storageType: 'S3',
            endpoint: 's3.amazonaws.com',
            bucket: 'atom-video-uploads'
          },
          stack: 'Error: 连接超时\n    at S3Client.connect (/app/services/storage.js:87:11)\n    at FileService.uploadFile (/app/services/file.js:42:18)'
        },
        {
          id: 'L007',
          timestamp: '2023-06-17 22:30:15',
          level: 'WARN',
          module: 'AUTH',
          message: '用户多次登录失败',
          ipAddress: '203.0.113.45',
          context: {
            userId: 'U089',
            username: 'user123',
            failCount: 3,
            remainingAttempts: 2
          }
        },
        {
          id: 'L008',
          timestamp: '2023-06-17 21:05:11',
          level: 'INFO',
          module: 'USER',
          message: '新用户注册成功',
          ipAddress: '198.51.100.76',
          user: 'newuser987',
          context: {
            userId: 'U234',
            email: 'user@example.com',
            registrationType: 'email'
          }
        },
        {
          id: 'L009',
          timestamp: '2023-06-17 20:18:22',
          level: 'FATAL',
          module: 'DATABASE',
          message: '数据库连接中断',
          context: {
            database: 'main',
            host: 'db.example.com',
            port: 5432
          },
          stack: 'Error: 连接断开\n    at PostgreSQLClient.connect (/app/lib/database.js:201:15)\n    at DatabaseService.query (/app/services/database.js:34:22)'
        },
        {
          id: 'L010',
          timestamp: '2023-06-17 19:45:30',
          level: 'DEBUG',
          module: 'COMMENT',
          message: '评论筛选和排序',
          context: {
            videoId: 'V456',
            sortBy: 'newest',
            filter: 'verified',
            count: 25
          }
        }
      ]

      pagination.itemCount = logs.value.length
      message.success('日志刷新成功')
    } catch (error) {
      message.error('获取日志失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 导出日志
  const exportLogs = async () => {
    try {
      message.loading('正在导出日志...')

      // 模拟导出操作
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 实际项目中应该提供一个下载链接或文件
      message.success('日志导出成功')
    } catch (error) {
      message.error('日志导出失败')
      console.error(error)
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
    refreshLogs()
  }

  // 查看日志详情
  const viewLogDetail = (log: Log) => {
    currentLog.value = log
    showDetailModal.value = true
  }

  // 初始化
  onMounted(() => {
    refreshLogs()
  })
</script>

<style scoped>
  .logs-page {
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

  .filter-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .log-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .log-message {
    padding: 12px;
    background-color: var(--card-color);
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>