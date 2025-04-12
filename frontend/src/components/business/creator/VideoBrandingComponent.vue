<template>
  <div class="video-branding-content">
    <n-card title="品牌定制" class="video-brand-card">
      <div class="branding-tabs-wrapper">
        <n-tabs type="segment" animated class="branding-tabs">
          <n-tab-pane name="watermark" tab="视频水印">
            <div class="option-container">
              <div class="brand-preview">
                <div v-if="watermarkPreview" class="preview-with-image">
                  <img :src="watermarkPreview" class="watermark-image" />
                </div>
                <div v-else class="brand-watermark-preview">
                  <div class="watermark-placeholder">水印预览</div>
                </div>
              </div>
              <div class="brand-info">
                <h3>视频水印</h3>
                <p>在视频上添加你的品牌标识，建议使用透明背景PNG图片</p>
                <n-upload action="/api/upload" :default-upload="false" :multiple="false" list-type="image-card"
                  @change="handleWatermarkUpload" accept="image/*">
                  <n-upload-trigger>
                    <div class="upload-trigger">
                      <n-icon size="24">
                        <ImageOutline />
                      </n-icon>
                      <span>上传水印</span>
                    </div>
                  </n-upload-trigger>
                </n-upload>
                <div class="branding-settings">
                  <div class="setting-row">
                    <span class="setting-label">水印位置:</span>
                    <n-select v-model:value="watermarkPosition" :options="positionOptions" size="small" />
                  </div>
                  <div class="setting-row">
                    <span class="setting-label">透明度:</span>
                    <n-slider v-model:value="watermarkOpacity" :min="10" :max="100" :step="5" />
                    <span class="setting-value">{{ watermarkOpacity }}%</span>
                  </div>
                  <div class="setting-row">
                    <span class="setting-label">大小:</span>
                    <n-slider v-model:value="watermarkSize" :min="5" :max="30" :step="1" />
                    <span class="setting-value">{{ watermarkSize }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="intro" tab="品牌片头">
            <div class="option-container">
              <div class="brand-preview">
                <div v-if="introPreview" class="preview-with-video">
                  <video :src="introPreview" controls class="intro-video"></video>
                </div>
                <div v-else class="brand-intro-preview">
                  <div class="intro-placeholder">片头预览</div>
                </div>
              </div>
              <div class="brand-info">
                <h3>品牌片头</h3>
                <p>在视频开始时显示你的品牌片头，建议时长不超过5秒</p>
                <n-upload action="/api/upload" :default-upload="false" :multiple="false" @change="handleIntroUpload"
                  accept="video/*">
                  <n-button>上传片头</n-button>
                </n-upload>
                <div class="branding-settings">
                  <div class="setting-row">
                    <n-checkbox v-model:checked="autoAddIntro">自动添加到所有新视频</n-checkbox>
                  </div>
                  <div class="setting-row">
                    <span class="setting-label">过渡效果:</span>
                    <n-select v-model:value="introTransition" :options="transitionOptions" size="small" />
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="outro" tab="品牌片尾">
            <div class="option-container">
              <div class="brand-preview">
                <div v-if="outroPreview" class="preview-with-video">
                  <video :src="outroPreview" controls class="outro-video"></video>
                </div>
                <div v-else class="brand-outro-preview">
                  <div class="outro-placeholder">片尾预览</div>
                </div>
              </div>
              <div class="brand-info">
                <h3>品牌片尾</h3>
                <p>在视频结束时显示你的品牌片尾，建议时长不超过10秒</p>
                <n-upload action="/api/upload" :default-upload="false" :multiple="false" @change="handleOutroUpload"
                  accept="video/*">
                  <n-button>上传片尾</n-button>
                </n-upload>
                <div class="branding-settings">
                  <div class="setting-row">
                    <n-checkbox v-model:checked="autoAddOutro">自动添加到所有新视频</n-checkbox>
                  </div>
                  <div class="setting-row">
                    <span class="setting-label">过渡效果:</span>
                    <n-select v-model:value="outroTransition" :options="transitionOptions" size="small" />
                  </div>
                  <div class="setting-row">
                    <n-checkbox v-model:checked="addSubscribeButton">添加订阅按钮</n-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="theme" tab="视频主题色">
            <div class="option-container theme-container">
              <div class="theme-color-section">
                <h3>视频主题色</h3>
                <p>选择视频播放器和缩略图边框使用的主题色</p>

                <div class="color-picker-wrapper">
                  <n-color-picker v-model:value="selectedThemeColor" :swatches="themeColors" />
                  <div class="color-value">#{{ selectedThemeColor }}</div>

                  <div class="theme-preview">
                    <div class="theme-preview-title">预览效果:</div>
                    <div class="theme-preview-items">
                      <div class="theme-preview-item" :style="{ backgroundColor: selectedThemeColor }">主色</div>
                      <div class="theme-preview-item" :style="{ backgroundColor: secondaryColor }">次色</div>
                      <div class="theme-preview-item" :style="{ backgroundColor: accentColor }">强调色</div>
                    </div>

                    <div class="video-player-preview" :style="{ borderColor: selectedThemeColor }">
                      <div class="player-controls">
                        <div class="player-progress" :style="{ backgroundColor: selectedThemeColor + '70' }">
                          <div class="progress-fill"
                            :style="{ width: previewProgress + '%', backgroundColor: selectedThemeColor }">
                          </div>
                        </div>
                        <div class="player-buttons">
                          <n-button size="small" circle :color="selectedThemeColor">
                            <template #icon>
                              <n-icon>
                                <PlayOutline />
                              </n-icon>
                            </template>
                          </n-button>
                          <n-slider v-model:value="previewProgress" :min="0" :max="100" :step="1" :tooltip="false"
                            :rail-style="{ background: '#454545' }" :fill-style="{ background: selectedThemeColor }" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>

      <div class="form-actions">
        <n-button type="primary" class="save-button" :loading="isSaving" @click="saveBrandingSettings">
          <template #icon v-if="!isSaving">
            <n-icon>
              <SaveOutline />
            </n-icon>
          </template>
          {{ isSaving ? '保存中...' : '保存设置' }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    NCard,
    NTabs,
    NTabPane,
    NButton,
    NIcon,
    NUpload,
    NUploadTrigger,
    NSelect,
    NSlider,
    NCheckbox,
    NColorPicker
  } from 'naive-ui';
  import {
    ImageOutline,
    SaveOutline,
    PlayOutline
  } from '@vicons/ionicons5';
  import { useMessage } from 'naive-ui';

  // 状态
  const watermarkPreview = ref<string>('');
  const introPreview = ref<string>('');
  const outroPreview = ref<string>('');
  const selectedThemeColor = ref('58a6ff');
  const watermarkPosition = ref('bottomRight');
  const watermarkOpacity = ref(70);
  const watermarkSize = ref(15);
  const autoAddIntro = ref(true);
  const autoAddOutro = ref(true);
  const introTransition = ref('fade');
  const outroTransition = ref('fade');
  const addSubscribeButton = ref(true);
  const isSaving = ref(false);
  const previewProgress = ref(70);

  const message = useMessage();

  // 位置选项
  const positionOptions = [
    { label: '左上角', value: 'topLeft' },
    { label: '右上角', value: 'topRight' },
    { label: '左下角', value: 'bottomLeft' },
    { label: '右下角', value: 'bottomRight' },
    { label: '居中', value: 'center' }
  ];

  // 过渡效果选项
  const transitionOptions = [
    { label: '淡入淡出', value: 'fade' },
    { label: '滑动', value: 'slide' },
    { label: '缩放', value: 'zoom' },
    { label: '无', value: 'none' }
  ];

  // 主题色列表
  const themeColors = [
    '#1976d2', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#f44336', '#e91e63', '#9c27b0', '#673ab7'
  ];

  // 计算衍生颜色
  const secondaryColor = computed(() => {
    return selectedThemeColor.value + '99'; // 添加透明度
  });

  const accentColor = computed(() => {
    return selectedThemeColor.value + 'dd'; // 添加不同透明度
  });

  // 处理上传事件
  const handleWatermarkUpload = (data: any) => {
    const { file } = data;
    if (file && file.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          watermarkPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file.file);
    }
  };

  const handleIntroUpload = (data: any) => {
    const { file } = data;
    if (file && file.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          introPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file.file);
    }
  };

  const handleOutroUpload = (data: any) => {
    const { file } = data;
    if (file && file.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          outroPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file.file);
    }
  };

  // 保存设置
  const saveBrandingSettings = () => {
    isSaving.value = true;

    // 模拟API调用
    setTimeout(() => {
      isSaving.value = false;
      message.success('品牌设置已保存');
    }, 1500);
  };
