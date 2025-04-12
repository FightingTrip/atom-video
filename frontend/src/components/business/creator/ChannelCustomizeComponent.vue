<template>
  <div class="customize-content">
    <n-card title="频道外观" class="customize-card">
      <div class="channel-preview">
        <div class="channel-banner" :style="{ backgroundColor: selectedThemeColor + '40' }">
          <img v-if="bannerPreview" :src="bannerPreview" class="banner-image" />
          <div v-else class="banner-placeholder">
            <n-icon size="48">
              <ImageOutline />
            </n-icon>
            <span>横幅预览</span>
          </div>
        </div>
        <div class="channel-info">
          <div class="channel-avatar">
            <img v-if="avatarPreview" :src="avatarPreview" class="avatar-image" />
            <n-avatar v-else :size="80" :style="{ backgroundColor: selectedThemeColor }">
              <n-icon :size="44">
                <PersonOutline />
              </n-icon>
            </n-avatar>
          </div>
          <div class="channel-meta">
            <h2 class="channel-name">{{ channelName || '你的频道名称' }}</h2>
            <p class="channel-desc">{{ channelDescription || '你的频道介绍将显示在这里...' }}</p>
          </div>
        </div>
      </div>

      <n-form>
        <n-form-item label="频道名称">
          <n-input v-model:value="channelName" placeholder="输入频道名称..." />
        </n-form-item>

        <n-form-item label="频道头像">
          <n-upload action="/api/upload" :default-upload="false" :multiple="false" list-type="image-card"
            @change="handleAvatarUpload" accept="image/*">
            <n-upload-trigger>
              <div class="upload-trigger">
                <n-icon size="32">
                  <PersonAddOutline />
                </n-icon>
                <span>点击或拖拽上传头像</span>
              </div>
            </n-upload-trigger>
          </n-upload>
        </n-form-item>

        <n-form-item label="频道横幅">
          <n-upload action="/api/upload" :default-upload="false" :multiple="false" list-type="image-card"
            @change="handleBannerUpload" accept="image/*">
            <n-upload-trigger>
              <div class="upload-trigger">
                <n-icon size="32">
                  <CloudUploadOutline />
                </n-icon>
                <span>点击或拖拽上传横幅</span>
              </div>
            </n-upload-trigger>
          </n-upload>
          <div class="upload-tip">推荐尺寸: 1200 × 300 像素</div>
        </n-form-item>

        <n-form-item label="频道介绍">
          <n-input v-model:value="channelDescription" type="textarea" placeholder="介绍你的频道..."
            :autosize="{ minRows: 3, maxRows: 6 }" />
        </n-form-item>

        <n-form-item label="频道主题色">
          <div class="theme-color-picker">
            <n-color-picker v-model:value="selectedThemeColor" :swatches="themeColors"
              @update:value="updateThemeColor" />
            <div class="color-value">{{ selectedThemeColor }}</div>
            <div class="theme-preview">
              <div class="theme-preview-title">预览效果:</div>
              <div class="theme-preview-items">
                <div class="theme-preview-item" :style="{ backgroundColor: selectedThemeColor }">主色</div>
                <div class="theme-preview-item" :style="{ backgroundColor: secondaryColor }">次色</div>
                <div class="theme-preview-item" :style="{ backgroundColor: accentColor }">强调色</div>
              </div>
              <div class="theme-preview-elements">
                <n-button size="small" :color="selectedThemeColor">按钮</n-button>
                <n-tag :color="{ color: selectedThemeColor + '30', textColor: selectedThemeColor }">标签</n-tag>
                <div class="preview-progress">
                  <n-progress type="line" :percentage="70" :color="selectedThemeColor" :height="8" :border-radius="4" />
                </div>
              </div>
            </div>
          </div>
        </n-form-item>

        <n-form-item>
          <n-button type="primary" class="save-button" :loading="isSaving" @click="saveChannelSettings">
            <template #icon v-if="!isSaving">
              <n-icon>
                <SaveOutline />
              </n-icon>
            </template>
            {{ isSaving ? '保存中...' : '保存设置' }}
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NUploadTrigger,
    NColorPicker,
    NTag,
    NProgress,
    NButton,
    NIcon,
    NAvatar
  } from 'naive-ui';
  import {
    ImageOutline,
    PersonOutline,
    PersonAddOutline,
    CloudUploadOutline,
    SaveOutline
  } from '@vicons/ionicons5';
  import { useMessage } from 'naive-ui';

  // 定义props和emits
  interface Props {
    initialChannelName?: string;
    initialChannelDescription?: string;
    initialThemeColor?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    initialChannelName: '',
    initialChannelDescription: '',
    initialThemeColor: '#58a6ff'
  });

  const emit = defineEmits<{
    (e: 'save', settings: ChannelSettings): void
  }>();

  // 定义频道设置接口
  interface ChannelSettings {
    name: string;
    description: string;
    themeColor: string;
    avatar?: File | null;
    banner?: File | null;
  }

  const message = useMessage();

  // 状态
  const channelName = ref(props.initialChannelName);
  const channelDescription = ref(props.initialChannelDescription);
  const selectedThemeColor = ref(props.initialThemeColor);
  const bannerPreview = ref<string>('');
  const avatarPreview = ref<string>('');
  const isSaving = ref(false);
  const avatarFile = ref<File | null>(null);
  const bannerFile = ref<File | null>(null);

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

  // 处理头像上传
  const handleAvatarUpload = (options: { file: { file: File } }) => {
    const { file } = options;
    if (file.file) {
      avatarFile.value = file.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          avatarPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file.file);
    }
  };

  // 处理横幅上传
  const handleBannerUpload = (options: { file: { file: File } }) => {
    const { file } = options;
    if (file.file) {
      bannerFile.value = file.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          bannerPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file.file);
    }
  };

  // 更新主题色
  const updateThemeColor = (color: string) => {
    selectedThemeColor.value = color;
  };

  // 保存频道设置
  const saveChannelSettings = () => {
    isSaving.value = true;

    const settings: ChannelSettings = {
      name: channelName.value,
      description: channelDescription.value,
      themeColor: selectedThemeColor.value,
      avatar: avatarFile.value,
      banner: bannerFile.value
    };

    // 发送保存事件
    emit('save', settings);

    // 模拟API调用
    setTimeout(() => {
      isSaving.value = false;
      message.success('频道设置已保存');
    }, 1500);
  };
