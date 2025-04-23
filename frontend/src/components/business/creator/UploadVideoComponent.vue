/**
* @file UploadVideoComponent.vue
* @description 视频上传组件，支持单个或批量上传视频并填写相关信息
* @author Atom Video Team
* @date 2023-04-15
*/

<template>
  <div class="upload-container">
    <n-spin :show="isUploading" description="上传中...">
      <!-- 上传区域 -->
      <div class="upload-area" v-if="!hasFiles && !processingComplete">
        <div class="upload-area-content" @click="triggerFileInput">
          <n-icon size="48" class="upload-icon">
            <cloud-upload-outline />
          </n-icon>
          <h2>上传视频</h2>
          <p class="upload-hint">点击或拖拽文件到此区域上传</p>
          <p class="upload-formats">支持格式: MP4, MOV, AVI, MKV (最大 5GB)</p>

          <n-button class="select-files-btn" type="primary" size="large">
            选择文件
          </n-button>

          <p class="batch-hint">
            <n-icon><information-circle-outline /></n-icon>
            支持批量上传最多10个文件
          </p>
        </div>

        <input ref="fileInputRef" type="file" multiple accept="video/*" style="display: none"
          @change="handleFileChange" />
      </div>

      <!-- 文件列表 -->
      <div v-if="hasFiles && !processingComplete" class="files-list-container">
        <div class="header-actions">
          <h2>上传 {{ files.length }} 个视频</h2>
          <div class="action-buttons">
            <n-button @click="addMoreFiles" class="action-btn">
              <template #icon><n-icon><add-outline /></n-icon></template>
              添加更多
            </n-button>
            <n-button @click="clearAllFiles" class="action-btn">
              <template #icon><n-icon><trash-outline /></n-icon></template>
              清除全部
            </n-button>
            <n-button type="primary" @click="startUpload" :disabled="!canStartUpload" class="action-btn">
              <template #icon><n-icon><cloud-upload-outline /></n-icon></template>
              开始上传
            </n-button>
          </div>
        </div>

        <!-- 批量操作工具 -->
        <div class="batch-tools">
          <n-checkbox v-model:checked="selectAll" @update:checked="handleSelectAll">
            全选
          </n-checkbox>

          <div class="batch-actions" v-if="hasSelectedFiles">
            <span>已选择 {{ selectedCount }} 个文件</span>
            <n-button-group size="small">
              <n-button @click="batchSetCategory">
                <template #icon><n-icon><folder-outline /></n-icon></template>
                设置分类
              </n-button>
              <n-button @click="batchSetPrivacy">
                <template #icon><n-icon><eye-off-outline /></n-icon></template>
                设置隐私
              </n-button>
              <n-button @click="batchRemove">
                <template #icon><n-icon><trash-outline /></n-icon></template>
                删除
              </n-button>
            </n-button-group>
          </div>
        </div>

        <!-- 文件卡片 -->
        <div class="file-cards">
          <div v-for="(file, index) in files" :key="index" class="file-card">
            <div class="file-card-header">
              <n-checkbox v-model:checked="file.selected" />
              <div class="file-name">{{ file.name }}</div>
              <n-button quaternary circle size="small" @click="removeFile(index)">
                <template #icon><n-icon><close-outline /></n-icon></template>
              </n-button>
            </div>

            <div class="file-preview">
              <video v-if="file.previewUrl" class="video-preview" :src="file.previewUrl" controls muted></video>
              <div v-else class="placeholder-preview">
                <n-icon size="32"><videocam-outline /></n-icon>
              </div>
            </div>

            <div class="file-form">
              <n-form-item :show-label="false">
                <n-input v-model:value="file.title" placeholder="视频标题" clearable />
              </n-form-item>

              <n-form-item :show-label="false">
                <n-input v-model:value="file.description" placeholder="视频描述" type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }" />
              </n-form-item>

              <div class="form-row">
                <n-form-item :show-label="false" class="half-width">
                  <n-select v-model:value="file.category" placeholder="选择分类" :options="categoryOptions" />
                </n-form-item>

                <n-form-item :show-label="false" class="half-width">
                  <n-select v-model:value="file.privacy" placeholder="隐私设置" :options="privacyOptions" />
                </n-form-item>
              </div>

              <div class="form-row">
                <n-form-item :show-label="false" class="half-width">
                  <n-select v-model:value="file.language" placeholder="语言" :options="languageOptions" />
                </n-form-item>

                <n-form-item :show-label="false" class="half-width">
                  <n-switch v-model:value="file.commentsEnabled">
                    <template #checked>允许评论</template>
                    <template #unchecked>禁止评论</template>
                  </n-switch>
                </n-form-item>
              </div>

              <n-form-item :show-label="false">
                <n-dynamic-tags v-model:value="file.tags" placeholder="添加标签" :max="10" />
              </n-form-item>
            </div>

            <div class="file-status" v-if="file.isUploading || file.progress > 0">
              <div class="progress-text">{{ file.progress }}%</div>
              <n-progress type="line" :percentage="file.progress" :processing="file.isUploading" :height="12"
                :border-radius="6" />
              <div class="status-text">{{ getStatusText(file) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 上传完成页面 -->
      <div v-if="processingComplete" class="upload-complete">
        <div class="success-icon">
          <n-icon size="64" color="#34c759">
            <checkmark-circle-outline />
          </n-icon>
        </div>
        <h2>上传成功!</h2>
        <p class="complete-message">
          您的 {{ files.length }} 个视频已成功上传并正在处理中。
          处理完成后会通知您。
        </p>

        <div class="complete-summary">
          <div class="summary-item">
            <div class="summary-label">上传的视频</div>
            <div class="summary-value">{{ files.length }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">总大小</div>
            <div class="summary-value">{{ formatSize(totalSize) }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">公开视频</div>
            <div class="summary-value">{{ countByPrivacy('public') }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">私密视频</div>
            <div class="summary-value">{{ countByPrivacy('private') }}</div>
          </div>
        </div>

        <div class="complete-actions">
          <n-button type="primary" @click="uploadMore">上传更多视频</n-button>
          <n-button @click="goToManage">管理我的视频</n-button>
        </div>
      </div>
    </n-spin>

    <!-- 批量操作模态框 -->
    <n-modal v-model:show="showCategoryModal" preset="dialog" title="批量设置分类">
      <template #content>
        <n-select v-model:value="batchCategory" placeholder="选择分类" :options="categoryOptions" />
      </template>
      <template #action>
        <n-button type="primary" @click="confirmBatchCategory">确认</n-button>
      </template>
    </n-modal>

    <n-modal v-model:show="showPrivacyModal" preset="dialog" title="批量设置隐私">
      <template #content>
        <n-select v-model:value="batchPrivacy" placeholder="隐私设置" :options="privacyOptions" />
      </template>
      <template #action>
        <n-button type="primary" @click="confirmBatchPrivacy">确认</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    NButton,
    NButtonGroup,
    NSpin,
    NIcon,
    NInput,
    NFormItem,
    NSelect,
    NSwitch,
    NDynamicTags,
    NProgress,
    NModal,
    NCheckbox,
    useMessage
  } from 'naive-ui';
  import {
    CloudUploadOutline,
    VideocamOutline,
    CloseOutline,
    AddOutline,
    TrashOutline,
    InformationCircleOutline,
    FolderOutline,
    EyeOffOutline,
    CheckmarkCircleOutline
  } from '@vicons/ionicons5';
  import { creatorService } from '@/services/creator';

  // 文件接口
  interface UploadFile {
    file: File;
    name: string;
    size: number;
    type: string;
    previewUrl: string;
    title: string;
    description: string;
    category: string | null;
    privacy: string | null;
    language: string | null;
    commentsEnabled: boolean;
    tags: string[];
    isUploading: boolean;
    progress: number;
    selected: boolean;
    uploaded: boolean;
    error: string | null;
  }

  const router = useRouter();
  const message = useMessage();
  const fileInputRef = ref<HTMLInputElement | null>(null);

  // 状态
  const files = ref<UploadFile[]>([]);
  const isUploading = ref(false);
  const processingComplete = ref(false);
  const selectAll = ref(false);

  // 批量操作的状态
  const showCategoryModal = ref(false);
  const showPrivacyModal = ref(false);
  const batchCategory = ref<string | null>(null);
  const batchPrivacy = ref<string | null>(null);

  // 下拉选项
  const categoryOptions = [
    { label: '娱乐', value: 'entertainment' },
    { label: '音乐', value: 'music' },
    { label: '游戏', value: 'gaming' },
    { label: '教育', value: 'education' },
    { label: '科技', value: 'technology' },
    { label: '生活', value: 'lifestyle' },
    { label: '体育', value: 'sports' },
    { label: '电影', value: 'movies' },
    { label: '新闻', value: 'news' },
    { label: '其他', value: 'other' }
  ];

  const privacyOptions = [
    { label: '公开', value: 'public' },
    { label: '私密', value: 'private' },
    { label: '解锁后可见', value: 'unlisted' }
  ];

  const languageOptions = [
    { label: '中文', value: 'zh' },
    { label: '英语', value: 'en' },
    { label: '日语', value: 'ja' },
    { label: '韩语', value: 'ko' },
    { label: '其他', value: 'other' }
  ];

  // 计算属性
  const hasFiles = computed(() => files.value.length > 0);

  const hasSelectedFiles = computed(() => files.value.some(f => f.selected));

  const selectedCount = computed(() => files.value.filter(f => f.selected).length);

  const canStartUpload = computed(() => {
    return files.value.length > 0 && files.value.every(file =>
      file.title && file.category && file.privacy
    );
  });

  const totalSize = computed(() => {
    return files.value.reduce((total, file) => total + file.size, 0);
  });

  // 触发文件选择
  const triggerFileInput = () => {
    fileInputRef.value?.click();
  };

  // 处理文件选择
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const newFiles = Array.from(target.files);

    // 限制文件数量
    if (files.value.length + newFiles.length > 10) {
      message.warning('最多只能上传10个文件');
      return;
    }

    // 处理文件
    newFiles.forEach(file => {
      // 检查文件类型
      if (!file.type.startsWith('video/')) {
        message.error(`${file.name} 不是视频文件`);
        return;
      }

      // 检查文件大小
      if (file.size > 5 * 1024 * 1024 * 1024) { // 5GB
        message.error(`${file.name} 超过最大限制 (5GB)`);
        return;
      }

      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);

      // 添加到文件列表
      files.value.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        title: file.name.replace(/\.[^/.]+$/, ""), // 默认用文件名做标题，去掉扩展名
        description: '',
        category: null,
        privacy: 'public', // 默认公开
        language: 'zh', // 默认中文
        commentsEnabled: true,
        tags: [],
        isUploading: false,
        progress: 0,
        selected: false,
        uploaded: false,
        error: null
      });
    });

    // 重置文件输入
    target.value = '';
  };

  // 添加更多文件
  const addMoreFiles = () => {
    triggerFileInput();
  };

  // 清除所有文件
  const clearAllFiles = () => {
    files.value.forEach(file => {
      URL.revokeObjectURL(file.previewUrl);
    });
    files.value = [];
  };

  // 移除单个文件
  const removeFile = (index: number) => {
    const file = files.value[index];
    URL.revokeObjectURL(file.previewUrl);
    files.value.splice(index, 1);
  };

  // 开始上传
  const startUpload = async () => {
    if (!canStartUpload.value) {
      message.warning('请填写所有必填信息');
      return;
    }

    isUploading.value = true;

    try {
      // 并行上传所有文件
      await Promise.all(files.value.map(async (file, index) => {
        file.isUploading = true;
        file.progress = 0;

        try {
          // 创建上传任务
          const uploadTask = await creatorService.createUploadTask({
            filename: file.name,
            filesize: file.size,
            filetype: file.type,
            title: file.title,
            description: file.description,
            category: file.category as string,
            privacy: file.privacy as string,
            language: file.language as string,
            commentsEnabled: file.commentsEnabled,
            tags: file.tags
          });

          // 上传文件到服务器
          await creatorService.uploadVideoFile(
            uploadTask.uploadUrl,
            file.file,
            (progress) => {
              file.progress = Math.round(progress);
            }
          );

          // 通知服务器上传完成
          await creatorService.completeUpload(uploadTask.id);

          file.uploaded = true;
          file.isUploading = false;
          file.progress = 100;
        } catch (error) {
          console.error('Upload failed:', error);
          file.isUploading = false;
          file.error = '上传失败，请重试';
          throw error;
        }
      }));

      // 所有上传完成
      processingComplete.value = true;
    } catch (error) {
      message.error('上传过程中发生错误，请检查并重试');
    } finally {
      isUploading.value = false;
    }
  };

  // 获取文件状态文本
  const getStatusText = (file: UploadFile) => {
    if (file.error) return file.error;
    if (file.uploaded) return '上传完成';
    if (file.isUploading) {
      if (file.progress < 100) return '正在上传...';
      return '处理中...';
    }
    return '';
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    files.value.forEach(file => {
      file.selected = checked;
    });
  };

  // 批量设置分类
  const batchSetCategory = () => {
    batchCategory.value = null;
    showCategoryModal.value = true;
  };

  const confirmBatchCategory = () => {
    if (batchCategory.value) {
      files.value.forEach(file => {
        if (file.selected) {
          file.category = batchCategory.value;
        }
      });
      showCategoryModal.value = false;
    }
  };

  // 批量设置隐私
  const batchSetPrivacy = () => {
    batchPrivacy.value = null;
    showPrivacyModal.value = true;
  };

  const confirmBatchPrivacy = () => {
    if (batchPrivacy.value) {
      files.value.forEach(file => {
        if (file.selected) {
          file.privacy = batchPrivacy.value;
        }
      });
      showPrivacyModal.value = false;
    }
  };

  // 批量删除
  const batchRemove = () => {
    const newFiles = files.value.filter(file => !file.selected);

    // 释放不再需要的URL
    files.value
      .filter(file => file.selected)
      .forEach(file => {
        URL.revokeObjectURL(file.previewUrl);
      });

    files.value = newFiles;
    selectAll.value = false;
  };

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 按隐私设置统计视频数量
  const countByPrivacy = (privacy: string): number => {
    return files.value.filter(file => file.privacy === privacy).length;
  };

  // 上传更多
  const uploadMore = () => {
    clearAllFiles();
    processingComplete.value = false;
  };

  // 跳转到视频管理页面
  const goToManage = () => {
    router.push('/creator/videos');
  };

  // 组件销毁时清理预览URL
  onMounted(() => {
    return () => {
      files.value.forEach(file => {
        URL.revokeObjectURL(file.previewUrl);
      });
    };
  });
