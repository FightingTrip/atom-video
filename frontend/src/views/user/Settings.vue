/**
* @file Settings.vue
* @description 用户设置页面，用于管理用户账号和偏好设置
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 账号设置：修改用户名、邮箱、密码等账号信息
* - 偏好设置：设置语言、主题、通知等偏好选项
* - 安全设置：管理账号安全相关选项
* - 隐私设置：控制个人信息和视频的可见性
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
*/
<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold mb-6">设置</h1>

    <n-tabs type="line" class="settings-tabs">
      <!-- 个人资料 -->
      <n-tab-pane name="profile" tab="个人资料">
        <div class="space-y-6">
          <!-- 头像设置 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <n-avatar :src="form.avatar || '/default-avatar.png'" :size="100" round />
            </div>
            <div class="flex-grow">
              <h3 class="text-lg font-medium">更改头像</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                支持 JPG、PNG 格式，文件大小不超过 2MB
              </p>
              <n-upload :custom-request="handleAvatarUpload" :max-size="2097152" accept=".jpg,.jpeg,.png"
                :show-file-list="false">
                <n-button>选择图片</n-button>
              </n-upload>
            </div>
          </div>

          <!-- 基本信息表单 -->
          <n-form ref="formRef" :model="form" :rules="rules" label-placement="left" label-width="100"
            require-mark-placement="right-hanging">
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="form.username" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="昵称" path="nickname">
              <n-input v-model:value="form.nickname" placeholder="请输入昵称" />
            </n-form-item>
            <n-form-item label="简介" path="bio">
              <n-input v-model:value="form.bio" type="textarea" placeholder="介绍一下你自己"
                :autosize="{ minRows: 3, maxRows: 5 }" />
            </n-form-item>
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="form.email" placeholder="请输入邮箱" disabled />
            </n-form-item>
          </n-form>

          <div class="flex justify-end">
            <n-button type="primary" @click="handleSaveProfile" :loading="saving">
              保存修改
            </n-button>
          </div>
        </div>
      </n-tab-pane>

      <!-- 账号安全 -->
      <n-tab-pane name="security" tab="账号安全">
        <div class="space-y-6">
          <!-- 修改密码 -->
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 class="text-lg font-medium mb-4">修改密码</h3>
            <n-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-placement="left"
              label-width="100">
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
            </n-form>
            <div class="flex justify-end mt-4">
              <n-button type="primary" @click="handleChangePassword" :loading="changingPassword">
                修改密码
              </n-button>
            </div>
          </div>

          <!-- 两步验证 -->
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium">两步验证</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  启用两步验证后，登录时需要输入额外的验证码
                </p>
              </div>
              <n-switch v-model:value="twoFactorEnabled" @update:value="handleToggle2FA" />
            </div>
          </div>
        </div>
      </n-tab-pane>

      <!-- 通知设置 -->
      <n-tab-pane name="notifications" tab="通知设置">
        <div class="space-y-4">
          <n-card title="邮件通知">
            <n-space vertical>
              <n-checkbox v-model:checked="notificationSettings.email.comments">
                收到评论时通知我
              </n-checkbox>
              <n-checkbox v-model:checked="notificationSettings.email.replies">
                收到回复时通知我
              </n-checkbox>
              <n-checkbox v-model:checked="notificationSettings.email.mentions">
                被@提到时通知我
              </n-checkbox>
              <n-checkbox v-model:checked="notificationSettings.email.subscriptions">
                订阅的频道有新视频时通知我
              </n-checkbox>
            </n-space>
          </n-card>

          <n-card title="站内通知">
            <n-space vertical>
              <n-checkbox v-model:checked="notificationSettings.site.likes">
                收到点赞时通知我
              </n-checkbox>
              <n-checkbox v-model:checked="notificationSettings.site.comments">
                收到评论时通知我
              </n-checkbox>
              <n-checkbox v-model:checked="notificationSettings.site.follows">
                有新粉丝关注时通知我
              </n-checkbox>
            </n-space>
          </n-card>

          <div class="flex justify-end">
            <n-button type="primary" @click="handleSaveNotifications" :loading="savingNotifications">
              保存设置
            </n-button>
          </div>
        </div>
      </n-tab-pane>

      <!-- 隐私设置 -->
      <n-tab-pane name="privacy" tab="隐私设置">
        <div class="space-y-4">
          <n-card title="个人资料可见性">
            <n-space vertical>
              <n-radio-group v-model:value="privacySettings.profileVisibility">
                <n-space vertical>
                  <n-radio value="public">公开</n-radio>
                  <n-radio value="followers">仅关注者可见</n-radio>
                  <n-radio value="private">私密</n-radio>
                </n-space>
              </n-radio-group>
            </n-space>
          </n-card>

          <n-card title="视频默认可见性">
            <n-space vertical>
              <n-radio-group v-model:value="privacySettings.defaultVideoVisibility">
                <n-space vertical>
                  <n-radio value="public">公开</n-radio>
                  <n-radio value="unlisted">不公开</n-radio>
                  <n-radio value="private">私密</n-radio>
                </n-space>
              </n-radio-group>
            </n-space>
          </n-card>

          <div class="flex justify-end">
            <n-button type="primary" @click="handleSavePrivacy" :loading="savingPrivacy">
              保存设置
            </n-button>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import {
    useMessage,
    NTabs,
    NTabPane,
    NButton,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NAvatar,
    NSwitch,
    NCard,
    NSpace,
    NCheckbox,
    NRadioGroup,
    NRadio
  } from 'naive-ui'
  import { useAuthStore } from '@/stores/auth'
  import type { FormInst, UploadCustomRequestOptions } from 'naive-ui'
  import api from '@/utils/api'

  const message = useMessage()
  const authStore = useAuthStore()

  // 表单实例
  const formRef = ref<FormInst | null>(null)
  const passwordFormRef = ref<FormInst | null>(null)

  // 加载状态
  const saving = ref(false)
  const changingPassword = ref(false)
  const savingNotifications = ref(false)
  const savingPrivacy = ref(false)

  // 个人资料表单
  const form = reactive({
    username: authStore.user?.username || '',
    nickname: authStore.user?.nickname || '',
    bio: authStore.user?.bio || '',
    email: authStore.user?.email || '',
    avatar: authStore.user?.avatar || ''
  })

  // 表单验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '用户名长度在 3-20 个字符之间' }
    ],
    nickname: [
      { required: true, message: '请输入昵称' },
      { min: 2, max: 20, message: '昵称长度在 2-20 个字符之间' }
    ],
    bio: [
      { max: 200, message: '简介最多 200 个字符' }
    ]
  }

  // 密码表单
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // 密码表单验证规则
  const passwordRules = {
    currentPassword: [
      { required: true, message: '请输入当前密码' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码' },
      { min: 6, message: '密码至少 6 个字符' }
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码' },
      {
        validator: (rule: any, value: string) => value === passwordForm.newPassword,
        message: '两次输入的密码不一致'
      }
    ]
  }

  // 两步验证开关
  const twoFactorEnabled = ref(false)

  // 通知设置
  const notificationSettings = reactive({
    email: {
      comments: true,
      replies: true,
      mentions: true,
      subscriptions: true
    },
    site: {
      likes: true,
      comments: true,
      follows: true
    }
  })

  // 隐私设置
  const privacySettings = reactive({
    profileVisibility: 'public',
    defaultVideoVisibility: 'public'
  })

  // 处理头像上传
  const handleAvatarUpload = async ({ file }: UploadCustomRequestOptions) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file.file as File)

      const response = await api.post('/user/avatar', formData)
      form.avatar = response.data.url
      message.success('头像上传成功')
    } catch (error) {
      message.error('头像上传失败')
    }
  }

  // 保存个人资料
  const handleSaveProfile = async () => {
    try {
      await formRef.value?.validate()
      saving.value = true

      await api.put('/user/profile', form)
      message.success('保存成功')
    } catch (error: any) {
      if (error?.message) {
        message.error(error.message)
      }
    } finally {
      saving.value = false
    }
  }

  // 修改密码
  const handleChangePassword = async () => {
    try {
      await passwordFormRef.value?.validate()
      changingPassword.value = true

      await api.put('/user/password', passwordForm)
      message.success('密码修改成功')
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } catch (error: any) {
      if (error?.message) {
        message.error(error.message)
      }
    } finally {
      changingPassword.value = false
    }
  }

  // 切换两步验证
  const handleToggle2FA = async (value: boolean) => {
    try {
      await api.put('/user/2fa', { enabled: value })
      message.success(value ? '已启用两步验证' : '已关闭两步验证')
    } catch (error) {
      twoFactorEnabled.value = !value
      message.error('操作失败')
    }
  }

  // 保存通知设置
  const handleSaveNotifications = async () => {
    try {
      savingNotifications.value = true
      await api.put('/user/notifications', notificationSettings)
      message.success('通知设置已保存')
    } catch (error) {
      message.error('保存失败')
    } finally {
      savingNotifications.value = false
    }
  }

  // 保存隐私设置
  const handleSavePrivacy = async () => {
    try {
      savingPrivacy.value = true
      await api.put('/user/privacy', privacySettings)
      message.success('隐私设置已保存')
    } catch (error) {
      message.error('保存失败')
    } finally {
      savingPrivacy.value = false
    }
  }
</script>

<style scoped>
  .settings-tabs {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow;
  }

  :deep(.n-tabs-nav) {
    @apply px-4 pt-4;
  }

  :deep(.n-tab-pane) {
    @apply p-4;
  }

  :deep(.n-card) {
    @apply bg-gray-50 dark:bg-gray-700;
  }
</style>