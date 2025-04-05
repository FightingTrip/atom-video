<template>
  <div class="container mx-auto py-8 px-4">
    <!-- 个人资料头部 -->
    <div class="relative mb-8">
      <div class="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
      <div class="absolute -bottom-16 left-8 flex items-end">
        <n-avatar :src="userProfile.avatar || '/default-avatar.svg'" :size="120" round
          class="border-4 border-white dark:border-gray-800" />
        <div class="ml-4 mb-4">
          <h1 class="text-2xl font-bold text-white">{{ userProfile.nickname }}</h1>
          <p class="text-gray-200">@{{ userProfile.username }}</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="mt-20">
      <n-tabs type="line" animated>
        <!-- 个人信息 -->
        <n-tab-pane name="profile" tab="个人信息">
          <n-form ref="formRef" :model="userProfile" :rules="rules" label-placement="left" label-width="100"
            require-mark-placement="right-hanging" size="medium" class="max-w-2xl">
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="userProfile.username" placeholder="请输入用户名" />
            </n-form-item>

            <n-form-item label="昵称" path="nickname">
              <n-input v-model:value="userProfile.nickname" placeholder="请输入昵称" />
            </n-form-item>

            <n-form-item label="头像" path="avatar">
              <div class="flex items-center gap-4">
                <n-avatar :src="userProfile.avatar || '/default-avatar.svg'" :size="64" round />
                <n-upload accept="image/*" :max="1" :on-before-upload="handleBeforeUpload" @change="handleAvatarChange">
                  <n-button>更换头像</n-button>
                </n-upload>
              </div>
            </n-form-item>

            <n-form-item label="个人简介" path="bio">
              <n-input v-model:value="userProfile.bio" type="textarea" placeholder="介绍一下你自己..."
                :autosize="{ minRows: 3, maxRows: 5 }" />
            </n-form-item>

            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="userProfile.email" placeholder="请输入邮箱" disabled />
              <template #feedback>
                邮箱地址不可更改，如需修改请联系管理员
              </template>
            </n-form-item>

            <n-form-item>
              <n-space>
                <n-button type="primary" @click="handleSubmit" :loading="saving">
                  保存更改
                </n-button>
                <n-button @click="resetForm">重置</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 账号设置 -->
        <n-tab-pane name="settings" tab="账号设置">
          <div class="max-w-2xl space-y-6">
            <n-card title="修改密码" class="shadow-sm">
              <n-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
                <n-form-item label="当前密码" path="currentPassword">
                  <n-input v-model:value="passwordForm.currentPassword" type="password" placeholder="请输入当前密码"
                    show-password-on="click" />
                </n-form-item>

                <n-form-item label="新密码" path="newPassword">
                  <n-input v-model:value="passwordForm.newPassword" type="password" placeholder="请输入新密码"
                    show-password-on="click" />
                </n-form-item>

                <n-form-item label="确认新密码" path="confirmPassword">
                  <n-input v-model:value="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码"
                    show-password-on="click" />
                </n-form-item>

                <n-form-item>
                  <n-button type="primary" @click="handlePasswordChange" :loading="changingPassword">
                    修改密码
                  </n-button>
                </n-form-item>
              </n-form>
            </n-card>

            <n-card title="账号安全" class="shadow-sm">
              <n-space vertical>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium">双因素认证</h3>
                    <p class="text-gray-500 text-sm">启用双因素认证以提高账号安全性</p>
                  </div>
                  <n-switch v-model:value="security.twoFactor" />
                </div>

                <n-divider />

                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium">登录通知</h3>
                    <p class="text-gray-500 text-sm">当有新设备登录时通过邮件通知</p>
                  </div>
                  <n-switch v-model:value="security.loginNotification" />
                </div>
              </n-space>
            </n-card>
          </div>
        </n-tab-pane>

        <!-- 内容管理 -->
        <n-tab-pane name="content" tab="内容管理">
          <n-tabs type="segment">
            <n-tab-pane name="videos" tab="我的视频">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <video-card v-for="video in userVideos" :key="video.id" :video="video" />
              </div>
              <div v-if="!userVideos.length" class="text-center py-8">
                <n-empty description="暂无视频" />
              </div>
            </n-tab-pane>

            <n-tab-pane name="favorites" tab="收藏夹">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <video-card v-for="video in favoriteVideos" :key="video.id" :video="video" />
              </div>
              <div v-if="!favoriteVideos.length" class="text-center py-8">
                <n-empty description="暂无收藏" />
              </div>
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <!-- 数据统计 -->
        <n-tab-pane name="stats" tab="数据统计">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <n-card>
              <n-statistic label="视频总数" :value="stats.totalVideos">
                <template #prefix>
                  <i class="fas fa-video text-blue-500"></i>
                </template>
              </n-statistic>
            </n-card>

            <n-card>
              <n-statistic label="总播放量" :value="stats.totalViews">
                <template #prefix>
                  <i class="fas fa-play text-green-500"></i>
                </template>
              </n-statistic>
            </n-card>

            <n-card>
              <n-statistic label="获赞总数" :value="stats.totalLikes">
                <template #prefix>
                  <i class="fas fa-thumbs-up text-red-500"></i>
                </template>
              </n-statistic>
            </n-card>

            <n-card>
              <n-statistic label="粉丝数" :value="stats.followers">
                <template #prefix>
                  <i class="fas fa-users text-purple-500"></i>
                </template>
              </n-statistic>
            </n-card>
          </div>

          <n-card title="数据趋势" class="shadow-sm">
            <div class="h-80">
              <!-- 这里可以添加图表组件 -->
              <n-empty description="暂无数据" v-if="!stats.chartData?.length" />
            </div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useMessage } from 'naive-ui';
  import type { FormInst, UploadFileInfo } from 'naive-ui';
  import VideoCard from '@/components/VideoCard.vue';
  import {
    NTabs,
    NTabPane,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NSpace,
    NAvatar,
    NUpload,
    NCard,
    NStatistic,
    NEmpty,
    NSwitch,
    NDivider
  } from 'naive-ui';

  const authStore = useAuthStore();
  const message = useMessage();

  // 用户资料表单
  const formRef = ref<FormInst | null>(null);
  const userProfile = ref({
    username: authStore.user?.username || '',
    nickname: authStore.user?.nickname || '',
    email: authStore.user?.email || '',
    avatar: authStore.user?.avatar || '',
    bio: authStore.user?.bio || ''
  });

  // 表单验证规则
  const rules = {
    username: {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    nickname: {
      required: true,
      message: '请输入昵称',
      trigger: 'blur'
    }
  };

  // 密码修改表单
  const passwordFormRef = ref<FormInst | null>(null);
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 密码表单验证规则
  const passwordRules = {
    currentPassword: {
      required: true,
      message: '请输入当前密码',
      trigger: 'blur'
    },
    newPassword: {
      required: true,
      message: '请输入新密码',
      trigger: 'blur',
      min: 6,
      max: 20
    },
    confirmPassword: {
      required: true,
      message: '请确认新密码',
      trigger: 'blur',
      validator: (rule: any, value: string) => {
        return value === passwordForm.value.newPassword;
      }
    }
  };

  // 安全设置
  const security = ref({
    twoFactor: false,
    loginNotification: true
  });

  // 用户视频列表
  const userVideos = ref<any[]>([]);
  const favoriteVideos = ref<any[]>([]);

  // 统计数据
  const stats = ref({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    chartData: []
  });

  // 加载中状态
  const saving = ref(false);
  const changingPassword = ref(false);

  // 处理头像上传
  const handleBeforeUpload = async (data: { file: UploadFileInfo }) => {
    if (!data.file.file) return false;

    const isImage = data.file.file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
      return false;
    }

    const isLt2M = data.file.file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB');
      return false;
    }

    return true;
  };

  const handleAvatarChange = async (data: { file: UploadFileInfo }) => {
    // 处理头像上传逻辑
  };

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate();
    saving.value = true;

    try {
      // 调用 API 更新用户资料
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      saving.value = false;
    }
  };

  // 重置表单
  const resetForm = () => {
    formRef.value?.restoreValidation();
    userProfile.value = {
      username: authStore.user?.username || '',
      nickname: authStore.user?.nickname || '',
      email: authStore.user?.email || '',
      avatar: authStore.user?.avatar || '',
      bio: authStore.user?.bio || ''
    };
  };

  // 修改密码
  const handlePasswordChange = async () => {
    await passwordFormRef.value?.validate();
    changingPassword.value = true;

    try {
      // 调用 API 修改密码
      message.success('密码修改成功');
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } catch (error) {
      message.error('密码修改失败');
    } finally {
      changingPassword.value = false;
    }
  };

  // 初始化数据
  onMounted(async () => {
    try {
      // 获取用户视频列表
      // 获取收藏视频列表
      // 获取统计数据
    } catch (error) {
      message.error('数据加载失败');
    }
  });
</script>

<style scoped>
  .profile-page {
    @apply max-w-7xl mx-auto px-4 py-8;
  }

  .profile-header {
    @apply relative mb-8;
  }

  .cover-photo {
    @apply h-48 md:h-64 w-full overflow-hidden rounded-lg;
  }

  .cover-photo img {
    @apply w-full h-full object-cover;
  }

  .profile-info {
    @apply flex items-start gap-6 -mt-16 px-4;
  }

  .avatar {
    @apply w-32 h-32 rounded-full border-4 border-white shadow-lg;
  }

  .user-details {
    @apply flex-1 pt-16;
  }

  .username {
    @apply text-2xl font-bold mb-2;
  }

  .bio {
    @apply text-gray-600 mb-4;
  }

  .stats {
    @apply flex gap-6;
  }

  .stat {
    @apply flex flex-col items-center;
  }

  .count {
    @apply font-semibold text-lg;
  }

  .label {
    @apply text-sm text-gray-600;
  }

  .content-tabs {
    @apply flex gap-4 border-b mb-6;
  }

  .tab {
    @apply px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent;
  }

  .tab.active {
    @apply text-blue-600 border-blue-600;
  }

  .videos-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
  }
</style>