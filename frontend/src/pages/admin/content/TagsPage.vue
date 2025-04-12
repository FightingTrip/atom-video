/**
* 管理后台标签管理页面
*
* 用于管理员管理视频标签
*/
<template>
  <div class="tags-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">标签管理</h1>
      <div class="page-actions">
        <n-button type="primary" @click="showCreateModal = true">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          创建标签
        </n-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <n-card class="filter-card">
      <n-grid :cols="24" :x-gap="12">
        <n-grid-item :span="6">
          <n-input v-model:value="searchQuery" placeholder="搜索标签名称">
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="statusFilter" :options="statusOptions" placeholder="标签状态" clearable />
        </n-grid-item>
        <n-grid-item :span="4">
          <n-select v-model:value="typeFilter" :options="typeOptions" placeholder="标签类型" clearable />
        </n-grid-item>
        <n-grid-item :span="10">
          <div class="filter-buttons">
            <n-button type="primary" @click="handleSearch">查询</n-button>
            <n-button @click="resetFilters">重置</n-button>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 标签列表 -->
    <n-card class="data-card">
      <n-data-table ref="table" :columns="columns" :data="filteredTags" :pagination="pagination" :loading="loading"
        :row-key="row => row.id" />
    </n-card>

    <!-- 创建/编辑标签对话框 -->
    <n-modal v-model:show="showCreateModal" :title="isEdit ? '编辑标签' : '创建标签'" preset="card" style="width: 500px">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="80px">
        <n-form-item label="标签名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入标签名称" />
        </n-form-item>
        <n-form-item label="标签类型" path="type">
          <n-select v-model:value="formData.type" :options="typeOptions" placeholder="请选择标签类型" />
        </n-form-item>
        <n-form-item label="标签描述" path="description">
          <n-input v-model:value="formData.description" type="textarea" placeholder="请输入标签描述" :rows="3" />
        </n-form-item>
        <n-form-item label="排序值" path="sortOrder">
          <n-input-number v-model:value="formData.sortOrder" :min="0" :max="1000" />
        </n-form-item>
        <n-form-item label="状态" path="isActive">
          <n-switch v-model:value="formData.isActive" />
        </n-form-item>
        <n-form-item label="是否热门" path="isHot">
          <n-switch v-model:value="formData.isHot" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" @click="submitTagForm">{{ isEdit ? '保存' : '创建' }}</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 删除标签确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="删除标签" positive-text="确认删除" negative-text="取消"
      @positive-click="confirmDelete" @negative-click="showDeleteModal = false">
      <template #icon>
        <n-icon color="#f00">
          <AlertCircleOutline />
        </n-icon>
      </template>
      <div>确认要删除标签 <strong>{{ deleteTag?.name }}</strong> 吗？此操作不可逆。</div>
      <div v-if="deleteTag?.videoCount > 0" class="delete-warning">
        注意：该标签已被 {{ deleteTag?.videoCount }} 个视频使用，删除后这些视频将移除此标签。
      </div>
    </n-modal>

    <!-- 标签详情抽屉 -->
    <n-drawer v-model:show="showDetailDrawer" :width="500" placement="right">
      <n-drawer-content :title="`标签详情 - ${currentTag?.name || ''}`">
        <div v-if="currentTag" class="tag-detail">
          <n-descriptions bordered :column="1" size="medium">
            <n-descriptions-item label="标签ID">
              {{ currentTag.id }}
            </n-descriptions-item>
            <n-descriptions-item label="标签名称">
              {{ currentTag.name }}
            </n-descriptions-item>
            <n-descriptions-item label="标签类型">
              <n-tag :type="getTagTypeColor(currentTag.type)">
                {{ getTagTypeName(currentTag.type) }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="标签描述">
              {{ currentTag.description || '无' }}
            </n-descriptions-item>
            <n-descriptions-item label="使用次数">
              {{ currentTag.videoCount }} 个视频
            </n-descriptions-item>
            <n-descriptions-item label="创建时间">
              {{ currentTag.createdAt }}
            </n-descriptions-item>
            <n-descriptions-item label="更新时间">
              {{ currentTag.updatedAt }}
            </n-descriptions-item>
            <n-descriptions-item label="排序值">
              {{ currentTag.sortOrder }}
            </n-descriptions-item>
            <n-descriptions-item label="状态">
              <n-tag :type="currentTag.isActive ? 'success' : 'error'">
                {{ currentTag.isActive ? '启用' : '禁用' }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="是否热门">
              <n-tag :type="currentTag.isHot ? 'warning' : 'default'">
                {{ currentTag.isHot ? '热门' : '普通' }}
              </n-tag>
            </n-descriptions-item>
          </n-descriptions>

          <div class="tag-actions">
            <n-space>
              <n-button @click="editTag(currentTag)">编辑标签</n-button>
              <n-button @click="toggleTagStatus(currentTag)">
                {{ currentTag.isActive ? '禁用标签' : '启用标签' }}
              </n-button>
              <n-button type="error" @click="deleteTag = currentTag; showDeleteModal = true">
                删除标签
              </n-button>
            </n-space>
          </div>

          <div class="related-videos" v-if="currentTag.relatedVideos && currentTag.relatedVideos.length > 0">
            <h3>包含此标签的视频</h3>
            <n-list hoverable clickable>
              <n-list-item v-for="video in currentTag.relatedVideos" :key="video.id" @click="viewVideo(video.id)">
                <n-thing :title="video.title" :description="video.createdAt">
                  <template #avatar>
                    <n-avatar :src="video.thumbnailUrl" :size="48" object-fit="cover" round />
                  </template>
                  <template #header-extra>
                    <n-tag size="small" :type="video.status === 'PUBLISHED' ? 'success' : 'warning'">
                      {{ video.status === 'PUBLISHED' ? '已发布' : '未发布' }}
                    </n-tag>
                  </template>
                  <template #description>
                    <span class="video-author">{{ video.author }}</span>
                    <span class="video-views">{{ video.viewCount }} 次观看</span>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
            <div class="view-more">
              <n-button text>查看更多相关视频</n-button>
            </div>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import {
    NButton,
    NCard,
    NDataTable,
    NInput,
    NSelect,
    NGrid,
    NGridItem,
    NIcon,
    NModal,
    NForm,
    NFormItem,
    NInputNumber,
    NSwitch,
    useMessage,
    NTag,
    NSpace,
    NDrawer,
    NDrawerContent,
    NDescriptions,
    NDescriptionsItem,
    NList,
    NListItem,
    NThing,
    NAvatar,
    FormInst,
    FormRules
  } from 'naive-ui'
  import {
    AddOutline,
    SearchOutline,
    AlertCircleOutline,
    CreateOutline,
    TrashOutline,
    EyeOutline,
    FlameOutline
  } from '@vicons/ionicons5'
  import type { DataTableColumns } from 'naive-ui'

  // 路由
  const router = useRouter()
  const message = useMessage()

  // 标签数据类型
  interface Tag {
    id: string
    name: string
    type: string
    description: string
    videoCount: number
    isActive: boolean
    isHot: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
    relatedVideos?: {
      id: string
      title: string
      thumbnailUrl: string
      author: string
      viewCount: number
      status: string
      createdAt: string
    }[]
  }

  // 搜索和筛选状态
  const searchQuery = ref('')
  const statusFilter = ref(null)
  const typeFilter = ref(null)

  // 数据状态
  const loading = ref(false)
  const tags = ref<Tag[]>([])

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 50],
    showSizePicker: true,
    prefix({ itemCount }: { itemCount: number }) {
      return `共 ${itemCount} 个标签`
    }
  })

  // 创建/编辑标签状态
  const showCreateModal = ref(false)
  const isEdit = ref(false)
  const formRef = ref<FormInst | null>(null)
  const formData = reactive({
    id: '',
    name: '',
    type: '',
    description: '',
    sortOrder: 0,
    isActive: true,
    isHot: false
  })

  // 标签删除状态
  const showDeleteModal = ref(false)
  const deleteTag = ref<Tag | null>(null)

  // 标签详情状态
  const showDetailDrawer = ref(false)
  const currentTag = ref<Tag | null>(null)

  // 筛选选项
  const statusOptions = [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]

  const typeOptions = [
    { label: '内容', value: 'CONTENT' },
    { label: '技术', value: 'TECH' },
    { label: '语言', value: 'LANGUAGE' },
    { label: '工具', value: 'TOOL' },
    { label: '年龄', value: 'AGE' },
    { label: '风格', value: 'STYLE' },
    { label: '其他', value: 'OTHER' }
  ]

  // 表单验证规则
  const formRules: FormRules = {
    name: [
      { required: true, message: '请输入标签名称', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择标签类型', trigger: 'change' }
    ]
  }

  // 根据过滤条件筛选标签
  const filteredTags = computed(() => {
    let result = [...tags.value]

    // 应用搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(tag =>
        tag.name.toLowerCase().includes(query) ||
        tag.description.toLowerCase().includes(query)
      )
    }

    // 应用状态过滤
    if (statusFilter.value) {
      const isActive = statusFilter.value === 'active'
      result = result.filter(tag => tag.isActive === isActive)
    }

    // 应用类型过滤
    if (typeFilter.value) {
      result = result.filter(tag => tag.type === typeFilter.value)
    }

    // 更新分页总数
    pagination.itemCount = result.length

    return result
  })

  // 获取标签类型对应的显示名称
  function getTagTypeName(type: string): string {
    const option = typeOptions.find(opt => opt.value === type)
    return option ? option.label : type
  }

  // 获取标签类型对应的颜色
  function getTagTypeColor(type: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
    const typeColorMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      'CONTENT': 'success',
      'TECH': 'info',
      'LANGUAGE': 'warning',
      'TOOL': 'default',
      'AGE': 'error',
      'STYLE': 'info',
      'OTHER': 'default'
    }
    return typeColorMap[type] || 'default'
  }

  // 表格列配置
  const columns = ref<DataTableColumns<Tag>>([
    {
      title: '标签名称',
      key: 'name',
      width: 150,
      render(row) {
        return h('div', { class: 'tag-name-cell' }, [
          h(NTag, {
            type: getTagTypeColor(row.type),
            size: 'small',
            style: { marginRight: '8px' }
          }, { default: () => getTagTypeName(row.type) }),
          row.name,
          row.isHot ? h(NIcon, {
            size: 16,
            color: '#ff7d00',
            style: { marginLeft: '8px' }
          }, { default: () => h(FlameOutline) }) : null
        ])
      }
    },
    {
      title: '描述',
      key: 'description',
      width: 250,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '使用次数',
      key: 'videoCount',
      width: 100,
      sorter: 'default'
    },
    {
      title: '创建时间',
      key: 'createdAt',
      width: 120,
      sorter: 'default'
    },
    {
      title: '排序值',
      key: 'sortOrder',
      width: 80,
      sorter: 'default'
    },
    {
      title: '状态',
      key: 'isActive',
      width: 80,
      render(row) {
        return h(NTag, { type: row.isActive ? 'success' : 'error', size: 'small' }, {
          default: () => row.isActive ? '启用' : '禁用'
        })
      },
      filters: [
        { label: '启用', value: true },
        { label: '禁用', value: false }
      ],
      filterOptionValue: null,
      filterOption: (value, row) => row.isActive === value
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
                onClick: () => viewTagDetail(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(EyeOutline) }) }
            ),
            // 编辑按钮
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => editTag(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }
            ),
            // 删除按钮
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                circle: true,
                onClick: () => handleDelete(row)
              },
              { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
            )
          ]
        })
      }
    }
  ])

  // 处理搜索
  function handleSearch() {
    // 因为使用了计算属性自动过滤，这里不需要做任何操作
  }

  // 重置过滤器
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = null
    typeFilter.value = null
  }

  // 查看标签详情
  function viewTagDetail(tag: Tag) {
    currentTag.value = tag
    showDetailDrawer.value = true
  }

  // 编辑标签
  function editTag(tag: Tag) {
    isEdit.value = true
    formData.id = tag.id
    formData.name = tag.name
    formData.type = tag.type
    formData.description = tag.description || ''
    formData.sortOrder = tag.sortOrder
    formData.isActive = tag.isActive
    formData.isHot = tag.isHot
    showCreateModal.value = true
  }

  // 处理删除标签
  function handleDelete(tag: Tag) {
    deleteTag.value = tag
    showDeleteModal.value = true
  }

  // 切换标签状态
  async function toggleTagStatus(tag: Tag) {
    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新标签状态
      const index = tags.value.findIndex(t => t.id === tag.id)
      if (index !== -1) {
        tags.value[index].isActive = !tags.value[index].isActive
        tags.value[index].updatedAt = new Date().toISOString().split('T')[0]

        // 如果当前选中的标签是这个标签，更新当前标签
        if (currentTag.value && currentTag.value.id === tag.id) {
          currentTag.value.isActive = tags.value[index].isActive
          currentTag.value.updatedAt = tags.value[index].updatedAt
        }
      }

      message.success(`标签已${tag.isActive ? '禁用' : '启用'}`)
    } catch (error) {
      console.error('更新标签状态失败:', error)
      message.error('操作失败')
    }
  }

  // 确认删除标签
  async function confirmDelete() {
    if (!deleteTag.value) return

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从列表中删除
      tags.value = tags.value.filter(t => t.id !== deleteTag.value?.id)

      // 如果当前正在查看该标签的详情，关闭抽屉
      if (currentTag.value && currentTag.value.id === deleteTag.value.id) {
        showDetailDrawer.value = false
        currentTag.value = null
      }

      message.success('标签删除成功')
      showDeleteModal.value = false
      deleteTag.value = null
    } catch (error) {
      console.error('删除标签失败:', error)
      message.error('删除标签失败')
    }
  }

  // 提交标签表单
  async function submitTagForm() {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      if (isEdit.value) {
        // 更新现有标签
        const index = tags.value.findIndex(t => t.id === formData.id)
        if (index !== -1) {
          tags.value[index] = {
            ...tags.value[index],
            name: formData.name,
            type: formData.type,
            description: formData.description,
            sortOrder: formData.sortOrder,
            isActive: formData.isActive,
            isHot: formData.isHot,
            updatedAt: new Date().toISOString().split('T')[0]
          }

          // 如果当前正在查看该标签的详情，更新详情
          if (currentTag.value && currentTag.value.id === formData.id) {
            currentTag.value = { ...tags.value[index] }
          }
        }

        message.success('标签更新成功')
      } else {
        // 创建新标签
        const newTag: Tag = {
          id: `tag-${Date.now()}`,
          name: formData.name,
          type: formData.type,
          description: formData.description,
          videoCount: 0,
          isActive: formData.isActive,
          isHot: formData.isHot,
          sortOrder: formData.sortOrder,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        }

        tags.value.push(newTag)
        message.success('标签创建成功')
      }

      resetForm()
      showCreateModal.value = false
    } catch (error) {
      console.error('提交标签表单失败:', error)
      message.error('操作失败')
    }
  }

  // 重置表单
  function resetForm() {
    isEdit.value = false
    formData.id = ''
    formData.name = ''
    formData.type = ''
    formData.description = ''
    formData.sortOrder = 0
    formData.isActive = true
    formData.isHot = false
    if (formRef.value) {
      formRef.value.restoreValidation()
    }
  }

  // 查看使用标签的视频
  function viewVideo(videoId: string) {
    router.push(`/admin/content/videos/${videoId}`)
  }

  // 加载标签数据
  async function loadTags() {
    loading.value = true

    try {
      // Mock API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成模拟数据
      const mockTags: Tag[] = Array.from({ length: 50 }, (_, index) => {
        const id = `tag-${index + 1}`.padStart(6, '0')
        const typeOptions = ['CONTENT', 'TECH', 'LANGUAGE', 'TOOL', 'AGE', 'STYLE', 'OTHER']
        const tagNames = [
          '前端开发', '后端开发', 'Vue.js', 'React', '游戏', '音乐', '教育', '技术分享',
          '美食', '旅行', '体育', '编程', 'JavaScript', 'TypeScript', 'Python', 'Java',
          '移动开发', '云计算', '人工智能', '数据科学', '大数据', '区块链', '网络安全',
          'UI设计', 'UX设计', '产品设计', '视觉设计', '动画', '3D建模', '音频制作',
          '影视后期', '摄影', '剪辑', '配音', '直播', '教学', '教程', '入门指南',
          '最佳实践', '案例分析', '项目管理', '面试技巧', '职业规划', '自我提升', '生活方式',
          '健康饮食', '健身', '瑜伽', '冥想', '时间管理'
        ]

        // 随机日期生成
        const createdDate = new Date()
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 100))
        const updatedDate = new Date(createdDate)
        updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 30))

        // 随机相关视频
        const hasRelatedVideos = Math.random() > 0.7
        const relatedVideos = hasRelatedVideos
          ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, videoIndex) => ({
            id: `video-${videoIndex + 1}`,
            title: `示例视频 ${videoIndex + 1} - 使用了${tagNames[index % tagNames.length]}标签`,
            thumbnailUrl: `https://picsum.photos/id/${(index * 3 + videoIndex) % 100 + 100}/320/180`,
            author: `用户${Math.floor(Math.random() * 1000)}`,
            viewCount: Math.floor(Math.random() * 10000),
            status: Math.random() > 0.3 ? 'PUBLISHED' : 'PENDING',
            createdAt: new Date(createdDate.getTime() - Math.floor(Math.random() * 86400000 * 10)).toISOString().split('T')[0]
          }))
          : undefined

        return {
          id,
          name: tagNames[index % tagNames.length],
          type: typeOptions[Math.floor(Math.random() * typeOptions.length)],
          description: `这是一个${tagNames[index % tagNames.length]}相关的标签，用于分类视频内容。`,
          videoCount: Math.floor(Math.random() * 200),
          isActive: Math.random() > 0.1, // 90%概率为启用状态
          isHot: Math.random() > 0.7, // 30%概率为热门标签
          sortOrder: Math.floor(Math.random() * 100),
          createdAt: createdDate.toISOString().split('T')[0],
          updatedAt: updatedDate.toISOString().split('T')[0],
          relatedVideos
        }
      })

      tags.value = mockTags
      pagination.itemCount = mockTags.length
    } catch (error) {
      console.error('加载标签数据失败:', error)
      message.error('加载标签数据失败')
    } finally {
      loading.value = false
    }
  }

  // 初始化
  onMounted(() => {
    loadTags()
  })
</script>

<style scoped>
  .tags-page {
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

  .tag-name-cell {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .tag-detail {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .tag-actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }

  .related-videos {
    margin-top: 24px;
  }

  .video-author,
  .video-views {
    margin-right: 12px;
    font-size: 0.875rem;
    color: var(--text-color-secondary);
  }

  .view-more {
    margin-top: 12px;
    text-align: center;
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