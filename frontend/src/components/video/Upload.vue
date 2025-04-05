<!--
  Upload.vue
  视频上传组件
  功能：
  - 视频文件上传
  - 视频信息编辑
  - 封面预览
  - 上传进度显示
  依赖：
  - naive-ui
  - @vueuse/core
-->
<template>
  <div class="upload">
    <div class="upload-container">
      <!-- 上传区域 -->
      <div class="upload-area" :class="{ 'is-dragging': isDragging }" @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false" @dragover.prevent @drop.prevent="handleDrop">
        <div v-if="!videoFile" class="upload-placeholder">
          <n-icon size="48" class="upload-icon">
            <CloudUploadIcon />
          </n-icon>
          <p class="upload-text">
            拖拽视频文件到此处或
            <n-button text type="primary" @click="triggerFileInput">
              点击上传
            </n-button>
          </p>
          <p class="upload-hint">
            支持 MP4、WebM 格式，最大 500MB
          </p>
        </div>
        <div v-else class="upload-preview">
          <video ref="videoRef" :src="videoUrl" class="video-preview" controls />
          <div class="preview-actions">
            <n-button type="error" @click="handleRemoveVideo">
              移除视频
            </n-button>
          </div>
        </div>
      </div>

      <!-- 上传表单 -->
      <div v-if="videoFile" class="upload-form">
        <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="100"
          require-mark-placement="right-hanging">
          <!-- 标题 -->
          <n-form-item label="标题" path="title">
            <n-input v-model:value="formData.title" placeholder="请输入视频标题" maxlength="100" show-count />
          </n-form-item>

          <!-- 描述 -->
          <n-form-item label="描述" path="description">
            <n-input v-model:value="formData.description" type="textarea" placeholder="请输入视频描述"
              :autosize="{ minRows: 3, maxRows: 5 }" maxlength="500" show-count />
          </n-form-item>

          <!-- 封面 -->
          <n-form-item label="封面" path="coverUrl">
            <div class="cover-upload">
              <div class="cover-preview" :style="{
                backgroundImage: formData.coverUrl
                  ? `url(${formData.coverUrl})`
                  : 'none'
              }">
                <div v-if="!formData.coverUrl" class="cover-placeholder">
                  <n-icon size="24">
                    <ImageIcon />
                  </n-icon>
                  <span>点击上传封面</span>
                </div>
              </div>
              <n-upload ref="coverUploadRef" :show-file-list="false" :accept="'image/*'" :max-size="2"
                @change="handleCoverChange">
                <n-button>选择图片</n-button>
              </n-upload>
            </div>
          </n-form-item>

          <!-- 分类 -->
          <n-form-item label="分类" path="category">
            <n-select v-model:value="formData.category" :options="categoryOptions" placeholder="请选择视频分类" />
          </n-form-item>

          <!-- 标签 -->
          <n-form-item label="标签" path="tags">
            <n-select v-model:value="formData.tags" multiple filterable tag :options="tagOptions"
              placeholder="请输入标签，按回车添加" />
          </n-form-item>

          <!-- 上传按钮 -->
          <div class="form-actions">
            <n-button type="primary" :loading="uploading" :disabled="!canUpload" @click="handleUpload">
              开始上传
            </n-button>
            <n-button @click="handleCancel">
              取消
            </n-button>
          </div>
        </n-form>
      </div>
    </div>

    <!-- 上传进度 -->
    <n-modal v-model:show="showProgress" preset="card" title="上传进度" :bordered="false" :segmented="true">
      <div class="upload-progress">
        <n-progress type="line" :percentage="uploadProgress" :processing="uploading" :indicator-placement="'inside'" />
        <div class="progress-info">
          <span>已上传: {{ formatSize(uploadedSize) }}</span>
          <span>总大小: {{ formatSize(totalSize) }}</span>
          <span>速度: {{ formatSpeed(uploadSpeed) }}/s</span>
        </div>
      </div>
    </n-modal>

    <!-- 文件选择器 -->
    <input ref="fileInputRef" type="file" accept="video/*" class="hidden" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMessage } from 'naive-ui'
  import {
    NButton,
    NIcon,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NSelect,
    NProgress,
    NModal
  } from 'naive-ui'
  import {
    CloudUploadIcon,
    ImageIcon
  } from '@vicons/ionicons5'
  import type { UploadFileInfo } from 'naive-ui'
  import { useVideoStore } from '@/stores/video'

  const router = useRouter()
  const message = useMessage()
  const videoStore = useVideoStore()

  // 状态
  const isDragging = ref(false)
  const videoFile = ref<File | null>(null)
  const videoUrl = ref('')
  const formRef = ref()
  const fileInputRef = ref<HTMLInputElement>()
  const coverUploadRef = ref()
  const uploading = ref(false)
  const showProgress = ref(false)
  const uploadProgress = ref(0)
  const uploadedSize = ref(0)
  const totalSize = ref(0)
  const uploadSpeed = ref(0)

  // 表单数据
  const formData = ref({
    title: '',
    description: '',
    coverUrl: '',
    category: '',
    tags: [] as string[]
  })

  // 表单验证规则
  const rules = {
    title: {
      required: true,
      message: '请输入视频标题',
      trigger: 'blur'
    },
    description: {
      required: true,
      message: '请输入视频描述',
      trigger: 'blur'
    },
    category: {
      required: true,
      message: '请选择视频分类',
      trigger: 'change'
    }
  }

  // 分类选项
  const categoryOptions = [
    { label: '技术', value: 'tech' },
    { label: '编程', value: 'programming' },
    { label: '开发', value: 'development' },
    { label: '教程', value: 'tutorial' },
    { label: '其他', value: 'other' }
  ]

  // 标签选项
  const tagOptions = [
    { label: 'Vue', value: 'vue' },
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' }
  ]

  // 计算属性
  const canUpload = computed(() => {
    return (
      videoFile.value &&
      formData.value.title &&
      formData.value.description &&
      formData.value.category
    )
  })

  // 方法
  const triggerFileInput = () => {
    fileInputRef.value?.click()
  }

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      handleFile(input.files[0])
    }
  }

  const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer?.files.length) {
      handleFile(event.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      message.error('请上传视频文件')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      message.error('视频大小不能超过 500MB')
      return
    }

    videoFile.value = file
    videoUrl.value = URL.createObjectURL(file)
    totalSize.value = file.size
  }

  const handleRemoveVideo = () => {
    videoFile.value = null
    videoUrl.value = ''
    formData.value = {
      title: '',
      description: '',
      coverUrl: '',
      category: '',
      tags: []
    }
  }

  const handleCoverChange = (options: { file: UploadFileInfo }) => {
    const file = options.file
    if (file.status === 'finished') {
      formData.value.coverUrl = file.url
    }
  }

  const handleUpload = async () => {
    try {
      await formRef.value?.validate()
      if (!videoFile.value) return

      uploading.value = true
      showProgress.value = true

      // 模拟上传进度
      const interval = setInterval(() => {
        if (uploadProgress.value < 100) {
          uploadProgress.value += 1
          uploadedSize.value = (totalSize.value * uploadProgress.value) / 100
          uploadSpeed.value = Math.random() * 1024 * 1024 // 模拟上传速度
        } else {
          clearInterval(interval)
          uploading.value = false
          message.success('上传成功')
          router.push('/videos')
        }
      }, 100)

      // TODO: 实现实际的上传逻辑
    } catch (error) {
      message.error('上传失败')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond: number): string => {
    return formatSize(bytesPerSecond)
  }

  // 生命周期钩子
  onMounted(() => {
    // TODO: 初始化工作
  })

  onUnmounted(() => {
    if (videoUrl.value) {
      URL.revokeObjectURL(videoUrl.value)
    }
  })
</script>

<style scoped>
  .upload {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-lg);
  }

  .upload-container {
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
  }

  .upload-area {
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius);
    padding: var(--spacing-xl);
    text-align: center;
    transition: all 0.3s ease;
  }

  .upload-area.is-dragging {
    border-color: var(--primary-color);
    background-color: var(--background-color-hover);
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .upload-icon {
    color: var(--text-color-secondary);
  }

  .upload-text {
    margin: 0;
    font-size: var(--text-base);
    color: var(--text-color);
  }

  .upload-hint {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
  }

  .upload-preview {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .video-preview {
    width: 100%;
    max-height: 400px;
    border-radius: var(--border-radius);
    background-color: var(--background-color-secondary);
  }

  .preview-actions {
    display: flex;
    justify-content: flex-end;
  }

  .upload-form {
    margin-top: var(--spacing-xl);
  }

  .cover-upload {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .cover-preview {
    width: 200px;
    height: 112px;
    border-radius: var(--border-radius);
    background-color: var(--background-color-secondary);
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-color-secondary);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
  }

  .upload-progress {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
  }

  .hidden {
    display: none;
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .upload {
      padding: var(--spacing-md);
    }

    .cover-upload {
      flex-direction: column;
    }

    .cover-preview {
      width: 100%;
    }
  }
</style>