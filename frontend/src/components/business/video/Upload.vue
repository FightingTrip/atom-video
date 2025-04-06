<template>
  <div class="upload-container">
    <h1 class="upload-title">上传视频</h1>

    <div class="upload-steps">
      <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-label">选择文件</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-label">填写信息</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
        <div class="step-number">3</div>
        <div class="step-label">上传中</div>
      </div>
    </div>

    <!-- 步骤1: 选择文件 -->
    <div v-if="currentStep === 1" class="upload-step-content">
      <div class="upload-area" :class="{ 'is-dragover': isDragOver }" @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop" @click="triggerFileInput">
        <input type="file" ref="fileInput" class="file-input" accept="video/mp4,video/webm,video/ogg"
          @change="handleFileChange" />
        <div class="upload-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <p class="upload-text">
          拖放视频文件到这里或点击上传<br>
          <span class="upload-hint">支持的格式: MP4, WebM, Ogg (最大文件大小: 500MB)</span>
        </p>
      </div>
    </div>

    <!-- 步骤2: 填写详细信息 -->
    <div v-if="currentStep === 2" class="upload-step-content">
      <div class="upload-form">
        <div class="upload-preview">
          <div v-if="videoThumbnail" class="video-thumbnail">
            <img :src="videoThumbnail" alt="视频缩略图" />
            <div class="video-duration">{{ formatDuration(videoMetadata.duration) }}</div>
          </div>
          <div v-else class="video-thumbnail placeholder">
            <div class="placeholder-icon">🎬</div>
          </div>
          <div class="video-file-info">
            <p class="file-name">{{ videoFile.name }}</p>
            <p class="file-size">{{ formatFileSize(videoFile.size) }}</p>
          </div>
        </div>

        <div class="form-group">
          <label for="title" class="form-label">视频标题 <span class="required">*</span></label>
          <input id="title" v-model="videoInfo.title" type="text" class="form-input" placeholder="为你的视频添加一个吸引人的标题"
            maxlength="100" />
          <div class="char-count">{{ videoInfo.title.length }}/100</div>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">视频描述</label>
          <textarea id="description" v-model="videoInfo.description" class="form-textarea" placeholder="描述你的视频内容..."
            rows="4" maxlength="2000"></textarea>
          <div class="char-count">{{ videoInfo.description.length }}/2000</div>
        </div>

        <div class="form-group">
          <label for="category" class="form-label">分类 <span class="required">*</span></label>
          <select id="category" v-model="videoInfo.categoryId" class="form-select">
            <option value="" disabled>选择分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="tags" class="form-label">标签</label>
          <input id="tags" v-model="tagInput" type="text" class="form-input" placeholder="输入标签并按回车添加"
            @keydown.enter.prevent="addTag" />
          <div class="tags-container">
            <span v-for="(tag, index) in videoInfo.tags" :key="index" class="tag">
              {{ tag }}
              <button class="tag-remove" @click="removeTag(index)">×</button>
            </span>
          </div>
          <div class="form-hint">最多添加5个标签，每个标签最多20个字符</div>
        </div>

        <div class="form-group">
          <label for="visibility" class="form-label">可见性</label>
          <div class="visibility-options">
            <label class="visibility-option">
              <input type="radio" name="visibility" value="public" v-model="videoInfo.visibility" />
              <div class="option-content">
                <div class="option-icon">🌐</div>
                <div class="option-text">
                  <div class="option-title">公开</div>
                  <div class="option-description">所有人可见</div>
                </div>
              </div>
            </label>

            <label class="visibility-option">
              <input type="radio" name="visibility" value="unlisted" v-model="videoInfo.visibility" />
              <div class="option-content">
                <div class="option-icon">🔗</div>
                <div class="option-text">
                  <div class="option-title">不公开</div>
                  <div class="option-description">仅通过链接访问</div>
                </div>
              </div>
            </label>

            <label class="visibility-option">
              <input type="radio" name="visibility" value="private" v-model="videoInfo.visibility" />
              <div class="option-content">
                <div class="option-icon">🔒</div>
                <div class="option-text">
                  <div class="option-title">私密</div>
                  <div class="option-description">仅自己可见</div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤3: 上传进度 -->
    <div v-if="currentStep === 3" class="upload-step-content">
      <div class="upload-progress">
        <div class="progress-status">
          <div class="progress-icon" v-if="uploadStatus === 'uploading'">
            <div class="loading-spinner"></div>
          </div>
          <div class="progress-icon success" v-else-if="uploadStatus === 'success'">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div class="progress-icon error" v-else-if="uploadStatus === 'error'">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>

          <div class="progress-text">
            <h3 class="progress-title">
              {{
                uploadStatus === 'uploading' ? '正在上传...' :
                  uploadStatus === 'success' ? '上传成功' :
                    '上传失败'
              }}
            </h3>
            <p class="progress-description">
              {{
                uploadStatus === 'uploading' ? '请耐心等待，视频正在上传中...' :
                  uploadStatus === 'success' ? '你的视频已成功上传，正在进行处理' :
                    '上传过程中出现错误，请重试'
              }}
            </p>
          </div>
        </div>

        <div v-if="uploadStatus === 'uploading'" class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <div class="progress-percentage">{{ uploadProgress }}%</div>
        </div>

        <div v-if="uploadStatus === 'success'" class="video-info-summary">
          <div class="video-thumbnail">
            <img :src="videoThumbnail" alt="视频缩略图" />
          </div>
          <div class="video-details">
            <h4 class="video-title">{{ videoInfo.title }}</h4>
            <p class="video-status">视频处理中，处理完成后将自动发布</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="upload-actions">
      <button v-if="currentStep > 1" class="btn-secondary" @click="prevStep">上一步</button>
      <button v-if="currentStep < 3" class="btn-primary" @click="nextStep" :disabled="!canProceed">
        {{ currentStep === 2 ? '开始上传' : '下一步' }}
      </button>
      <button v-if="currentStep === 3 && uploadStatus === 'success'" class="btn-primary" @click="goToVideo">
        查看视频
      </button>
      <button v-if="currentStep === 3 && uploadStatus === 'error'" class="btn-primary" @click="retryUpload">
        重试
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';

  // 路由
  const router = useRouter();

  // 上传步骤
  const currentStep = ref(1);
  const isDragOver = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  // 文件信息
  const videoFile = ref<File | null>(null);
  const videoThumbnail = ref<string | null>(null);
  const videoMetadata = ref({
    duration: 0,
    width: 0,
    height: 0
  });

  // 表单数据
  const videoInfo = ref({
    title: '',
    description: '',
    categoryId: '',
    tags: [] as string[],
    visibility: 'public'
  });
  const tagInput = ref('');

  // 上传状态
  const uploadStatus = ref<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const uploadProgress = ref(0);

  // 分类数据
  const categories = [
    { id: 'tech', name: '科技' },
    { id: 'programming', name: '编程' },
    { id: 'gaming', name: '游戏' },
    { id: 'education', name: '教育' },
    { id: 'entertainment', name: '娱乐' },
    { id: 'music', name: '音乐' },
    { id: 'sports', name: '体育' },
    { id: 'lifestyle', name: '生活方式' }
  ];

  // 是否可以进行下一步
  const canProceed = computed(() => {
    if (currentStep.value === 1) {
      return videoFile.value !== null;
    } else if (currentStep.value === 2) {
      return videoInfo.value.title.trim() !== '' && videoInfo.value.categoryId !== '';
    }
    return true;
  });

  // 处理拖拽事件
  function handleDragOver(event: DragEvent) {
    isDragOver.value = true;
  }

  function handleDragLeave(event: DragEvent) {
    isDragOver.value = false;
  }

  function handleDrop(event: DragEvent) {
    isDragOver.value = false;
    if (!event.dataTransfer) return;
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      processVideoFile(files[0]);
    }
  }

  // 处理文件选择
  function triggerFileInput() {
    fileInput.value?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      processVideoFile(target.files[0]);
    }
  }

  // 处理视频文件
  function processVideoFile(file: File) {
    // 检查文件类型
    if (!file.type.startsWith('video/')) {
      alert('请上传视频文件（MP4, WebM, Ogg）');
      return;
    }

    // 检查文件大小（500MB）
    if (file.size > 500 * 1024 * 1024) {
      alert('文件大小不能超过500MB');
      return;
    }

    videoFile.value = file;
    generateThumbnail(file);
    getVideoMetadata(file);

    // 自动填充标题
    const fileName = file.name.replace(/\.[^/.]+$/, ''); // 移除扩展名
    videoInfo.value.title = fileName;
  }

  // 生成视频缩略图
  function generateThumbnail(file: File) {
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');

    video.onloadeddata = () => {
      // 设置视频时间到25%处以获取更有代表性的缩略图
      video.currentTime = video.duration * 0.25;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        videoThumbnail.value = canvas.toDataURL('image/jpeg');
      }

      URL.revokeObjectURL(videoUrl);
    };

    video.onerror = () => {
      console.error('视频加载失败');
      URL.revokeObjectURL(videoUrl);
    };

    video.src = videoUrl;
    video.load();
  }

  // 获取视频元数据
  function getVideoMetadata(file: File) {
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');

    video.onloadedmetadata = () => {
      videoMetadata.value = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      };
      URL.revokeObjectURL(videoUrl);
    };

    video.onerror = () => {
      console.error('视频元数据加载失败');
      URL.revokeObjectURL(videoUrl);
    };

    video.src = videoUrl;
    video.load();
  }

  // 格式化文件大小
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 格式化视频时长
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 标签管理
  function addTag(event: KeyboardEvent) {
    const tag = tagInput.value.trim();
    if (tag && videoInfo.value.tags.length < 5 && tag.length <= 20 && !videoInfo.value.tags.includes(tag)) {
      videoInfo.value.tags.push(tag);
      tagInput.value = '';
    }
  }

  function removeTag(index: number) {
    videoInfo.value.tags.splice(index, 1);
  }

  // 步骤导航
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }

  function nextStep() {
    if (!canProceed.value) return;

    if (currentStep.value < 3) {
      currentStep.value++;

      if (currentStep.value === 3) {
        startUpload();
      }
    }
  }

  // 模拟上传过程
  function startUpload() {
    if (!videoFile.value) return;

    uploadStatus.value = 'uploading';
    uploadProgress.value = 0;

    // 模拟上传进度
    const interval = setInterval(() => {
      uploadProgress.value += Math.random() * 10;

      if (uploadProgress.value >= 100) {
        uploadProgress.value = 100;
        clearInterval(interval);

        // 模拟成功（90%概率）或失败
        setTimeout(() => {
          if (Math.random() < 0.9) {
            uploadStatus.value = 'success';
          } else {
            uploadStatus.value = 'error';
          }
        }, 500);
      }
    }, 500);
  }

  // 重试上传
  function retryUpload() {
    startUpload();
  }

  // 查看上传的视频
  function goToVideo() {
    // 模拟跳转到视频页面，实际开发中应使用真实的视频ID
    router.push('/video/mock-video-id');
  }