</script>

<style scoped>
  .upload-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  /* 上传区域样式 */
  .upload-area {
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.05);
    margin-bottom: 20px;
    transition: border-color 0.3s, background-color 0.3s;
    cursor: pointer;
  }

  .upload-area:hover {
    border-color: var(--primary-color);
    background-color: rgba(255, 255, 255, 0.08);
  }

  .upload-area-content {
    max-width: 500px;
    margin: 0 auto;
  }

  .upload-icon {
    color: var(--primary-color);
    margin-bottom: 16px;
  }

  .upload-hint {
    margin: 8px 0;
    font-size: 16px;
  }

  .upload-formats {
    margin: 8px 0 20px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }

  .select-files-btn {
    margin-bottom: 16px;
    padding: 0 32px;
  }

  .batch-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }

  /* 文件列表容器 */
  .files-list-container {
    margin-bottom: 30px;
  }

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header-actions h2 {
    margin: 0;
    font-size: 20px;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .action-btn {
    min-width: 40px;
  }

  /* 批量操作工具 */
  .batch-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 10px 16px;
    margin-bottom: 16px;
  }

  .batch-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .batch-actions span {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  /* 文件卡片 */
  .file-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .file-card {
    background-color: var(--card-color, #1a1a1a);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .file-card-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .file-name {
    flex-grow: 1;
    margin: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .file-preview {
    height: 180px;
    width: 100%;
    background-color: #000;
    position: relative;
  }

  .video-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .placeholder-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.3);
  }

  .file-form {
    padding: 16px;
  }

  .form-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .half-width {
    width: 50%;
  }

  .file-status {
    padding: 12px 16px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .progress-text {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .status-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 6px;
  }

  /* 上传完成页面 */
  .upload-complete {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 20px;
  }

  .success-icon {
    margin-bottom: 20px;
  }

  .complete-message {
    margin: 20px 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
  }

  .complete-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
    margin: 30px 0;
    text-align: center;
  }

  .summary-item {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
  }

  .summary-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 8px;
  }

  .summary-value {
    font-size: 24px;
    font-weight: 600;
  }

  .complete-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 30px;
  }

  @media (max-width: 768px) {
    .upload-area {
      padding: 20px;
    }

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .action-buttons {
      width: 100%;
    }

    .batch-tools {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .file-cards {
      grid-template-columns: 1fr;
    }

    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .half-width {
      width: 100%;
    }

    .complete-summary {
      grid-template-columns: 1fr 1fr;
    }

    .complete-actions {
      flex-direction: column;
    }
  }
</style>