</script>

<style scoped>
  .video-branding-content {
    padding: 24px;
  }

  .video-brand-card {
    background: var(--card-bg, rgba(36, 41, 47, 0.5));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05));
    color: var(--text-primary, #e6edf3);
  }

  .branding-tabs-wrapper {
    margin-bottom: 20px;
  }

  .option-container {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-secondary, rgba(22, 27, 34, 0.4));
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05));
    margin-top: 20px;
  }

  .brand-preview {
    height: 180px;
    background-color: var(--bg-inset, rgba(0, 0, 0, 0.3));
    border-radius: 6px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .watermark-placeholder,
  .intro-placeholder,
  .outro-placeholder {
    color: var(--text-tertiary, rgba(230, 237, 243, 0.4));
    font-size: 14px;
  }

  .brand-info {
    text-align: center;
  }

  .brand-info h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: var(--text-primary, #e6edf3);
  }

  .brand-info p {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: var(--text-secondary, rgba(230, 237, 243, 0.6));
  }

  .branding-settings {
    margin-top: 20px;
    text-align: left;
    padding: 16px;
    background-color: var(--bg-inset, rgba(0, 0, 0, 0.15));
    border-radius: 6px;
  }

  .setting-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 8px;
  }

  .setting-row:last-child {
    margin-bottom: 0;
  }

  .setting-label {
    width: 80px;
    color: var(--text-primary, #e6edf3);
    font-size: 14px;
  }

  .setting-value {
    width: 40px;
    text-align: right;
    color: var(--text-secondary, rgba(230, 237, 243, 0.7));
    font-size: 14px;
  }

  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    color: var(--text-secondary, rgba(230, 237, 243, 0.6));
    gap: 8px;
  }

  .watermark-image,
  .intro-video,
  .outro-video {
    max-width: 100%;
    max-height: 160px;
    object-fit: contain;
  }

  .preview-with-image,
  .preview-with-video {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 主题色部分 */
  .theme-container {
    display: flex;
    justify-content: center;
  }

  .theme-color-section {
    width: 100%;
    max-width: 600px;
    text-align: center;
  }

  .color-picker-wrapper {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .color-value {
    margin-top: 12px;
    font-size: 14px;
    color: var(--text-secondary, rgba(230, 237, 243, 0.7));
  }

  .theme-preview {
    margin-top: 24px;
    width: 100%;
  }

  .theme-preview-title {
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-primary, #e6edf3);
  }

  .theme-preview-items {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .theme-preview-item {
    width: 80px;
    height: 36px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  .video-player-preview {
    width: 100%;
    height: 160px;
    background-color: var(--bg-inset, #0d1117);
    border-radius: 6px;
    border: 2px solid;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .player-controls {
    width: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    padding: 16px;
  }

  .player-progress {
    height: 4px;
    width: 100%;
    border-radius: 2px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
  }

  .player-buttons {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .player-buttons .n-slider {
    flex: 1;
  }

  .form-actions {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }

  .save-button {
    padding: 10px 24px;
    background: linear-gradient(90deg, var(--primary-color, #58a6ff) 0%, var(--primary-color-light, #388bfd) 100%);
    border: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .video-branding-content {
      padding: 16px;
    }

    .brand-preview {
      height: 140px;
    }

    .theme-preview-items {
      flex-direction: column;
      align-items: center;
    }

    .theme-preview-item {
      width: 200px;
    }
  }

  /* 明亮模式适配 */
  :root:not(.dark) .video-brand-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #333;
  }

  :root:not(.dark) .option-container {
    background-color: rgba(245, 245, 245, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  :root:not(.dark) .brand-preview {
    background-color: rgba(0, 0, 0, 0.05);
  }

  :root:not(.dark) .watermark-placeholder,
  :root:not(.dark) .intro-placeholder,
  :root:not(.dark) .outro-placeholder {
    color: rgba(0, 0, 0, 0.3);
  }

  :root:not(.dark) .brand-info h3 {
    color: #333;
  }

  :root:not(.dark) .brand-info p {
    color: rgba(0, 0, 0, 0.7);
  }

  :root:not(.dark) .branding-settings {
    background-color: rgba(0, 0, 0, 0.04);
  }

  :root:not(.dark) .setting-label {
    color: #333;
  }

  :root:not(.dark) .setting-value {
    color: rgba(0, 0, 0, 0.7);
  }

  :root:not(.dark) .upload-trigger {
    color: rgba(0, 0, 0, 0.5);
  }

  :root:not(.dark) .color-value {
    color: rgba(0, 0, 0, 0.7);
  }

  :root:not(.dark) .theme-preview-title {
    color: #333;
  }

  :root:not(.dark) .video-player-preview {
    background-color: #f5f5f5;
  }
</style>