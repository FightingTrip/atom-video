<!--
* @file VideoUploadPage.vue
* @description 视频上传页面，提供视频文件上传和信息填写功能
* @author Atom Video Team
* @date 2025-04-06
-->

<template>
  <div class="video-upload-page">
    <div class="page-header">
      <h1>上传视频</h1>
      <p class="subtitle">分享您的知识和见解，与社区共同进步</p>
    </div>

    <n-card class="upload-card">
      <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="100px"
        require-mark-placement="right-hanging">
        <!-- 上传区域 -->
        <div class="upload-area" v-if="!videoFile">
          <n-upload ref="uploadRef" :custom-request="customRequest" accept="video/mp4,video/webm,video/quicktime"
            :max="1" @change="handleUploadChange" @before-upload="beforeUpload">
            <div class="upload-trigger">
              <n-icon size="48" class="upload-icon">
                <CloudUploadOutline />
              </n-icon>
              <div class="upload-text">
                <p>点击或拖拽视频文件到此区域</p>
                <p class="text-secondary">支持MP4、WebM、MOV格式，最大500MB</p>
              </div>
            </div>
          </n-upload>
        </div>

        <!-- 视频预览 -->
        <div v-else class="video-preview">
          <video ref="videoPreviewRef" controls class="preview-player">
            <source :src="videoPreviewUrl" :type="videoFile.type">
            您的浏览器不支持视频播放
          </video>
          <div class="preview-info">
            <p><strong>文件名:</strong> {{ videoFile.name }}</p>
            <p><strong>大小:</strong> {{ formatFileSize(videoFile.size) }}</p>
            <p><strong>上传进度:</strong> {{ uploadProgress }}%</p>
          </div>
          <n-button type="primary" ghost @click="resetVideo">重新选择</n-button>
        </div>

        <!-- 基本信息表单 -->
        <n-form-item label="标题" path="title">
          <n-input v-model:value="formData.title" placeholder="为您的视频取一个吸引人的标题" />
        </n-form-item>

        <n-form-item label="描述" path="description">
          <n-input v-model:value="formData.description" type="textarea" placeholder="详细介绍您的视频内容"
            :autosize="{ minRows: 4, maxRows: 8 }" />
        </n-form-item>

        <n-form-item label="标签" path="tags">
          <n-dynamic-tags v-model:value="formData.tags" :max="10" />
          <p class="help-text">最多添加10个标签，按Enter确认</p>
        </n-form-item>

        <n-form-item label="分类" path="category">
          <n-select v-model:value="formData.category" :options="categoryOptions" placeholder="请选择视频分类" />
        </n-form-item>

        <n-form-item label="难度级别" path="difficultyLevel">
          <n-select v-model:value="formData.difficultyLevel" :options="difficultyOptions" placeholder="请选择内容难度" />
        </n-form-item>

        <n-form-item label="缩略图" path="thumbnail">
          <n-upload list-type="image-card" accept="image/jpeg,image/png,image/webp" :max="1"
            @change="handleThumbnailChange">
            <div style="margin-bottom: 12px;">
              <n-icon size="24">
                <ImageOutline />
              </n-icon>
            </div>
           
          </n-upload>
          <p class="help-text">建议使用16:9比例的图片，不上传将自动从视频中截取</p>
        </n-form-item>

        <n-form-item label="可见性" path="isPublished">
          <n-radio-group v-model:value="formData.isPublished" name="visibility">
            <n-space>
              <n-radio :value="true">
                立即发布
                <template #label>
                  <p class="radio-help">视频将在上传完成后立即公开</p>
                </template>
              </n-radio>
              <n-radio :value="false">
                存为草稿
                <template #label>
                  <p class="radio-help">视频将保存为草稿，仅自己可见</p>
                </template>
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <n-button @click="resetForm">重置</n-button>
          <n-button type="primary" @click="handleSubmit" :loading="submitting"
            :disabled="!videoFile || uploadProgress < 100">
            {{ formData.isPublished ? '发布视频' : '保存草稿' }}
          </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NUpload,
    NRadioGroup,
    NRadio,
    NSpace,
    NButton,
    NCard,
    NDynamicTags,
    NIcon,
    useMessage
  } from 'naive-ui';
  import {
    CloudUploadOutline,
    ImageOutline
  } from '@vicons/ionicons5';
  import { videoService } from '@/services/video/videoService';

  const router = useRouter();
  const message = useMessage();

  // 引用
  const formRef = ref(null);
  const uploadRef = ref(null);
  const videoPreviewRef = ref<HTMLVideoElement | null>(null);

  // 上传状态
  const videoFile = ref<File | null>(null);
  const thumbnailFile = ref<File | null>(null);
  const uploadProgress = ref(0);
  const submitting = ref(false);
  const videoPreviewUrl = ref('');

  // 表单数据
  const formData = reactive({
    title: '',
    description: '',
    tags: [],
    category: '',
    difficultyLevel: '',
    isPublished: true
  });

  // 选项
  const categoryOptions = [
    { label: '编程语言', value: 'PROGRAMMING_LANGUAGE' },
    { label: '前端开发', value: 'FRONTEND' },
    { label: '后端开发', value: 'BACKEND' },
    { label: '移动开发', value: 'MOBILE' },
    { label: '数据库', value: 'DATABASE' },
    { label: '人工智能', value: 'AI' },
    { label: '云计算', value: 'CLOUD' },
    { label: '区块链', value: 'BLOCKCHAIN' },
    { label: '开发工具', value: 'DEVTOOLS' },
    { label: '操作系统', value: 'OS' },
    { label: '网络安全', value: 'SECURITY' },
    { label: '游戏开发', value: 'GAME_DEV' },
    { label: '其他', value: 'OTHERS' }
  ];

  const difficultyOptions = [
    { label: '入门级', value: 'BEGINNER' },
    { label: '中级', value: 'INTERMEDIATE' },
    { label: '高级', value: 'ADVANCED' }
  ];

  // 表单验证规则
  const rules = {
    title: [
      { required: true, message: '请输入视频标题', trigger: 'blur' },
      { max: 100, message: '标题不能超过100个字符', trigger: 'blur' }
    ],
    description: [
      { required: true, message: '请输入视频描述', trigger: 'blur' },
      { max: 2000, message: '描述不能超过2000个字符', trigger: 'blur' }
    ],
    category: [
      { required: true, message: '请选择视频分类', trigger: 'change' }
    ],
    difficultyLevel: [
      { required: true, message: '请选择难度级别', trigger: 'change' }
    ]
  };

  // 上传前检查
  const beforeUpload = (data: { file: File }) => {
    const { file } = data;

    // 检查文件大小 (500MB = 500 * 1024 * 1024 字节)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('文件过大，请上传小于500MB的视频');
      return false;
    }

    // 检查文件类型
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      message.error('不支持的文件格式，请上传MP4、WebM或MOV格式的视频');
      return false;
    }

    return true;
  };

  // 自定义上传处理
  const customRequest = ({ file, onFinish, onError, onProgress }: any) => {
    try {
      // 创建本地文件URL预览
      videoFile.value = file.file;
      videoPreviewUrl.value = URL.createObjectURL(file.file);

      // 模拟上传进度
      simulateUploadProgress();

      // 完成
      onFinish();
    } catch (err) {
      console.error('上传失败:', err);
      onError();
    }
  };

  // 模拟上传进度
  const simulateUploadProgress = () => {
    uploadProgress.value = 0;
    const interval = setInterval(() => {
      uploadProgress.value += 5;
      if (uploadProgress.value >= 100) {
        clearInterval(interval);
        message.success('视频已准备就绪');
      }
    }, 300);
  };

  // 处理上传状态变化
  const handleUploadChange = (options: any) => {
    console.log('上传状态变化:', options);
  };

  // 处理缩略图上传
  const handleThumbnailChange = (options: any) => {
    const { fileList } = options;
    if (fileList.length > 0) {
      thumbnailFile.value = fileList[0].file;
    } else {
      thumbnailFile.value = null;
    }
  };

  // 重置视频
  const resetVideo = () => {
    if (videoPreviewUrl.value) {
      URL.revokeObjectURL(videoPreviewUrl.value);
    }
    videoFile.value = null;
    videoPreviewUrl.value = '';
    uploadProgress.value = 0;
  };

  // 重置表单
  const resetForm = () => {
    resetVideo();
    formData.title = '';
    formData.description = '';
    formData.tags = [];
    formData.category = '';
    formData.difficultyLevel = '';
    formData.isPublished = true;
    thumbnailFile.value = null;
    if (uploadRef.value) {
      uploadRef.value.clear();
    }
  };

  // 格式化文件大小
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return;
    if (!videoFile.value) {
      message.error('请上传视频文件');
      return;
    }

    try {
      // 表单验证
      await formRef.value.validate();

      submitting.value = true;

      // 准备上传数据
      const uploadData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        videoFile: videoFile.value,
        thumbnailFile: thumbnailFile.value,
        isPublished: formData.isPublished,
      };

      // 调用上传服务
      const result = await videoService.uploadVideo(uploadData);

      if (result.success) {
        message.success(formData.isPublished ? '视频已成功发布！' : '草稿已保存成功！');
        resetForm();

        // 导航到适当的页面
        if (formData.isPublished) {
          router.push(`/video/${result.data.id}`);
        } else {
          router.push('/user/videos');
        }
      } else {
        message.error(result.message || '上传失败，请重试');
      }
    } catch (err) {
      console.error('上传错误:', err);
      message.error('表单验证失败，请检查输入');
    } finally {
      submitting.value = false;
    }
  };

  onMounted(() => {
    console.log('[VideoUploadPage] 组件已挂载');
  });