</script>

<style scoped>
  .upload-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  .upload-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 32px;
    color: var(--color-text-primary);
    text-align: center;
  }

  /* 步骤指示器 */
  .upload-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-bg-inset);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 8px;
    transition: all 0.3s;
  }

  .step-label {
    font-size: 14px;
    color: var(--color-text-secondary);
    transition: all 0.3s;
  }

  .step-connector {
    width: 64px;
    height: 1px;
    background-color: var(--color-border-primary);
    margin: 0 8px 24px;
  }

  .step.active .step-number {
    background-color: var(--color-accent-primary);
    color: white;
  }

  .step.active .step-label {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  .step.completed .step-number {
    background-color: var(--color-accent-primary);
    color: white;
  }

  /* 文件上传区域 */
  .upload-area {
    border: 2px dashed var(--color-border-primary);
    border-radius: 8px;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }

  .upload-area:hover,
  .upload-area.is-dragover {
    border-color: var(--color-accent-primary);
    background-color: var(--color-bg-subtle);
  }

  .file-input {
    display: none;
  }

  .upload-icon {
    color: var(--color-text-secondary);
    margin-bottom: 16px;
  }

  .upload-text {
    font-size: 16px;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  .upload-hint {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  /* 表单样式 */
  .upload-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .upload-preview {
    display: flex;
    margin-bottom: 16px;
    gap: 16px;
    align-items: flex-start;
  }

  .video-thumbnail {
    width: 160px;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-thumbnail.placeholder {
    background-color: var(--color-bg-inset);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-icon {
    font-size: 32px;
  }

  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  }

  .video-file-info {
    flex: 1;
  }

  .file-name {
    font-size: 15px;
    font-weight: 500;
    margin: 0 0 4px;
    word-break: break-all;
  }

  .file-size {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .form-group {
    margin-bottom: 16px;
    position: relative;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .required {
    color: var(--color-text-danger);
  }

  .form-input,
  .form-textarea,
  .form-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-border-primary);
    border-radius: 4px;
    background-color: var(--color-bg-input);
    color: var(--color-text-primary);
    font-size: 14px;
    transition: border-color 0.3s;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    border-color: var(--color-accent-primary);
    outline: none;
  }

  .char-count {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-bg-subtle);
    color: var(--color-text-primary);
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 14px;
  }

  .tag-remove {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    margin-left: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-hint {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }

  .visibility-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .visibility-option {
    display: flex;
    cursor: pointer;
  }

  .visibility-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .option-content {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--color-border-primary);
    border-radius: 8px;
    width: 100%;
    transition: all 0.3s;
  }

  .visibility-option input:checked+.option-content {
    border-color: var(--color-accent-primary);
    background-color: var(--color-bg-subtle);
  }

  .option-icon {
    font-size: 20px;
    margin-right: 12px;
  }

  .option-title {
    font-weight: 500;
    margin-bottom: 2px;
  }

  .option-description {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  /* 上传进度 */
  .upload-progress {
    padding: 24px;
  }

  .progress-status {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .progress-icon {
    margin-right: 16px;
    color: var(--color-text-primary);
  }

  .progress-icon.success {
    color: var(--color-text-success);
  }

  .progress-icon.error {
    color: var(--color-text-danger);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-accent-primary);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .progress-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px;
  }

  .progress-description {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .progress-bar-container {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background-color: var(--color-bg-subtle);
    border-radius: 4px;
    overflow: hidden;
    margin-right: 12px;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--color-accent-primary);
    transition: width 0.3s;
  }

  .progress-percentage {
    font-weight: 500;
    color: var(--color-text-primary);
    min-width: 40px;
    text-align: right;
  }

  .video-info-summary {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: var(--color-bg-subtle);
    border-radius: 8px;
  }

  .video-info-summary .video-thumbnail {
    width: 120px;
    height: 68px;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .video-details {
    flex: 1;
  }

  .video-details .video-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 4px;
  }

  .video-status {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* 按钮 */
  .upload-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-primary {
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-primary:disabled {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-secondary);
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-primary);
  }

  .btn-secondary:hover {
    background-color: var(--color-bg-subtle);
  }

  @media (max-width: 768px) {
    .upload-steps {
      margin-bottom: 24px;
    }

    .step-connector {
      width: 40px;
    }

    .upload-preview {
      flex-direction: column;
    }

    .video-thumbnail {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
    }

    .visibility-options {
      gap: 8px;
    }
  }
</style>