</script>

<style scoped>
  .customize-content {
    padding: 24px;
  }

  .customize-card {
    background: rgba(36, 41, 47, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .channel-preview {
    margin-bottom: 24px;
  }

  .channel-banner {
    height: 140px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(230, 237, 243, 0.4);
  }

  .channel-info {
    display: flex;
    align-items: center;
  }

  .channel-avatar {
    margin-right: 16px;
  }

  .avatar-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
  }

  .channel-meta {
    flex: 1;
  }

  .channel-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #e6edf3;
  }

  .channel-desc {
    font-size: 14px;
    color: rgba(230, 237, 243, 0.6);
  }

  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: rgba(230, 237, 243, 0.6);
    gap: 12px;
  }

  .upload-tip {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.5);
    margin-top: 4px;
  }

  .theme-color-picker {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .color-value {
    font-size: 14px;
    color: rgba(230, 237, 243, 0.6);
  }

  .theme-preview {
    margin-top: 16px;
  }

  .theme-preview-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #e6edf3;
  }

  .theme-preview-items {
    display: flex;
    gap: 12px;
  }

  .theme-preview-item {
    width: 60px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  .theme-preview-elements {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .preview-progress {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .save-button {
    padding: 10px 20px;
    background: linear-gradient(90deg, #58a6ff 0%, #388bfd 100%);
    border: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .customize-content {
      padding: 16px;
    }

    .theme-color-picker {
      flex-direction: column;
      gap: 16px;
    }
  }
</style>