</script>

<style scoped>
  .video-upload-page {
    padding: 32px;
    max-width: 1000px;
    margin: 0 auto;
    color: var(--text-color);
  }

  .page-header {
    margin-bottom: 24px;
    text-align: center;
  }

  .page-header h1 {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .subtitle {
    color: var(--text-color-secondary);
    font-size: 16px;
  }

  .upload-card {
    margin-bottom: 24px;
  }

  .upload-area {
    margin-bottom: 24px;
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 32px;
    text-align: center;
    transition: all 0.3s;
  }

  .upload-area:hover {
    border-color: var(--primary-color);
    background-color: rgba(var(--primary-color-rgb), 0.05);
  }

  .upload-trigger {
    cursor: pointer;
    padding: 32px 0;
  }

  .upload-icon {
    margin-bottom: 16px;
    color: var(--text-color-secondary);
  }

  .upload-text {
    color: var(--text-color);
  }

  .text-secondary {
    color: var(--text-color-secondary);
    font-size: 14px;
    margin-top: 8px;
  }

  .video-preview {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .preview-player {
    width: 100%;
    max-height: 400px;
    background-color: #000;
    border-radius: 8px;
  }

  .preview-info {
    background-color: var(--card-color);
    padding: 16px;
    border-radius: 8px;
    width: 100%;
  }

  .help-text {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: 4px;
  }

  .radio-help {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: 4px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .video-upload-page {
      padding: 16px;
    }

    .upload-area {
      padding: 16px;
    }

    .upload-trigger {
      padding: 16px 0;
    }
  }
</style>