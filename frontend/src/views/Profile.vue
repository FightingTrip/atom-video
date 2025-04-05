<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 个人资料头部 - 使用渐变背景 -->
    <div class="relative">
      <div class="h-64 w-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
      <div class="absolute bottom-0 left-0 right-0 px-8 transform translate-y-1/2">
        <div class="max-w-7xl mx-auto flex items-end space-x-6">
          <n-avatar :src="userProfile.avatar || '/default-avatar.svg'" :size="160" round
            class="border-4 border-white dark:border-gray-800 shadow-lg" />
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-white mb-1">{{ userProfile.nickname || '未设置昵称' }}</h1>
            <p class="text-gray-200">@{{ userProfile.username }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-8 pt-24 pb-12">
      <n-tabs type="segment" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <!-- 个人信息 -->
        <n-tab-pane name="profile" tab="个人信息">
          <div class="max-w-3xl mx-auto">
            <n-form ref="formRef" :model="userProfile" :rules="rules" label-placement="left" label-width="100"
              require-mark-placement="right-hanging" size="large">
              <div class="space-y-8">
                <!-- 基本信息卡片 -->
                <n-card title="基本信息" class="shadow-sm">
                  <n-form-item label="用户名" path="username">
                    <n-input v-model:value="userProfile.username" placeholder="请输入用户名" class="max-w-lg" />
                  </n-form-item>

                  <n-form-item label="昵称" path="nickname">
                    <n-input v-model:value="userProfile.nickname" placeholder="请输入昵称" class="max-w-lg" />
                  </n-form-item>

                  <n-form-item label="个人简介" path="bio">
                    <n-input v-model:value="userProfile.bio" type="textarea" placeholder="介绍一下你自己..."
                      :autosize="{ minRows: 3, maxRows: 5 }" class="max-w-lg" />
                  </n-form-item>
                </n-card>

                <!-- 头像设置卡片 -->
                <n-card title="头像设置" class="shadow-sm">
                  <div class="flex items-start space-x-8">
                    <div class="flex-shrink-0">
                      <n-avatar :src="userProfile.avatar || '/default-avatar.svg'" :size="120" round />
                    </div>
                    <div class="flex-grow">
                      <h3 class="text-lg font-medium mb-2">更换头像</h3>
                      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        支持 JPG、PNG 格式的图片，最大不超过 2MB
                      </p>
                      <n-upload accept="image/*" :max="1" :on-before-upload="handleBeforeUpload"
                        @change="handleAvatarChange">
                        <n-button type="primary" class="mr-4">
                          <template #icon>
                            <i class="fas fa-upload mr-2"></i>
                          </template>
                          上传新头像
                        </n-button>
                      </n-upload>
                    </div>
                  </div>
                </n-card>

                <!-- 联系方式卡片 -->
                <n-card title="联系方式" class="shadow-sm">
                  <n-form-item label="邮箱" path="email">
                    <div class="flex items-center space-x-4 max-w-lg">
                      <n-input v-model:value="userProfile.email" placeholder="请输入邮箱" disabled />
                      <n-button quaternary size="small">
                        <template #icon>
                          <i class="fas fa-exclamation-circle"></i>
                        </template>
                        验证邮箱
                      </n-button>
                    </div>
                    <template #feedback>
                      <span class="text-gray-500">邮箱地址不可更改，如需修改请联系管理员</span>
                    </template>
                  </n-form-item>
                </n-card>

                <!-- 保存按钮 -->
                <div class="flex justify-end space-x-4">
                  <n-button @click="resetForm" class="w-24">
                    重置
                  </n-button>
                  <n-button type="primary" @click="handleSubmit" :loading="saving" class="w-24">
                    保存更改
                  </n-button>
                </div>
              </div>
            </n-form>
          </div>
        </n-tab-pane>

        <!-- 账号设置 -->
        <n-tab-pane name="settings" tab="账号设置">
          <div class="max-w-3xl mx-auto space-y-8">
            <!-- 密码修改卡片 -->
            <n-card title="密码修改" class="shadow-sm">
              <n-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-placement="left"
                label-width="100" size="large">
                <n-form-item label="当前密码" path="currentPassword">
                  <n-input v-model:value="passwordForm.currentPassword" type="password" placeholder="请输入当前密码"
                    show-password-on="click" class="max-w-lg" />
                </n-form-item>

                <n-form-item label="新密码" path="newPassword">
                  <n-input v-model:value="passwordForm.newPassword" type="password" placeholder="请输入新密码"
                    show-password-on="click" class="max-w-lg" />
                </n-form-item>

                <n-form-item label="确认密码" path="confirmPassword">
                  <n-input v-model:value="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码"
                    show-password-on="click" class="max-w-lg" />
                </n-form-item>

                <div class="flex justify-end">
                  <n-button type="primary" @click="handlePasswordChange" :loading="changingPassword" class="w-32">
                    修改密码
                  </n-button>
                </div>
              </n-form>
            </n-card>

            <!-- 账号安全卡片 -->
            <n-card title="账号安全" class="shadow-sm">
              <div class="space-y-6">
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 class="text-lg font-medium mb-1">双因素认证</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      启用双因素认证以提高账号安全性
                    </p>
                  </div>
                  <n-switch v-model:value="security.twoFactor">
                    <template #checked>已开启</template>
                    <template #unchecked>已关闭</template>
                  </n-switch>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 class="text-lg font-medium mb-1">登录通知</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      当有新设备登录时通过邮件通知
                    </p>
                  </div>
                  <n-switch v-model:value="security.loginNotification">
                    <template #checked>已开启</template>
                    <template #unchecked>已关闭</template>
                  </n-switch>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 class="text-lg font-medium mb-1">登录设备管理</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      查看并管理当前登录的所有设备
                    </p>
                  </div>
                  <n-button secondary>
                    <template #icon>
                      <i class="fas fa-laptop mr-2"></i>
                    </template>
                    管理设备
                  </n-button>
                </div>
              </div>
            </n-card>

            <!-- 账号注销卡片 -->
            <n-card title="账号注销" class="shadow-sm">
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                  注销账号
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  注销账号后，您的所有数据将被永久删除，且无法恢复
                </p>
                <n-button type="error" secondary>
                  <template #icon>
                    <i class="fas fa-trash-alt mr-2"></i>
                  </template>
                  注销账号
                </n-button>
              </div>
            </n-card>
          </div>
        </n-tab-pane>

        <!-- 内容管理 -->
        <n-tab-pane name="content" tab="内容管理">
          <div class="space-y-8">
            <!-- 数据概览 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <n-card class="bg-gradient-to-br from-blue-500 to-blue-600">
                <n-statistic :value="stats.totalVideos" label="视频总数" class="text-white">
                  <template #prefix>
                    <i class="fas fa-video text-white/80 text-xl"></i>
                  </template>
                </n-statistic>
              </n-card>

              <n-card class="bg-gradient-to-br from-green-500 to-green-600">
                <n-statistic :value="stats.totalViews" label="总播放量" class="text-white">
                  <template #prefix>
                    <i class="fas fa-play text-white/80 text-xl"></i>
                  </template>
                </n-statistic>
              </n-card>

              <n-card class="bg-gradient-to-br from-red-500 to-red-600">
                <n-statistic :value="stats.totalLikes" label="获赞总数" class="text-white">
                  <template #prefix>
                    <i class="fas fa-thumbs-up text-white/80 text-xl"></i>
                  </template>
                </n-statistic>
              </n-card>

              <n-card class="bg-gradient-to-br from-purple-500 to-purple-600">
                <n-statistic :value="stats.followers" label="粉丝数" class="text-white">
                  <template #prefix>
                    <i class="fas fa-users text-white/80 text-xl"></i>
                  </template>
                </n-statistic>
              </n-card>
            </div>

            <!-- 视频列表 -->
            <n-tabs type="line" animated>
              <n-tab-pane name="videos" tab="我的视频">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <video-card v-for="video in userVideos" :key="video.id" :video="video" />
                </div>
                <div v-if="!userVideos.length" class="text-center py-12">
                  <n-empty description="暂无视频">
                    <template #extra>
                      <n-button type="primary">
                        <template #icon>
                          <i class="fas fa-upload mr-2"></i>
                        </template>
                        上传视频
                      </n-button>
                    </template>
                  </n-empty>
                </div>
              </n-tab-pane>

              <n-tab-pane name="favorites" tab="收藏夹">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <video-card v-for="video in favoriteVideos" :key="video.id" :video="video" />
                </div>
                <div v-if="!favoriteVideos.length" class="text-center py-12">
                  <n-empty description="暂无收藏">
                    <template #extra>
                      <n-button secondary>
                        <template #icon>
                          <i class="fas fa-compass mr-2"></i>
                        </template>
                        浏览视频
                      </n-button>
                    </template>
                  </n-empty>
                </div>
              </n-tab-pane>
            </n-tabs>
          </div>
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
  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB');
      return false;
    }
    return true;
  };

  const handleAvatarChange = async (options: { file: UploadFileInfo }) => {
    try {
      const { file } = options;
      if (file.file) {
        // 这里应该调用实际的上传API，现在用模拟数据
        const fakeUrl = URL.createObjectURL(file.file);
        userProfile.value.avatar = fakeUrl;
        message.success('头像上传成功');
      }
    } catch (error) {
      message.error('头像上传失败');
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      await formRef.value?.validate();
      saving.value = true;
      // 这里应该调用实际的API，现在用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      authStore.setUser({ ...authStore.user, ...userProfile.value });
      message.success('保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      saving.value = false;
    }
  };

  // 重置表单
  const resetForm = () => {
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
    try {
      await passwordFormRef.value?.validate();
      changingPassword.value = true;
      // 这里应该调用实际的API，现在用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('密码修改成功');
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } catch (error) {
      console.error('密码修改失败:', error);
    } finally {
      changingPassword.value = false;
    }
  };

  // 加载用户数据
  onMounted(async () => {
    try {
      // 这里应该调用实际的API，现在用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      stats.value = {
        totalVideos: 12,
        totalViews: 1234,
        totalLikes: 567,
        followers: 89,
        chartData: []
      };
      userVideos.value = [];
      favoriteVideos.value = [];
    } catch (error) {
      console.error('加载用户数据失败:', error);
      message.error('加载用户数据失败');
    }
  });
</script>

<style scoped>
  :deep(.n-card) {
    transition: all 0.3s ease;
  }

  :deep(.n-card:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :deep(.n-statistic-value) {
    @apply text-2xl font-bold;
  }

  :deep(.n-statistic-label) {
    @apply text-sm opacity-80;
  }

  :deep(.n-button) {
    transition: all 0.2s ease;
  }

  :deep(.n-tabs-nav) {
    @apply mb-6;
  }

  :deep(.n-form-item-label) {
    @apply font-medium;
  }
</style>