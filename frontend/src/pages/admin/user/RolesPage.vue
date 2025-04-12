/**
* 管理后台角色权限管理页面
*
* 用于管理员配置不同角色和对应权限
*/
<template>
  <div class="roles-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">角色权限管理</h1>
      <div class="page-actions">
        <n-button type="primary" @click="showCreateRoleModal = true">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          创建角色
        </n-button>
      </div>
    </div>

    <!-- 角色列表 -->
    <div class="roles-layout">
      <!-- 角色列表侧边栏 -->
      <n-card class="roles-sidebar">
        <template #header>
          <div class="sidebar-header">
            <span>角色列表</span>
            <n-input size="small" placeholder="搜索角色" v-model:value="roleSearchQuery" clearable style="width: 150px">
              <template #prefix>
                <n-icon>
                  <SearchOutline />
                </n-icon>
              </template>
            </n-input>
          </div>
        </template>
        <div class="roles-list">
          <n-menu v-model:value="selectedRoleKey" :options="rolesMenuOptions" @update:value="handleRoleSelect" />
        </div>
      </n-card>

      <!-- 角色详情区域 -->
      <n-card class="role-detail">
        <n-empty v-if="!selectedRole" description="请选择一个角色" />

        <template v-else>
          <div class="role-detail-header">
            <div class="role-info">
              <div class="role-name">
                <h2>{{ selectedRole.name }}</h2>
                <n-tag :type="getRoleType(selectedRole.code)">
                  {{ selectedRole.code }}
                </n-tag>
              </div>
              <div class="role-description">
                {{ selectedRole.description }}
              </div>
              <div class="role-meta">
                <span>用户数量: {{ selectedRole.userCount }}</span>
                <span>创建时间: {{ selectedRole.createdAt }}</span>
              </div>
            </div>
            <div class="role-actions">
              <n-space>
                <n-button @click="editRole(selectedRole)">
                  <template #icon>
                    <n-icon>
                      <CreateOutline />
                    </n-icon>
                  </template>
                  编辑角色
                </n-button>
                <n-button :disabled="['ADMIN', 'USER'].includes(selectedRole.code)" type="error"
                  @click="confirmDeleteRole(selectedRole)">
                  <template #icon>
                    <n-icon>
                      <TrashOutline />
                    </n-icon>
                  </template>
                  删除角色
                </n-button>
              </n-space>
            </div>
          </div>

          <!-- 权限管理区域 -->
          <div class="permissions-section">
            <div class="section-header">
              <h3>权限管理</h3>
              <n-button text type="primary" @click="savePermissions">
                保存修改
              </n-button>
            </div>

            <div class="permissions-description">
              为该角色分配适当的权限，以控制用户可以执行的操作
            </div>

            <!-- 权限分类列表 -->
            <n-card v-for="category in permissionCategories" :key="category.key" class="permission-category"
              :title="category.label" size="small">
              <div class="permission-list">
                <div class="permission-group">
                  <div class="group-header">
                    <n-checkbox :indeterminate="isIndeterminateCategory(category.key)"
                      :checked="isCheckedCategory(category.key)"
                      @update:checked="handleCategoryCheckAll(category.key, $event)">
                      全选
                    </n-checkbox>
                  </div>

                  <n-space class="permission-items" vertical>
                    <div v-for="permission in getPermissionsByCategory(category.key)" :key="permission.key"
                      class="permission-item">
                      <n-checkbox v-model:checked="permission.checked"
                        :disabled="isSystemPermission(permission.key) && selectedRole.code === 'ADMIN'">
                        {{ permission.label }}
                        <template #description>
                          <span class="permission-description">{{ permission.description }}</span>
                        </template>
                      </n-checkbox>
                    </div>
                  </n-space>
                </div>
              </div>
            </n-card>
          </div>
        </template>
      </n-card>
    </div>

    <!-- 创建角色对话框 -->
    <n-modal v-model:show="showCreateRoleModal" preset="card" title="创建新角色" style="width: 600px">
      <n-form ref="createRoleForm" :model="createRoleData" :rules="roleFormRules" label-placement="left"
        label-width="80px">
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="createRoleData.name" placeholder="请输入角色名称" />
        </n-form-item>
        <n-form-item label="角色代码" path="code">
          <n-input v-model:value="createRoleData.code" placeholder="请输入角色代码（大写）" />
        </n-form-item>
        <n-form-item label="角色描述" path="description">
          <n-input v-model:value="createRoleData.description" type="textarea" placeholder="请输入角色描述" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <n-button @click="showCreateRoleModal = false">取消</n-button>
          <n-button type="primary" @click="submitCreateRole">创建</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 编辑角色对话框 -->
    <n-modal v-model:show="showEditRoleModal" preset="card" title="编辑角色" style="width: 600px">
      <n-form ref="editRoleForm" :model="editRoleData" :rules="roleFormRules" label-placement="left" label-width="80px">
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="editRoleData.name" placeholder="请输入角色名称"
            :disabled="['ADMIN', 'USER'].includes(editRoleData.code)" />
        </n-form-item>
        <n-form-item label="角色代码" path="code">
          <n-input v-model:value="editRoleData.code" placeholder="请输入角色代码（大写）" disabled />
        </n-form-item>
        <n-form-item label="角色描述" path="description">
          <n-input v-model:value="editRoleData.description" type="textarea" placeholder="请输入角色描述" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <n-button @click="showEditRoleModal = false">取消</n-button>
          <n-button type="primary" @click="submitEditRole">保存</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 删除角色确认对话框 -->
    <n-modal v-model:show="showDeleteRoleModal" preset="dialog" title="删除角色" positive-text="确认删除" negative-text="取消"
      @positive-click="deleteRole" @negative-click="showDeleteRoleModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除角色 <strong>{{ deleteRoleData?.name }}</strong> 吗？所有分配到该角色的用户将失去相应权限。</div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, computed, onMounted } from 'vue'
  import {
    NButton,
    NButtonGroup,
    NCard,
    NSpace,
    NIcon,
    NMenu,
    NInput,
    NForm,
    NFormItem,
    NCheckbox,
    NEmpty,
    NTag,
    NModal,
    useMessage,
    NAlert,
    FormRules,
    FormInst,
    MenuOption
  } from 'naive-ui'
  import {
    AddOutline,
    CreateOutline,
    TrashOutline,
    AlertCircleOutline,
    SearchOutline,
    ShieldOutline,
    PeopleOutline,
    VideocamOutline,
    SettingsOutline,
    AnalyticsOutline,
    NotificationsOutline,
    ColorPaletteOutline,
    ServerOutline
  } from '@vicons/ionicons5'

  // 消息提示
  const message = useMessage()

  // 角色搜索
  const roleSearchQuery = ref('')

  // 当前选中的角色
  const selectedRoleKey = ref<string | null>(null)
  const selectedRole = ref<Role | null>(null)

  // 角色数据
  interface Role {
    id: string
    name: string
    code: string
    description: string
    userCount: number
    createdAt: string
    permissions: string[]
    isSystem: boolean
  }

  // 权限数据
  interface Permission {
    key: string
    label: string
    description: string
    category: string
    checked: boolean
  }

  // 权限分类
  interface PermissionCategory {
    key: string
    label: string
    icon: any
  }

  // 角色列表
  const roles = ref<Role[]>([])

  // 权限分类
  const permissionCategories = [
    { key: 'dashboard', label: '仪表盘', icon: AnalyticsOutline },
    { key: 'user', label: '用户管理', icon: PeopleOutline },
    { key: 'content', label: '内容管理', icon: VideocamOutline },
    { key: 'system', label: '系统管理', icon: SettingsOutline },
    { key: 'notification', label: '通知管理', icon: NotificationsOutline },
    { key: 'appearance', label: '外观设置', icon: ColorPaletteOutline },
    { key: 'log', label: '日志管理', icon: ServerOutline }
  ]

  // 所有权限列表
  const allPermissions = ref<Permission[]>([
    // 仪表盘权限
    { key: 'dashboard:view', label: '查看仪表盘', description: '允许访问管理后台仪表盘', category: 'dashboard', checked: false },

    // 用户管理权限
    { key: 'user:view', label: '查看用户', description: '允许查看用户列表和详情', category: 'user', checked: false },
    { key: 'user:create', label: '创建用户', description: '允许创建新用户', category: 'user', checked: false },
    { key: 'user:edit', label: '编辑用户', description: '允许编辑用户资料', category: 'user', checked: false },
    { key: 'user:delete', label: '删除用户', description: '允许删除用户', category: 'user', checked: false },
    { key: 'user:ban', label: '禁用用户', description: '允许禁用或解禁用户', category: 'user', checked: false },
    { key: 'creator:approve', label: '创作者审核', description: '允许审核创作者认证申请', category: 'user', checked: false },
    { key: 'role:manage', label: '管理角色', description: '允许管理角色和权限', category: 'user', checked: false },

    // 内容管理权限
    { key: 'content:view', label: '查看内容', description: '允许查看所有视频和评论', category: 'content', checked: false },
    { key: 'content:approve', label: '审核内容', description: '允许审核视频和评论', category: 'content', checked: false },
    { key: 'content:edit', label: '编辑内容', description: '允许编辑任何用户的视频', category: 'content', checked: false },
    { key: 'content:delete', label: '删除内容', description: '允许删除任何用户的视频或评论', category: 'content', checked: false },
    { key: 'category:manage', label: '管理分类', description: '允许管理视频分类', category: 'content', checked: false },
    { key: 'tag:manage', label: '管理标签', description: '允许管理视频标签', category: 'content', checked: false },
    { key: 'report:handle', label: '处理举报', description: '允许处理内容和用户举报', category: 'content', checked: false },

    // 系统管理权限
    { key: 'system:view', label: '查看系统设置', description: '允许查看系统设置', category: 'system', checked: false },
    { key: 'system:edit', label: '编辑系统设置', description: '允许修改系统设置', category: 'system', checked: false },
    { key: 'system:advanced', label: '高级系统设置', description: '允许修改高级系统设置', category: 'system', checked: false },

    // 通知管理权限
    { key: 'notification:view', label: '查看通知', description: '允许查看系统通知', category: 'notification', checked: false },
    { key: 'notification:send', label: '发送通知', description: '允许发送系统通知', category: 'notification', checked: false },

    // 外观设置权限
    { key: 'appearance:view', label: '查看外观设置', description: '允许查看外观设置', category: 'appearance', checked: false },
    { key: 'appearance:edit', label: '编辑外观设置', description: '允许修改外观设置', category: 'appearance', checked: false },

    // 日志管理权限
    { key: 'log:view', label: '查看日志', description: '允许查看系统日志', category: 'log', checked: false },
    { key: 'log:export', label: '导出日志', description: '允许导出系统日志', category: 'log', checked: false },

    // 创作者权限
    { key: 'creator:upload', label: '上传视频', description: '允许上传视频内容', category: 'content', checked: false },
    { key: 'creator:manage', label: '管理自己的内容', description: '允许管理自己上传的视频', category: 'content', checked: false },
    { key: 'creator:comment', label: '管理评论区', description: '允许管理视频评论区', category: 'content', checked: false },
    { key: 'creator:analytics', label: '查看数据分析', description: '允许查看自己内容的数据分析', category: 'dashboard', checked: false },
  ])

  // 创建角色表单状态
  const showCreateRoleModal = ref(false)
  const createRoleForm = ref<FormInst | null>(null)
  const createRoleData = reactive({
    name: '',
    code: '',
    description: ''
  })

  // 编辑角色表单状态
  const showEditRoleModal = ref(false)
  const editRoleForm = ref<FormInst | null>(null)
  const editRoleData = reactive({
    id: '',
    name: '',
    code: '',
    description: ''
  })

  // 删除角色状态
  const showDeleteRoleModal = ref(false)
  const deleteRoleData = ref<Role | null>(null)

  // 表单验证规则
  const roleFormRules: FormRules = {
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入角色代码', trigger: 'blur' },
      { pattern: /^[A-Z_]+$/, message: '角色代码只能包含大写字母和下划线', trigger: 'blur' }
    ],
    description: [
      { required: true, message: '请输入角色描述', trigger: 'blur' }
    ]
  }

  // 获取角色表格行样式
  function getRoleType(code: string) {
    const typeMap: Record<string, 'default' | 'primary' | 'info' | 'success' | 'warning'> = {
      'ADMIN': 'primary',
      'CREATOR': 'success',
      'USER': 'info',
      'GUEST': 'default'
    }
    return typeMap[code] || 'warning'
  }

  // 根据分类获取权限
  function getPermissionsByCategory(category: string) {
    return allPermissions.value.filter(p => p.category === category)
  }

  // 检查分类是否全选
  function isCheckedCategory(category: string) {
    const categoryPermissions = getPermissionsByCategory(category)
    return categoryPermissions.length > 0 && categoryPermissions.every(p => p.checked)
  }

  // 检查分类是否部分选中
  function isIndeterminateCategory(category: string) {
    const categoryPermissions = getPermissionsByCategory(category)
    const checkedCount = categoryPermissions.filter(p => p.checked).length
    return checkedCount > 0 && checkedCount < categoryPermissions.length
  }

  // 分类全选/取消全选
  function handleCategoryCheckAll(category: string, checked: boolean) {
    const categoryPermissions = getPermissionsByCategory(category)
    categoryPermissions.forEach(p => {
      // 不修改系统权限
      if (!(isSystemPermission(p.key) && selectedRole.value?.code === 'ADMIN')) {
        p.checked = checked
      }
    })
  }

  // 是否为系统核心权限
  function isSystemPermission(key: string) {
    const systemPermissions = [
      'dashboard:view',
      'user:view',
      'role:manage',
      'system:view'
    ]
    return systemPermissions.includes(key)
  }

  // 角色菜单选项
  const rolesMenuOptions = computed<MenuOption[]>(() => {
    let filteredRoles = roles.value

    // 应用搜索过滤
    if (roleSearchQuery.value) {
      const query = roleSearchQuery.value.toLowerCase()
      filteredRoles = filteredRoles.filter(role =>
        role.name.toLowerCase().includes(query) ||
        role.code.toLowerCase().includes(query)
      )
    }

    return filteredRoles.map(role => ({
      label: () => h(
        'div',
        { style: 'display: flex; justify-content: space-between; align-items: center;' },
        [
          h('span', null, role.name),
          h(NTag, { size: 'small', type: getRoleType(role.code) }, { default: () => role.code })
        ]
      ),
      key: role.id,
      role
    }))
  })

  // 选择角色
  function handleRoleSelect(key: string) {
    const role = roles.value.find(r => r.id === key)
    if (role) {
      selectedRole.value = role

      // 重置权限选择状态
      allPermissions.value.forEach(p => {
        p.checked = role.permissions.includes(p.key)
      })
    }
  }

  // 编辑角色
  function editRole(role: Role) {
    editRoleData.id = role.id
    editRoleData.name = role.name
    editRoleData.code = role.code
    editRoleData.description = role.description
    showEditRoleModal.value = true
  }

  // 确认删除角色
  function confirmDeleteRole(role: Role) {
    if (['ADMIN', 'USER'].includes(role.code)) {
      message.error('系统内置角色不能删除')
      return
    }

    deleteRoleData.value = role
    showDeleteRoleModal.value = true
  }

  // 删除角色
  async function deleteRole() {
    if (!deleteRoleData.value) return

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从本地列表中移除
      roles.value = roles.value.filter(r => r.id !== deleteRoleData.value?.id)

      message.success(`角色 ${deleteRoleData.value.name} 已删除`)

      // 如果当前选中的是被删除的角色，重置选择
      if (selectedRoleKey.value === deleteRoleData.value.id) {
        selectedRoleKey.value = null
        selectedRole.value = null
      }

      showDeleteRoleModal.value = false
      deleteRoleData.value = null
    } catch (error) {
      message.error('删除角色失败')
      console.error('删除角色失败:', error)
    }
  }

  // 提交创建角色
  async function submitCreateRole() {
    if (!createRoleForm.value) return

    try {
      await createRoleForm.value.validate()

      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查代码是否已存在
      if (roles.value.some(r => r.code === createRoleData.code)) {
        message.error(`角色代码 ${createRoleData.code} 已存在`)
        return
      }

      // 创建新角色
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: createRoleData.name,
        code: createRoleData.code,
        description: createRoleData.description,
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        permissions: [],
        isSystem: false
      }

      // 添加到列表
      roles.value.push(newRole)

      message.success(`角色 ${newRole.name} 创建成功`)
      showCreateRoleModal.value = false

      // 重置表单
      createRoleData.name = ''
      createRoleData.code = ''
      createRoleData.description = ''

      // 选中新创建的角色
      selectedRoleKey.value = newRole.id
      handleRoleSelect(newRole.id)
    } catch (error) {
      message.error('创建角色失败')
      console.error('创建角色失败:', error)
    }
  }

  // 提交编辑角色
  async function submitEditRole() {
    if (!editRoleForm.value) return

    try {
      await editRoleForm.value.validate()

      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新角色信息
      const index = roles.value.findIndex(r => r.id === editRoleData.id)
      if (index !== -1) {
        roles.value[index].name = editRoleData.name
        roles.value[index].description = editRoleData.description

        // 如果当前选中的是被编辑的角色，更新选择
        if (selectedRole.value && selectedRole.value.id === editRoleData.id) {
          selectedRole.value.name = editRoleData.name
          selectedRole.value.description = editRoleData.description
        }
      }

      message.success(`角色 ${editRoleData.name} 更新成功`)
      showEditRoleModal.value = false
    } catch (error) {
      message.error('更新角色失败')
      console.error('更新角色失败:', error)
    }
  }

  // 保存权限设置
  async function savePermissions() {
    if (!selectedRole.value) return

    try {
      // 获取选中的权限
      const selectedPermissions = allPermissions.value
        .filter(p => p.checked)
        .map(p => p.key)

      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新角色权限
      const index = roles.value.findIndex(r => r.id === selectedRole.value?.id)
      if (index !== -1) {
        roles.value[index].permissions = selectedPermissions

        // 更新选中角色的权限
        if (selectedRole.value) {
          selectedRole.value.permissions = selectedPermissions
        }
      }

      message.success('权限设置已保存')
    } catch (error) {
      message.error('保存权限失败')
      console.error('保存权限失败:', error)
    }
  }

  // 加载角色数据
  async function loadRolesData() {
    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟角色数据
      const mockRoles: Role[] = [
        {
          id: 'role-1',
          name: '管理员',
          code: 'ADMIN',
          description: '系统最高权限角色，可以执行所有操作',
          userCount: 3,
          createdAt: '2025-01-01',
          permissions: allPermissions.value.map(p => p.key),
          isSystem: true
        },
        {
          id: 'role-2',
          name: '创作者',
          code: 'CREATOR',
          description: '视频创作者角色，可以上传和管理自己的内容',
          userCount: 216,
          createdAt: '2025-01-20',
          permissions: [
            'creator:upload',
            'creator:manage',
            'creator:comment',
            'creator:analytics',
            'content:view'
          ],
          isSystem: true
        },
        {
          id: 'role-3',
          name: '普通用户',
          code: 'USER',
          description: '基础用户角色，可以观看视频和发表评论',
          userCount: 12532,
          createdAt: '2025-01-01',
          permissions: [],
          isSystem: true
        },
        {
          id: 'role-4',
          name: '游客',
          code: 'GUEST',
          description: '未登录用户，仅用于权限检查，不存储在数据库中',
          userCount: 0,
          createdAt: '2025-01-01',
          permissions: [],
          isSystem: true
        }
      ]

      roles.value = mockRoles

      // 默认选中第一个角色
      if (mockRoles.length > 0) {
        selectedRoleKey.value = mockRoles[0].id
        handleRoleSelect(mockRoles[0].id)
      }
    } catch (error) {
      message.error('加载角色数据失败')
      console.error('加载角色数据失败:', error)
    }
  }

  // 初始化
  onMounted(() => {
    loadRolesData()
  })
</script>

<style scoped>
  .roles-page {
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

  .roles-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
  }

  .roles-sidebar {
    height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .role-detail {
    height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .role-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .role-name {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .role-name h2 {
    margin: 0;
  }

  .role-description {
    margin-bottom: 16px;
    color: var(--text-color-secondary);
  }

  .role-meta {
    display: flex;
    gap: 24px;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  .permissions-section {
    margin-top: 32px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-header h3 {
    margin: 0;
  }

  .permissions-description {
    margin-bottom: 24px;
    color: var(--text-color-secondary);
  }

  .permission-category {
    margin-bottom: 16px;
  }

  .permission-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .group-header {
    margin-bottom: 12px;
  }

  .permission-items {
    padding-left: 12px;
  }

  .permission-item {
    margin-bottom: 8px;
  }

  .permission-description {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
  }

  @media (max-width: 1200px) {
    .roles-layout {
      grid-template-columns: 250px 1fr;
    }
  }

  @media (max-width: 768px) {
    .roles-layout {
      grid-template-columns: 1fr;
    }

    .roles-sidebar {
      height: auto;
    }

    .role-detail-header {
      flex-direction: column;
      gap: 16px;
    }

    .role-actions {
      width: 100%;
    }
  }
</style>