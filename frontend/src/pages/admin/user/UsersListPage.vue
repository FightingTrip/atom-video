/**
* 管理后台用户列表页面
*
* 用于管理员查看和管理所有用户
*/
<template>
  <div class="users-list-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
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
          <n-button @click="exportUsers">
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
          <n-input v-model:value="searchQuery" placeholder="搜索用户名/邮箱/ID">
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="statusFilter" :options="statusOptions" placeholder="用户状态" clearable />
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="roleFilter" :options="roleOptions" placeholder="用户角色" clearable />
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

    <!-- 用户数据表格 -->
    <n-card class="data-card">
      <n-data-table ref="table" :columns="columns" :data="users" :pagination="pagination" :loading="loading"
        :row-key="row => row.id" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
        @update:sorter="handleSorterChange" />
    </n-card>

    <!-- 用户操作对话框 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑用户" style="width: 600px">
      <n-form ref="editForm" :model="editUser" :rules="rules" label-placement="left" label-width="100px">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="editUser.username" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="editUser.email" />
        </n-form-item>
        <n-form-item label="角色" path="role">
          <n-select v-model:value="editUser.role" :options="roleOptions" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select v-model:value="editUser.status" :options="statusOptions" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display:flex; justify-content:flex-end; gap:12px;">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" @click="saveUser">保存</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 用户删除确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="删除确认" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="showDeleteModal = false">
      <template #icon>
        <n-icon color="#f0a020">
          <WarningOutline />
        </n-icon>
      </template>
      <div>确认要删除用户 <strong>{{ deleteUser?.username }}</strong> 吗？此操作不可逆。</div>
    </n-modal>

    <!-- 用户状态修改确认对话框 -->
    <n-modal v-model:show="showStatusModal" preset="dialog" :title="statusAction.title" positive-text="确认"
      negative-text="取消" @positive-click="confirmStatusChange" @negative-click="showStatusModal = false">
      <template #icon>
        <n-icon>
          <component :is="statusAction.icon" />
        </n-icon>
      </template>
      <div>确认要将用户 <strong>{{ statusUser?.username }}</strong> {{ statusAction.description }}吗？</div>
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
    NTooltip
  } from 'naive-ui'
  import {
    ReloadOutline,
    DownloadOutline,
    SearchOutline,
    CreateOutline,
    TrashOutline,
    PersonRemoveOutline,
    PersonAddOutline,
    WarningOutline,
    EyeOutline,
    LockClosedOutline,
    LockOpenOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'
  import type { FormRules, FormInst } from 'naive-ui'

  interface User {
    id: string
    username: string
    email: string
    role: string
    status: string
    createdAt: string
    lastLogin: string
    avatar?: string
  }

  // 路由和状态
  const router = useRouter()
  const message = useMessage()

  // 搜索筛选状态
  const searchQuery = ref('')
  const statusFilter = ref(null)
  const roleFilter = ref(null)
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
      return `共 ${itemCount} 个用户`
    }
  })

  // 表格数据
  const users = ref<User[]>([])

  // 模态框状态
  const showEditModal = ref(false)
  const showDeleteModal = ref(false)
  const showStatusModal = ref(false)
  const editUser = reactive<User>({
    id: '',
    username: '',
    email: '',
    role: '',
    status: '',
    createdAt: '',
    lastLogin: '',
  })
  const deleteUser = ref<User | null>(null)
  const statusUser = ref<User | null>(null)
  const statusAction = reactive({
    title: '',
    description: '',
    action: '',
    icon: null as any
  })

  // 表单状态
  const editForm = ref<FormInst | null>(null)
  const rules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    role: [
      { required: true, message: '请选择角色', trigger: 'change' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  }

  // 下拉选项
  const statusOptions = [
    { label: '活跃', value: 'ACTIVE' },
    { label: '未激活', value: 'INACTIVE' },
    { label: '已禁用', value: 'BANNED' }
  ]

  const roleOptions = [
    { label: '普通用户', value: 'USER' },
    { label: '创作者', value: 'CREATOR' },
    { label: '管理员', value: 'ADMIN' },
    { label: '内容审核员', value: 'MODERATOR' }
  ]

  // 渲染用户状态标签
  function renderStatus(status: string) {
    const statusMap: Record<string, { type: 'success' | 'warning' | 'error', text: string }> = {
      'ACTIVE': { type: 'success', text: '活跃' },
      'INACTIVE': { type: 'warning', text: '未激活' },
      'BANNED': { type: 'error', text: '已禁用' }
    }

    const info = statusMap[status] || { type: 'default', text: status }

    return h(NTag, { type: info.type, size: 'small' }, { default: () => info.text })
  }

  // 渲染用户角色标签
  function renderRole(role: string) {
    const roleMap: Record<string, { type: 'default' | 'primary' | 'info' | 'success', text: string }> = {
      'USER': { type: 'default', text: '普通用户' },
      'CREATOR': { type: 'info', text: '创作者' },
      'ADMIN': { type: 'primary', text: '管理员' },
      'MODERATOR': { type: 'success', text: '内容审核员' }
    }

    const info = roleMap[role] || { type: 'default', text: role }

    return h(NTag, { type: info.type, size: 'small' }, { default: () => info.text })
  }

  // 表格列配置
  const columns = ref<DataTableColumns<User>>([
    {
      title: '用户ID',
      key: 'id',
      width: 80,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '用户名',
      key: 'username',
      width: 140,
      ellipsis: {
        tooltip: true
      },
      sorter: 'default'
    },
    {
      title: '邮箱',
      key: 'email',
      width: 180,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '角色',
      key: 'role',
      width: 120,
      render(row) {
        return renderRole(row.role)
      },
      sorter: 'default',
      filterOptions: roleOptions,
      filter: (value, row) => {
        return row.role === value
      }
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render(row) {
        return renderStatus(row.status)
      },
      sorter: 'default',
      filterOptions: statusOptions,
      filter: (value, row) => {
        return row.status === value
      }
    },
    {
      title: '注册时间',
      key: 'createdAt',
      width: 160,
      sorter: 'default'
    },
    {
      title: '最近登录',
      key: 'lastLogin',
      width: 160,
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
            // 查看按钮
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
                    onClick: () => viewUserDetail(row)
                  },
                  { icon: () => h(NIcon, null, { default: () => h(EyeOutline) }) }
                ),
                default: () => '查看详情'
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
                    onClick: () => editUserInfo(row)
                  },
                  { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }
                ),
                default: () => '编辑用户'
              }
            ),
            // 状态按钮
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
                    onClick: () => handleStatusAction(row)
                  },
                  {
                    icon: () => h(
                      NIcon,
                      null,
                      {
                        default: () => h(
                          row.status === 'ACTIVE' ? LockClosedOutline : LockOpenOutline
                        )
                      }
                    )
                  }
                ),
                default: () => row.status === 'ACTIVE' ? '禁用用户' : '启用用户'
              }
            ),
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
                    onClick: () => deleteUserModal(row)
                  },
                  { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
                ),
                default: () => '删除用户'
              }
            )
          ]
        })
      }
    }
  ])

  // 加载用户数据
  async function loadUsers() {
    loading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成模拟数据
      const mockUsers: User[] = Array.from({ length: 100 }, (_, index) => {
        const id = `user${index + 1}`.padStart(6, '0')
        const roles = ['USER', 'USER', 'USER', 'CREATOR', 'CREATOR', 'MODERATOR', 'ADMIN']
        const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'BANNED']

        // 随机日期生成
        const createdDate = new Date()
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365))

        const lastLoginDate = new Date(createdDate)
        lastLoginDate.setDate(lastLoginDate.getDate() + Math.floor(Math.random() * (new Date().getDate() - createdDate.getDate())))

        return {
          id: id,
          username: `用户${id}`,
          email: `user${index + 1}@example.com`,
          role: roles[Math.floor(Math.random() * roles.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: createdDate.toISOString().split('T')[0],
          lastLogin: lastLoginDate.toISOString().split('T')[0],
          avatar: `https://i.pravatar.cc/100?img=${index % 70}`
        }
      })

      // 过滤和排序
      let filteredUsers = [...mockUsers]

      // 应用搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
        )
      }

      // 应用状态过滤
      if (statusFilter.value) {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter.value)
      }

      // 应用角色过滤
      if (roleFilter.value) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter.value)
      }

      // 应用日期过滤
      if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
        const startDate = new Date(dateRange.value[0])
        const endDate = new Date(dateRange.value[1])

        filteredUsers = filteredUsers.filter(user => {
          const createdDate = new Date(user.createdAt)
          return createdDate >= startDate && createdDate <= endDate
        })
      }

      // 设置总数
      pagination.itemCount = filteredUsers.length

      // 分页
      const start = (pagination.page - 1) * pagination.pageSize
      const paginatedUsers = filteredUsers.slice(start, start + pagination.pageSize)

      users.value = paginatedUsers
    } catch (error) {
      console.error('加载用户数据失败:', error)
      message.error('加载用户数据失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索处理
  function handleSearch() {
    pagination.page = 1
    loadUsers()
  }

  // 重置过滤器
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = null
    roleFilter.value = null
    dateRange.value = null
    pagination.page = 1
    loadUsers()
  }

  // 分页变化
  function handlePageChange(page: number) {
    pagination.page = page
    loadUsers()
  }

  // 每页条数变化
  function handlePageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadUsers()
  }

  // 排序变化
  function handleSorterChange() {
    loadUsers()
  }

  // 刷新数据
  function refreshData() {
    loadUsers()
  }

  // 导出用户
  function exportUsers() {
    message.success('用户数据导出成功')
  }

  // 查看用户详情
  function viewUserDetail(user: User) {
    router.push(`/admin/users/${user.id}`)
  }

  // 编辑用户信息
  function editUserInfo(user: User) {
    // 复制用户数据到编辑表单
    Object.assign(editUser, user)
    showEditModal.value = true
  }

  // 保存用户
  async function saveUser() {
    if (!editForm.value) return

    await editForm.value.validate()

    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新本地列表（在实际应用中应该刷新数据）
    const index = users.value.findIndex(u => u.id === editUser.id)
    if (index !== -1) {
      users.value[index] = { ...editUser }
    }

    message.success('用户信息已更新')
    showEditModal.value = false

    // 在实际应用中，应该重新加载
    // loadUsers()
  }

  // 打开删除用户确认框
  function deleteUserModal(user: User) {
    deleteUser.value = user
    showDeleteModal.value = true
  }

  // 确认删除用户
  async function confirmDelete() {
    if (!deleteUser.value) return

    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 从本地列表中移除（在实际应用中应该刷新数据）
    users.value = users.value.filter(u => u.id !== deleteUser.value?.id)

    message.success(`用户 ${deleteUser.value.username} 已删除`)
    showDeleteModal.value = false
    deleteUser.value = null

    // 在实际应用中，应该重新加载
    // loadUsers()
  }

  // 处理用户状态变更
  function handleStatusAction(user: User) {
    statusUser.value = user

    if (user.status === 'ACTIVE') {
      statusAction.title = '禁用用户'
      statusAction.description = '禁用'
      statusAction.action = 'BANNED'
      statusAction.icon = LockClosedOutline
    } else {
      statusAction.title = '启用用户'
      statusAction.description = '启用'
      statusAction.action = 'ACTIVE'
      statusAction.icon = LockOpenOutline
    }

    showStatusModal.value = true
  }

  // 确认状态变更
  async function confirmStatusChange() {
    if (!statusUser.value) return

    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新本地列表（在实际应用中应该刷新数据）
    const index = users.value.findIndex(u => u.id === statusUser.value?.id)
    if (index !== -1) {
      users.value[index].status = statusAction.action
    }

    message.success(`用户 ${statusUser.value.username} 已${statusAction.description}`)
    showStatusModal.value = false
    statusUser.value = null

    // 在实际应用中，应该重新加载
    // loadUsers()
  }

  // 初始化
  onMounted(() => {
    loadUsers()
  })
</script>

<style scoped>
  .users-list-page {
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