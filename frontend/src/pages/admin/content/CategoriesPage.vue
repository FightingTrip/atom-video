/**
* 管理后台分类管理页面
*
* 用于管理员管理视频分类
*/

<template>
  <div class="categories-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">分类管理</h1>
      <div class="page-actions">
        <n-button type="primary" @click="showCreateModal = true">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          创建分类
        </n-button>
      </div>
    </div>

    <!-- 分类列表和树形结构 -->
    <div class="categories-content">
      <!-- 左侧分类树 -->
      <n-card title="分类结构" class="tree-card">
        <div class="tree-actions">
          <n-button-group size="small">
            <n-button @click="expandAll">展开全部</n-button>
            <n-button @click="collapseAll">收起全部</n-button>
          </n-button-group>
        </div>
        <n-spin :show="treeLoading">
          <n-tree ref="treeRef" :data="categoryTree" :expanded-keys="expandedKeys" :selected-keys="selectedKeys"
            block-line selectable @update:selected-keys="handleSelect" @update:expanded-keys="handleExpand">
            <template #default="{ option }">
              <div class="tree-node">
                <span class="tree-node-label">{{ option.label }}</span>
                <span class="tree-node-count" v-if="option.videoCount !== undefined">({{ option.videoCount }})</span>
              </div>
            </template>
          </n-tree>
        </n-spin>
      </n-card>

      <!-- 右侧分类详情 -->
      <n-card v-if="currentCategory" :title="currentCategory.name + ' 分类详情'" class="detail-card">
        <template #header-extra>
          <n-space>
            <n-button size="small" @click="editCategory(currentCategory)">编辑</n-button>
            <n-button size="small" type="error" @click="deleteCategory(currentCategory)"
              :disabled="hasChildren(currentCategory.id)">
              删除
            </n-button>
          </n-space>
        </template>

        <n-descriptions bordered :column="1">
          <n-descriptions-item label="分类ID">
            {{ currentCategory.id }}
          </n-descriptions-item>
          <n-descriptions-item label="分类名称">
            {{ currentCategory.name }}
          </n-descriptions-item>
          <n-descriptions-item label="分类描述">
            {{ currentCategory.description || '无' }}
          </n-descriptions-item>
          <n-descriptions-item label="父级分类">
            {{ getParentCategoryName(currentCategory.parentId) }}
          </n-descriptions-item>
          <n-descriptions-item label="视频数量">
            {{ currentCategory.videoCount }}
          </n-descriptions-item>
          <n-descriptions-item label="创建时间">
            {{ currentCategory.createdAt }}
          </n-descriptions-item>
          <n-descriptions-item label="更新时间">
            {{ currentCategory.updatedAt }}
          </n-descriptions-item>
          <n-descriptions-item label="排序值">
            {{ currentCategory.sortOrder }}
          </n-descriptions-item>
          <n-descriptions-item label="状态">
            <n-tag :type="currentCategory.isActive ? 'success' : 'error'">
              {{ currentCategory.isActive ? '启用' : '禁用' }}
            </n-tag>
          </n-descriptions-item>
        </n-descriptions>

        <template v-if="currentCategory.children && currentCategory.children.length">
          <div class="subcategories-section">
            <h3>子分类列表</h3>
            <n-data-table :columns="subCategoriesColumns" :data="currentCategory.children" :pagination="{ pageSize: 5 }"
              :bordered="false" size="small" />
          </div>
        </template>

        <div class="category-actions">
          <n-space>
            <n-button @click="showCreateModal = true" :disabled="currentCategory.level >= 3">
              添加子分类
            </n-button>
            <n-button @click="toggleCategoryStatus(currentCategory)">
              {{ currentCategory.isActive ? '禁用分类' : '启用分类' }}
            </n-button>
          </n-space>
        </div>
      </n-card>

      <n-card v-else title="分类详情" class="detail-card">
        <n-empty description="请选择一个分类查看详情">
          <template #extra>
            <n-button @click="showCreateModal = true">
              创建根分类
            </n-button>
          </template>
        </n-empty>
      </n-card>
    </div>

    <!-- 创建/编辑分类对话框 -->
    <n-modal v-model:show="showCreateModal" :title="isEdit ? '编辑分类' : '创建分类'" preset="card" style="width: 500px">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="100px">
        <n-form-item label="分类名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入分类名称" />
        </n-form-item>
        <n-form-item label="父级分类" path="parentId">
          <n-select v-model:value="formData.parentId" :options="parentCategoryOptions" placeholder="选择父级分类" clearable />
        </n-form-item>
        <n-form-item label="分类描述" path="description">
          <n-input v-model:value="formData.description" type="textarea" placeholder="请输入分类描述" :rows="3" />
        </n-form-item>
        <n-form-item label="排序值" path="sortOrder">
          <n-input-number v-model:value="formData.sortOrder" :min="0" :max="1000" />
        </n-form-item>
        <n-form-item label="状态" path="isActive">
          <n-switch v-model:value="formData.isActive" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" @click="submitCategoryForm">{{ isEdit ? '保存' : '创建' }}</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 删除分类确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="删除分类" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="showDeleteModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除分类 <strong>{{ deleteTarget?.name }}</strong> 吗？此操作不可逆。</div>
      <div v-if="deleteTarget?.videoCount > 0" class="delete-warning">
        注意：该分类下有 {{ deleteTarget?.videoCount }} 个视频，删除分类后，这些视频将变为未分类状态。
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, computed, onMounted } from 'vue'
  import {
    NButton,
    NButtonGroup,
    NCard,
    NTree,
    NDescriptions,
    NDescriptionsItem,
    NSpace,
    NTag,
    NModal,
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NInputNumber,
    NSwitch,
    NSpin,
    NEmpty,
    NDataTable,
    NIcon,
    useMessage,
    FormInst,
    FormRules,
    TreeOption
  } from 'naive-ui'
  import {
    AddOutline,
    AlertCircleOutline,
    CreateOutline,
    TrashOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'

  // 分类数据类型
  interface Category {
    id: string
    name: string
    description: string
    parentId: string | null
    level: number
    sortOrder: number
    isActive: boolean
    videoCount: number
    createdAt: string
    updatedAt: string
    children?: Category[]
  }

  // 消息提示
  const message = useMessage()

  // 加载状态
  const treeLoading = ref(false)

  // 分类树状态
  const treeRef = ref(null)
  const expandedKeys = ref<string[]>([])
  const selectedKeys = ref<string[]>([])
  const categoryData = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)

  // 转换分类数据为树形结构
  const categoryTree = computed(() => {
    return formatCategoryTree(categoryData.value)
  })

  // 创建/编辑分类状态
  const showCreateModal = ref(false)
  const isEdit = ref(false)
  const formRef = ref<FormInst | null>(null)
  const formData = reactive({
    id: '',
    name: '',
    description: '',
    parentId: null as string | null,
    sortOrder: 0,
    isActive: true
  })

  // 父级分类选项
  const parentCategoryOptions = computed(() => {
    return categoryData.value.map(category => ({
      label: category.name,
      value: category.id,
      disabled: isEdit.value && (
        // 不能选择自己作为父级
        category.id === formData.id ||
        // 不能选择自己的子孙节点作为父级
        isDescendantOf(category, formData.id)
      )
    }))
  })

  // 判断一个分类是否是指定分类的子孙节点
  function isDescendantOf(category: Category, parentId: string): boolean {
    if (category.parentId === parentId) return true
    const parent = categoryData.value.find(c => c.id === category.parentId)
    if (!parent) return false
    return isDescendantOf(parent, parentId)
  }

  // 删除分类状态
  const showDeleteModal = ref(false)
  const deleteTarget = ref<Category | null>(null)

  // 表单验证规则
  const formRules: FormRules = {
    name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
  }

  // 子分类表格列
  const subCategoriesColumns = ref<DataTableColumns<Category>>([
    {
      title: '名称',
      key: 'name',
      width: 160
    },
    {
      title: '视频数量',
      key: 'videoCount',
      width: 100
    },
    {
      title: '状态',
      key: 'isActive',
      width: 80,
      render(row) {
        return h(NTag, { type: row.isActive ? 'success' : 'error', size: 'small' }, {
          default: () => row.isActive ? '启用' : '禁用'
        })
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render(row) {
        return h(NSpace, { align: 'center', justify: 'center' }, {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => editCategory(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }
            ),
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => deleteCategory(row),
                disabled: hasChildren(row.id)
              },
              { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
            )
          ]
        })
      }
    }
  ])

  // 格式化分类数据为树形结构
  function formatCategoryTree(categories: Category[]): TreeOption[] {
    // 找出所有根分类（没有父级或父级ID为空）
    const rootCategories = categories.filter(c => !c.parentId)

    // 递归构建树形结构
    function buildTree(parentId: string | null): TreeOption[] {
      return categories
        .filter(c => c.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(c => ({
          key: c.id,
          label: c.name,
          videoCount: c.videoCount,
          isActive: c.isActive,
          children: buildTree(c.id)
        }))
    }

    return buildTree(null)
  }

  // 获取父级分类名称
  function getParentCategoryName(parentId: string | null): string {
    if (!parentId) return '无 (根分类)'
    const parent = categoryData.value.find(c => c.id === parentId)
    return parent ? parent.name : '未知分类'
  }

  // 检查分类是否有子分类
  function hasChildren(categoryId: string): boolean {
    return categoryData.value.some(c => c.parentId === categoryId)
  }

  // 处理分类选择
  function handleSelect(keys: string[]) {
    selectedKeys.value = keys
    if (keys.length > 0) {
      const selectedCategory = categoryData.value.find(c => c.id === keys[0])
      if (selectedCategory) {
        currentCategory.value = selectedCategory
      }
    } else {
      currentCategory.value = null
    }
  }

  // 处理分类展开/折叠
  function handleExpand(keys: string[]) {
    expandedKeys.value = keys
  }

  // 展开所有节点
  function expandAll() {
    expandedKeys.value = categoryData.value.map(c => c.id)
  }

  // 折叠所有节点
  function collapseAll() {
    expandedKeys.value = []
  }

  // 编辑分类
  function editCategory(category: Category) {
    isEdit.value = true
    formData.id = category.id
    formData.name = category.name
    formData.description = category.description || ''
    formData.parentId = category.parentId
    formData.sortOrder = category.sortOrder
    formData.isActive = category.isActive
    showCreateModal.value = true
  }

  // 删除分类
  function deleteCategory(category: Category) {
    if (hasChildren(category.id)) {
      message.warning('该分类下有子分类，不能直接删除')
      return
    }
    deleteTarget.value = category
    showDeleteModal.value = true
  }

  // 确认删除分类
  async function confirmDelete() {
    if (!deleteTarget.value) return

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从列表中删除
      categoryData.value = categoryData.value.filter(c => c.id !== deleteTarget.value?.id)

      // 如果当前正在查看该分类，清空选择
      if (currentCategory.value && currentCategory.value.id === deleteTarget.value.id) {
        currentCategory.value = null
        selectedKeys.value = []
      }

      message.success('分类删除成功')
      showDeleteModal.value = false
      deleteTarget.value = null
    } catch (error) {
      console.error('删除分类失败:', error)
      message.error('删除分类失败')
    }
  }

  // 切换分类状态
  async function toggleCategoryStatus(category: Category) {
    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新分类状态
      const index = categoryData.value.findIndex(c => c.id === category.id)
      if (index !== -1) {
        categoryData.value[index].isActive = !categoryData.value[index].isActive

        // 更新当前选中的分类
        if (currentCategory.value && currentCategory.value.id === category.id) {
          currentCategory.value.isActive = categoryData.value[index].isActive
        }
      }

      message.success(`分类已${category.isActive ? '禁用' : '启用'}`)
    } catch (error) {
      console.error('更新分类状态失败:', error)
      message.error('操作失败')
    }
  }

  // 提交分类表单
  async function submitCategoryForm() {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      if (isEdit.value) {
        // 更新现有分类
        const index = categoryData.value.findIndex(c => c.id === formData.id)
        if (index !== -1) {
          // 更新分类数据
          categoryData.value[index] = {
            ...categoryData.value[index],
            name: formData.name,
            description: formData.description,
            parentId: formData.parentId,
            sortOrder: formData.sortOrder,
            isActive: formData.isActive,
            updatedAt: new Date().toISOString().split('T')[0]
          }

          // 如果当前正在查看该分类，更新当前选中的分类
          if (currentCategory.value && currentCategory.value.id === formData.id) {
            currentCategory.value = { ...categoryData.value[index] }
          }
        }

        message.success('分类更新成功')
      } else {
        // 创建新分类
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId,
          level: formData.parentId ?
            (categoryData.value.find(c => c.id === formData.parentId)?.level || 0) + 1 : 0,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive,
          videoCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        }

        // 添加到分类列表
        categoryData.value.push(newCategory)

        // 选中新创建的分类
        selectedKeys.value = [newCategory.id]
        currentCategory.value = newCategory

        // 如果有父分类，展开父分类节点
        if (newCategory.parentId) {
          expandedKeys.value = [...new Set([...expandedKeys.value, newCategory.parentId])]
        }

        message.success('分类创建成功')
      }

      // 重置表单并关闭对话框
      resetForm()
      showCreateModal.value = false
    } catch (error) {
      console.error('提交分类表单失败:', error)
      message.error('操作失败')
    }
  }

  // 重置表单
  function resetForm() {
    isEdit.value = false
    formData.id = ''
    formData.name = ''
    formData.description = ''
    formData.parentId = currentCategory.value?.id || null
    formData.sortOrder = 0
    formData.isActive = true
    if (formRef.value) {
      formRef.value.restoreValidation()
    }
  }

  // 加载分类数据
  async function loadCategories() {
    treeLoading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成模拟数据
      const mockCategories: Category[] = [
        {
          id: 'cat-1',
          name: '游戏',
          description: '游戏相关的视频内容',
          parentId: null,
          level: 0,
          sortOrder: 0,
          isActive: true,
          videoCount: 150,
          createdAt: '2024-03-15',
          updatedAt: '2024-03-15'
        },
        {
          id: 'cat-2',
          name: '音乐',
          description: '音乐相关的视频内容',
          parentId: null,
          level: 0,
          sortOrder: 1,
          isActive: true,
          videoCount: 200,
          createdAt: '2024-03-15',
          updatedAt: '2024-04-01'
        },
        {
          id: 'cat-3',
          name: '教育',
          description: '教育相关的视频内容',
          parentId: null,
          level: 0,
          sortOrder: 2,
          isActive: true,
          videoCount: 120,
          createdAt: '2024-03-15',
          updatedAt: '2024-03-20'
        },
        {
          id: 'cat-4',
          name: '动作游戏',
          description: '动作类游戏视频',
          parentId: 'cat-1',
          level: 1,
          sortOrder: 0,
          isActive: true,
          videoCount: 50,
          createdAt: '2024-03-15',
          updatedAt: '2024-03-15'
        },
        {
          id: 'cat-5',
          name: '角色扮演游戏',
          description: 'RPG游戏视频',
          parentId: 'cat-1',
          level: 1,
          sortOrder: 1,
          isActive: true,
          videoCount: 40,
          createdAt: '2024-03-15',
          updatedAt: '2024-03-15'
        },
        {
          id: 'cat-6',
          name: '策略游戏',
          description: '策略类游戏视频',
          parentId: 'cat-1',
          level: 1,
          sortOrder: 2,
          isActive: true,
          videoCount: 30,
          createdAt: '2024-03-15',
          updatedAt: '2024-03-15'
        },
        {
          id: 'cat-7',
          name: '流行音乐',
          description: '流行音乐相关视频',
          parentId: 'cat-2',
          level: 1,
          sortOrder: 0,
          isActive: true,
          videoCount: 100,
          createdAt: '2024-03-16',
          updatedAt: '2024-03-16'
        },
        {
          id: 'cat-8',
          name: '古典音乐',
          description: '古典音乐相关视频',
          parentId: 'cat-2',
          level: 1,
          sortOrder: 1,
          isActive: true,
          videoCount: 30,
          createdAt: '2024-03-16',
          updatedAt: '2024-03-16'
        },
        {
          id: 'cat-9',
          name: '编程教学',
          description: '编程相关教学视频',
          parentId: 'cat-3',
          level: 1,
          sortOrder: 0,
          isActive: true,
          videoCount: 60,
          createdAt: '2024-03-17',
          updatedAt: '2024-03-17'
        },
        {
          id: 'cat-10',
          name: '语言学习',
          description: '语言学习相关视频',
          parentId: 'cat-3',
          level: 1,
          sortOrder: 1,
          isActive: true,
          videoCount: 40,
          createdAt: '2024-03-17',
          updatedAt: '2024-03-17'
        },
        {
          id: 'cat-11',
          name: '前端开发',
          description: '前端开发教学视频',
          parentId: 'cat-9',
          level: 2,
          sortOrder: 0,
          isActive: true,
          videoCount: 30,
          createdAt: '2024-03-18',
          updatedAt: '2024-03-18'
        },
        {
          id: 'cat-12',
          name: '后端开发',
          description: '后端开发教学视频',
          parentId: 'cat-9',
          level: 2,
          sortOrder: 1,
          isActive: true,
          videoCount: 25,
          createdAt: '2024-03-18',
          updatedAt: '2024-03-18'
        },
        {
          id: 'cat-13',
          name: '网络安全',
          description: '网络安全相关课程',
          parentId: 'cat-9',
          level: 2,
          sortOrder: 2,
          isActive: false,
          videoCount: 5,
          createdAt: '2024-03-18',
          updatedAt: '2024-03-18'
        }
      ]

      // 为每个分类添加children字段
      mockCategories.forEach(category => {
        category.children = mockCategories.filter(c => c.parentId === category.id)
      })

      categoryData.value = mockCategories

      // 默认展开第一级分类
      expandedKeys.value = mockCategories
        .filter(c => c.level === 0)
        .map(c => c.id)

      // 默认选中第一个分类
      if (mockCategories.length > 0) {
        selectedKeys.value = [mockCategories[0].id]
        currentCategory.value = mockCategories[0]
      }
    } catch (error) {
      console.error('加载分类数据失败:', error)
      message.error('加载分类数据失败')
    } finally {
      treeLoading.value = false
    }
  }

  // 初始化
  onMounted(() => {
    loadCategories()
  })
</script>

<style scoped>
  .categories-page {
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

  .categories-content {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
  }

  .tree-card {
    height: fit-content;
  }

  .detail-card {
    height: fit-content;
  }

  .tree-actions {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tree-node-count {
    font-size: 0.85em;
    color: var(--text-color-secondary);
  }

  .subcategories-section {
    margin-top: 24px;
  }

  .category-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }

  .delete-warning {
    margin-top: 12px;
    padding: 8px 12px;
    background-color: rgba(237, 85, 59, 0.1);
    border-left: 4px solid #ed553b;
    border-radius: 4px;
  }

  h3 {
    margin: 0 0 16px 0;
    font-size: 1rem;
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    .categories-content {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
</style>