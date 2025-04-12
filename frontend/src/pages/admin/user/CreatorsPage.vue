/**
* 管理后台创作者管理页面
*
* 用于管理员管理平台创作者
*/
<template>
  <div class="creators-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">创作者管理</h1>
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
          <n-button type="primary" @click="showAddCreatorModal = true">
            <template #icon>
              <n-icon>
                <AddOutline />
              </n-icon>
            </template>
            添加创作者
          </n-button>
        </n-button-group>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <n-card class="filter-card">
      <n-grid :cols="4" :x-gap="12">
        <n-grid-item>
          <n-input v-model:value="filterOptions.searchQuery" placeholder="搜索创作者名称" clearable>
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item>
          <n-select v-model:value="filterOptions.status" placeholder="创作者状态" :options="statusOptions" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-select v-model:value="filterOptions.category" placeholder="内容分类" :options="categoryOptions" clearable />
        </n-grid-item>
        <n-grid-item>
          <n-button type="primary" block @click="applyFilters">应用筛选</n-button>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 创作者数据表格 -->
    <n-card>
      <n-data-table ref="table" :columns="columns" :data="creators" :loading="loading" :pagination="pagination"
        :row-key="row => row.id" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
        :scroll-x="1200" />
    </n-card>

    <!-- 添加创作者模态框 -->
    <n-modal v-model:show="showAddCreatorModal" preset="card" title="添加创作者" style="width: 600px">
      <n-form ref="addCreatorForm" :model="creatorForm" :rules="rules" label-placement="left" label-width="100px">
        <n-form-item label="用户" path="userId">
          <n-select v-model:value="creatorForm.userId" placeholder="选择用户" :options="userOptions" filterable remote
            :loading="loadingUsers" @search="handleUserSearch" />
        </n-form-item>
        <n-form-item label="创作者名称" path="name">
          <n-input v-model:value="creatorForm.name" placeholder="输入创作者名称" />
        </n-form-item>
        <n-form-item label="主要分类" path="category">
          <n-select v-model:value="creatorForm.category" placeholder="选择主要内容分类" :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="creatorForm.description" type="textarea" placeholder="输入创作者描述" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select v-model:value="creatorForm.status" :options="statusOptions" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <n-button @click="showAddCreatorModal = false">取消</n-button>
          <n-button type="primary" @click="handleAddCreator" :loading="submitting">添加</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 编辑创作者模态框 -->
    <n-modal v-model:show="showEditCreatorModal" preset="card" title="编辑创作者" style="width: 600px">
      <n-form ref="editCreatorForm" :model="creatorForm" :rules="rules" label-placement="left" label-width="100px">
        <n-form-item label="创作者名称" path="name">
          <n-input v-model:value="creatorForm.name" placeholder="输入创作者名称" />
        </n-form-item>
        <n-form-item label="主要分类" path="category">
          <n-select v-model:value="creatorForm.category" placeholder="选择主要内容分类" :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="creatorForm.description" type="textarea" placeholder="输入创作者描述" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select v-model:value="creatorForm.status" :options="statusOptions" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <n-button @click="showEditCreatorModal = false">取消</n-button>
          <n-button type="primary" @click="handleEditCreator" :loading="submitting">保存</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 查看创作者详情模态框 -->
    <n-modal v-model:show="showViewCreatorModal" preset="card" title="创作者详情" style="width: 700px">
      <template v-if="currentCreator">
        <div class="creator-detail">
          <div class="creator-header">
            <div class="creator-avatar">
              <n-avatar v-if="currentCreator.avatarUrl" :src="currentCreator.avatarUrl" :size="64" />
              <n-avatar v-else :size="64">{{ currentCreator.name?.charAt(0) }}</n-avatar>
            </div>
            <div class="creator-info">
              <h2>{{ currentCreator.name }}
                <n-tag :type="getStatusType(currentCreator.status)" size="small">
                  {{ getStatusLabel(currentCreator.status) }}
                </n-tag>
              </h2>
              <p class="creator-description">{{ currentCreator.description || '暂无描述' }}</p>
            </div>
          </div>

          <n-divider />

          <div class="creator-stats">
            <n-grid :cols="3" :x-gap="12">
              <n-grid-item>
                <n-statistic label="视频数量">
                  {{ currentCreator.videoCount || 0 }}
                </n-statistic>
              </n-grid-item>
              <n-grid-item>
                <n-statistic label="总播放量">
                  {{ formatNumber(currentCreator.totalViews || 0) }}
                </n-statistic>
              </n-grid-item>
              <n-grid-item>
                <n-statistic label="粉丝数">
                  {{ formatNumber(currentCreator.followers || 0) }}
                </n-statistic>
              </n-grid-item>
            </n-grid>
          </div>

          <n-divider title-placement="left">内容分析</n-divider>

          <div class="creator-chart">
            <div class="chart-placeholder">
              <n-empty description="暂无内容分析数据" />
            </div>
          </div>

          <n-divider title-placement="left">最近视频</n-divider>

          <n-list v-if="currentCreator.recentVideos && currentCreator.recentVideos.length > 0">
            <n-list-item v-for="video in currentCreator.recentVideos" :key="video.id">
              <n-thing :title="video.title" :description="video.createdAt">
                <template #avatar>
                  <n-image width="80" :src="video.thumbnailUrl || ''" fallback-src="/placeholder-thumbnail.jpg"
                    object-fit="cover" />
                </template>
                <template #description>
                  <div class="video-meta">
                    <span>{{ formatNumber(video.views || 0) }} 次播放</span>
                    <span>{{ formatNumber(video.likes || 0) }} 点赞</span>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          <n-empty v-else description="暂无视频内容" />
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, computed, onMounted } from 'vue'
  import {
    NButton,
    NButtonGroup,
    NCard,
    NDataTable,
    NInput,
    NSelect,
    NGrid,
    NGridItem,
    NModal,
    NForm,
    NFormItem,
    NAvatar,
    NIcon,
    NDivider,
    NStatistic,
    NList,
    NListItem,
    NThing,
    NImage,
    NTag,
    NEmpty,
    useMessage,
    FormInst,
    FormRules,
    DataTableColumns
  } from 'naive-ui'
  import {
    PersonOutline,
    AddOutline,
    CreateOutline,
    TrashOutline,
    EyeOutline,
    CloseCircleOutline,
    CheckmarkCircleOutline,
    AlertCircleOutline,
    SearchOutline,
    ReloadOutline
  } from '@vicons/ionicons5'

  // 消息提示
  const message = useMessage()

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
      return `共 ${itemCount} 个创作者`
    }
  })

  // 表格数据
  interface Creator {
    id: string
    userId: string
    name: string
    description?: string
    avatarUrl?: string
    category?: string
    status: string
    createdAt: string
    videoCount?: number
    totalViews?: number
    followers?: number
    recentVideos?: any[]
  }

  const creators = ref<Creator[]>([])
  const currentCreator = ref<Creator | null>(null)

  // 模态框状态
  const showAddCreatorModal = ref(false)
  const showEditCreatorModal = ref(false)
  const showViewCreatorModal = ref(false)
  const submitting = ref(false)

  // 表单状态
  const addCreatorForm = ref<FormInst | null>(null)
  const editCreatorForm = ref<FormInst | null>(null)
  const creatorForm = reactive({
    id: '',
    userId: '',
    name: '',
    description: '',
    category: '',
    status: 'ACTIVE'
  })

  // 表单规则
  const rules: FormRules = {
    userId: [
      { required: true, message: '请选择用户', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入创作者名称', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  }

  // 筛选选项
  const filterOptions = reactive({
    searchQuery: '',
    status: null,
    category: null
  })

  // 下拉选项
  const statusOptions = [
    { label: '活跃', value: 'ACTIVE' },
    { label: '已认证', value: 'VERIFIED' },
    { label: '未审核', value: 'PENDING' },
    { label: '已禁用', value: 'BANNED' }
  ]

  const categoryOptions = [
    { label: '游戏', value: 'GAMING' },
    { label: '音乐', value: 'MUSIC' },
    { label: '教育', value: 'EDUCATION' },
    { label: '科技', value: 'TECH' },
    { label: '生活方式', value: 'LIFESTYLE' },
    { label: '娱乐', value: 'ENTERTAINMENT' },
    { label: '其他', value: 'OTHER' }
  ]

  // 用户选择相关
  const userOptions = ref([])
  const loadingUsers = ref(false)

  // 表格列定义
  const createColumns = (): DataTableColumns<Creator> => {
    return [
      {
        title: '创作者',
        key: 'name',
        width: 200,
        fixed: 'left',
        render(row) {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
              },
            },
            [
              h(NAvatar, {
                src: row.avatarUrl,
                fallbackSrc: null,
                size: 'small',
                style: {
                  marginRight: '12px',
                },
              }, {
                default: () => row.name?.charAt(0),
              }),
              h('span', null, row.name),
            ]
          )
        }
      },
      {
        title: '主要分类',
        key: 'category',
        width: 120,
        render(row) {
          const category = categoryOptions.find(c => c.value === row.category)
          return category ? category.label : '-'
        }
      },
      {
        title: '视频数量',
        key: 'videoCount',
        width: 100,
      },
      {
        title: '总播放量',
        key: 'totalViews',
        width: 120,
        render(row) {
          return formatNumber(row.totalViews || 0)
        }
      },
      {
        title: '粉丝数',
        key: 'followers',
        width: 100,
        render(row) {
          return formatNumber(row.followers || 0)
        }
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
              default: () => getStatusLabel(row.status),
            }
          )
        }
      },
      {
        title: '创建时间',
        key: 'createdAt',
        width: 180,
      },
      {
        title: '操作',
        key: 'actions',
        width: 180,
        fixed: 'right',
        render(row) {
          return h(
            NButtonGroup,
            { size: 'small' },
            {
              default: () => [
                h(
                  NButton,
                  {
                    type: 'primary',
                    onClick: () => viewCreator(row),
                    renderIcon: () => h(NIcon, null, { default: () => h(EyeOutline) }),
                  },
                  { default: () => '查看' }
                ),
                h(
                  NButton,
                  {
                    type: 'info',
                    onClick: () => editCreator(row),
                    renderIcon: () => h(NIcon, null, { default: () => h(CreateOutline) }),
                  },
                  { default: () => '编辑' }
                ),
                h(
                  NButton,
                  {
                    type: row.status === 'BANNED' ? 'success' : 'error',
                    onClick: () => toggleCreatorStatus(row),
                    renderIcon: () => h(NIcon, null, {
                      default: () => h(row.status === 'BANNED' ? CheckmarkCircleOutline : CloseCircleOutline)
                    }),
                  },
                  { default: () => row.status === 'BANNED' ? '启用' : '禁用' }
                ),
              ],
            }
          )
        }
      }
    ]
  }

  const columns = createColumns()

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    }
    return num.toString()
  }

  // 获取状态类型
  const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'success',
      'VERIFIED': 'info',
      'PENDING': 'warning',
      'BANNED': 'error'
    }
    return statusMap[status] || 'default'
  }

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': '活跃',
      'VERIFIED': '已认证',
      'PENDING': '未审核',
      'BANNED': '已禁用'
    }
    return statusMap[status] || status
  }

  // 刷新数据
  const refreshData = async () => {
    loading.value = true
    try {
      // 模拟获取数据
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟数据
      creators.value = [
        {
          id: '1',
          userId: 'user1',
          name: '游戏达人',
          description: '专注游戏领域的内容创作者',
          avatarUrl: '/api/avatars/1.jpg',
          category: 'GAMING',
          status: 'VERIFIED',
          createdAt: '2023-01-15',
          videoCount: 56,
          totalViews: 583000,
          followers: 12500
        },
        {
          id: '2',
          userId: 'user2',
          name: '音乐人生',
          description: '分享优质音乐内容',
          avatarUrl: '/api/avatars/2.jpg',
          category: 'MUSIC',
          status: 'ACTIVE',
          createdAt: '2023-02-20',
          videoCount: 32,
          totalViews: 217000,
          followers: 8600
        },
        {
          id: '3',
          userId: 'user3',
          name: '科技前沿',
          description: '关注最新科技动态',
          avatarUrl: '/api/avatars/3.jpg',
          category: 'TECH',
          status: 'ACTIVE',
          createdAt: '2023-03-10',
          videoCount: 47,
          totalViews: 389000,
          followers: 15200
        },
        {
          id: '4',
          userId: 'user4',
          name: '学习空间',
          description: '提供各类教育资源',
          avatarUrl: '/api/avatars/4.jpg',
          category: 'EDUCATION',
          status: 'PENDING',
          createdAt: '2023-04-05',
          videoCount: 18,
          totalViews: 97000,
          followers: 5300
        },
        {
          id: '5',
          userId: 'user5',
          name: '生活达人',
          description: '分享生活小技巧',
          avatarUrl: '/api/avatars/5.jpg',
          category: 'LIFESTYLE',
          status: 'BANNED',
          createdAt: '2023-05-12',
          videoCount: 29,
          totalViews: 165000,
          followers: 7800
        }
      ]

      pagination.itemCount = 5
      message.success('数据刷新成功')
    } catch (error) {
      message.error('获取数据失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 分页处理
  const handlePageChange = (page: number) => {
    pagination.page = page
    refreshData()
  }

  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    refreshData()
  }

  // 应用筛选
  const applyFilters = () => {
    pagination.page = 1
    refreshData()
  }

  // 查看创作者详情
  const viewCreator = async (creator: Creator) => {
    currentCreator.value = creator
    // 模拟获取创作者详情数据
    currentCreator.value.recentVideos = [
      {
        id: 'v1',
        title: '2023年最值得期待的游戏',
        thumbnailUrl: '/api/thumbnails/v1.jpg',
        createdAt: '2023-12-01',
        views: 24000,
        likes: 1800
      },
      {
        id: 'v2',
        title: '游戏开发者访谈系列',
        thumbnailUrl: '/api/thumbnails/v2.jpg',
        createdAt: '2023-11-15',
        views: 18500,
        likes: 1200
      },
      {
        id: 'v3',
        title: '独立游戏推荐',
        thumbnailUrl: '/api/thumbnails/v3.jpg',
        createdAt: '2023-10-28',
        views: 15700,
        likes: 950
      }
    ]
    showViewCreatorModal.value = true
  }

  // 编辑创作者
  const editCreator = (creator: Creator) => {
    Object.assign(creatorForm, {
      id: creator.id,
      userId: creator.userId,
      name: creator.name,
      description: creator.description || '',
      category: creator.category || '',
      status: creator.status
    })
    showEditCreatorModal.value = true
  }

  // 切换创作者状态
  const toggleCreatorStatus = (creator: Creator) => {
    const newStatus = creator.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    const action = newStatus === 'BANNED' ? '禁用' : '启用'

    message.success(`已${action}创作者 ${creator.name}`)
    creator.status = newStatus
  }

  // 处理添加创作者
  const handleAddCreator = () => {
    addCreatorForm.value?.validate(async (errors) => {
      if (errors) return

      submitting.value = true
      try {
        // 模拟添加操作
        await new Promise(resolve => setTimeout(resolve, 1000))
        message.success('添加创作者成功')
        showAddCreatorModal.value = false
        refreshData()
      } catch (error) {
        message.error('添加创作者失败')
        console.error(error)
      } finally {
        submitting.value = false
      }
    })
  }

  // 处理编辑创作者
  const handleEditCreator = () => {
    editCreatorForm.value?.validate(async (errors) => {
      if (errors) return

      submitting.value = true
      try {
        // 模拟编辑操作
        await new Promise(resolve => setTimeout(resolve, 1000))
        message.success('编辑创作者成功')
        showEditCreatorModal.value = false

        // 更新本地数据
        const index = creators.value.findIndex(c => c.id === creatorForm.id)
        if (index !== -1) {
          creators.value[index] = {
            ...creators.value[index],
            name: creatorForm.name,
            description: creatorForm.description,
            category: creatorForm.category,
            status: creatorForm.status
          }
        }
      } catch (error) {
        message.error('编辑创作者失败')
        console.error(error)
      } finally {
        submitting.value = false
      }
    })
  }

  // 搜索用户
  const handleUserSearch = async (query: string) => {
    if (!query) return

    loadingUsers.value = true
    try {
      // 模拟搜索用户
      await new Promise(resolve => setTimeout(resolve, 800))
      userOptions.value = [
        { label: 'user001 (张三)', value: 'user001' },
        { label: 'user002 (李四)', value: 'user002' },
        { label: 'user003 (王五)', value: 'user003' }
      ]
    } catch (error) {
      console.error('搜索用户失败:', error)
    } finally {
      loadingUsers.value = false
    }
  }

  // 初始化
  onMounted(() => {
    refreshData()
  })
</script>

<style scoped>
  .creators-page {
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

  .creator-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .creator-header {
    display: flex;
    gap: 16px;
  }

  .creator-info {
    flex: 1;
  }

  .creator-info h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0;
    margin-bottom: 8px;
  }

  .creator-description {
    color: var(--text-color-secondary);
    margin: 0;
  }

  .creator-stats {
    padding: 8px 0;
  }

  .creator-chart {
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-meta {
    display: flex;
    gap: 16px;
    color: var(--text-color-secondary);
    font-size: 0.9em;
  }
</style>