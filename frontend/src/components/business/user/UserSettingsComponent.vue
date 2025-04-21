/**
* @file UserSettingsComponent.vue
* @description 用户设置组件 - 业务组件，用于用户修改个人设置，不是页面组件
* @author Atom Video Team
* @date 2025-04-08
*/

<template>
  <div class="settings-container">
    <div class="settings-sidebar">
      <h2 class="sidebar-title">设置</h2>
      <n-menu :value="activeSection" @update:value="activeSection = $event" :options="menuOptions" />
    </div>

    <div class="settings-content">
      <!-- 个人资料设置 -->
      <div v-if="activeSection === 'profile'" class="settings-section">
        <h2 class="section-title">个人资料</h2>
        <p class="section-description">管理你的个人信息和公开资料</p>

        <n-form class="settings-form" @submit.prevent="saveProfileSettings">
          <n-form-item label="头像" path="avatar">
            <div class="avatar-uploader">
              <n-avatar :src="profileSettings.avatar" class="avatar-preview" size="large" round />
              <n-upload :show-file-list="false" :custom-request="uploadAvatar" accept="image/*">
                <n-button class="avatar-upload-btn" ghost>更换头像</n-button>
              </n-upload>
            </div>
          </n-form-item>

          <n-form-item label="封面图" path="coverImage">
            <div class="cover-uploader">
              <div class="cover-preview" :style="{ backgroundImage: `url(${profileSettings.coverImage})` }"></div>
              <n-upload :show-file-list="false" :custom-request="uploadCoverImage" accept="image/*">
                <n-button class="cover-upload-btn" ghost>更换封面</n-button>
              </n-upload>
            </div>
          </n-form-item>

          <n-grid :cols="2" :x-gap="12">
            <n-grid-item>
              <n-form-item label="昵称" path="nickname">
                <n-input v-model:value="profileSettings.nickname" placeholder="输入你的昵称" />
              </n-form-item>
            </n-grid-item>

            <n-grid-item>
              <n-form-item label="用户名" path="username">
                <n-input v-model:value="profileSettings.username" placeholder="输入你的用户名" disabled />
                <n-text depth="3">用户名不可更改</n-text>
              </n-form-item>
            </n-grid-item>
          </n-grid>

          <n-form-item label="个人简介" path="bio">
            <n-input v-model:value="profileSettings.bio" type="textarea" placeholder="介绍一下你自己..." :rows="4" />
            <div class="char-count">{{ profileSettings.bio.length }}/200</div>
          </n-form-item>

          <n-form-item label="社交链接">
            <div v-for="(link, index) in profileSettings.socialLinks" :key="index" class="social-link-input">
              <n-grid :cols="24" :x-gap="12">
                <n-grid-item span="8">
                  <n-select v-model:value="link.platform" :options="socialPlatformOptions" />
                </n-grid-item>
                <n-grid-item span="12">
                  <n-input v-model:value="link.url" placeholder="https://..." />
                </n-grid-item>
                <n-grid-item span="4">
                  <n-button quaternary type="error" @click="removeLink(index)">删除</n-button>
                </n-grid-item>
              </n-grid>
            </div>

            <n-button secondary @click="addLink" :disabled="profileSettings.socialLinks.length >= 5"
              class="btn-add-link">
              添加社交链接
            </n-button>
            <n-text depth="3">最多添加5个社交链接</n-text>
          </n-form-item>

          <div class="form-actions">
            <n-button @click="resetProfile">取消</n-button>
            <n-button type="primary" attr-type="submit">保存更改</n-button>
          </div>
        </n-form>
      </div>

      <!-- 帐号设置 -->
      <div v-if="activeSection === 'account'" class="settings-section">
        <h2 class="section-title">帐号设置</h2>
        <p class="section-description">更新你的邮箱地址和密码</p>

        <n-form class="settings-form" @submit.prevent="saveAccountSettings">
          <n-form-item label="邮箱地址" path="email">
            <n-input v-model:value="accountSettings.email" placeholder="你的邮箱地址" />
            <n-text depth="3">用于接收通知和重置密码</n-text>
          </n-form-item>

          <n-form-item label="当前密码" path="currentPassword">
            <n-input v-model:value="accountSettings.currentPassword" type="password" placeholder="输入当前密码"
              show-password-on="click" />
          </n-form-item>

          <n-form-item label="新密码" path="newPassword">
            <n-input v-model:value="accountSettings.newPassword" type="password" placeholder="输入新密码"
              show-password-on="click" />
            <div class="password-strength">
              <div class="strength-bar-container">
                <div class="strength-bar"
                  :style="{ width: `${passwordStrength}%`, backgroundColor: passwordStrengthColor }"></div>
              </div>
              <span class="strength-text" :style="{ color: passwordStrengthColor }">{{ passwordStrengthText }}</span>
            </div>
            <n-text depth="3">密码长度至少6位，建议包含字母、数字和特殊字符</n-text>
          </n-form-item>

          <n-form-item label="确认新密码" path="confirmPassword">
            <n-input v-model:value="accountSettings.confirmPassword" type="password" placeholder="再次输入新密码"
              show-password-on="click" />
          </n-form-item>

          <div class="form-actions">
            <n-button @click="resetAccount">取消</n-button>
            <n-button type="primary" attr-type="submit">更新密码</n-button>
          </div>
        </n-form>
      </div>

      <!-- 通知设置 -->
      <div v-if="activeSection === 'notifications'" class="settings-section">
        <h2 class="section-title">通知设置</h2>
        <p class="section-description">管理你接收的通知和提醒方式</p>

        <n-form class="settings-form" @submit.prevent="saveNotificationSettings">
          <n-card title="互动通知" class="notification-group">
            <n-space vertical size="large">
              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">点赞</div>
                  <div class="notification-description">当有人点赞你的视频或评论时通知你</div>
                </div>
                <n-switch v-model:value="notificationSettings.likes" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">评论</div>
                  <div class="notification-description">当有人评论你的视频时通知你</div>
                </div>
                <n-switch v-model:value="notificationSettings.comments" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">回复</div>
                  <div class="notification-description">当有人回复你的评论时通知你</div>
                </div>
                <n-switch v-model:value="notificationSettings.replies" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">关注</div>
                  <div class="notification-description">当有人关注你时通知你</div>
                </div>
                <n-switch v-model:value="notificationSettings.follows" />
              </n-space>
            </n-space>
          </n-card>

          <n-card title="系统通知" class="notification-group">
            <n-space vertical size="large">
              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">视频处理</div>
                  <div class="notification-description">当你的视频处理完成或失败时通知你</div>
                </div>
                <n-switch v-model:value="notificationSettings.videoProcessing" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">更新与公告</div>
                  <div class="notification-description">接收关于平台更新和重要公告的通知</div>
                </div>
                <n-switch v-model:value="notificationSettings.updates" />
              </n-space>
            </n-space>
          </n-card>

          <n-card title="通知方式" class="notification-group">
            <n-space vertical size="large">
              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">邮件通知</div>
                  <div class="notification-description">通过邮件接收通知</div>
                </div>
                <n-switch v-model:value="notificationSettings.emailNotification" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="notification-text">
                  <div class="notification-label">浏览器通知</div>
                  <div class="notification-description">在浏览器中接收通知</div>
                </div>
                <n-switch v-model:value="notificationSettings.browserNotification" />
              </n-space>
            </n-space>
          </n-card>

          <div class="form-actions">
            <n-button @click="resetNotifications">取消</n-button>
            <n-button type="primary" attr-type="submit">保存设置</n-button>
          </div>
        </n-form>
      </div>

      <!-- 隐私设置 -->
      <div v-if="activeSection === 'privacy'" class="settings-section">
        <h2 class="section-title">隐私设置</h2>
        <p class="section-description">管理你的隐私和可见性选项</p>

        <n-form class="settings-form" @submit.prevent="savePrivacySettings">
          <n-card title="个人资料隐私" class="privacy-group">
            <n-space vertical size="large">
              <n-space justify="space-between" align="center">
                <div class="privacy-text">
                  <div class="privacy-label">显示观看历史</div>
                  <div class="privacy-description">允许其他用户查看你的观看历史</div>
                </div>
                <n-switch v-model:value="privacySettings.showWatchHistory" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="privacy-text">
                  <div class="privacy-label">显示收藏内容</div>
                  <div class="privacy-description">允许其他用户查看你的收藏内容</div>
                </div>
                <n-switch v-model:value="privacySettings.showFavorites" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="privacy-text">
                  <div class="privacy-label">显示关注列表</div>
                  <div class="privacy-description">允许其他用户查看你关注的用户</div>
                </div>
                <n-switch v-model:value="privacySettings.showFollowing" />
              </n-space>
            </n-space>
          </n-card>

          <n-card title="互动隐私" class="privacy-group">
            <n-space vertical size="large">
              <n-space justify="space-between" align="center">
                <div class="privacy-text">
                  <div class="privacy-label">显示点赞</div>
                  <div class="privacy-description">允许其他用户查看你点赞的内容</div>
                </div>
                <n-switch v-model:value="privacySettings.showLikes" />
              </n-space>

              <n-space justify="space-between" align="center">
                <div class="privacy-text">
                  <div class="privacy-label">评论权限</div>
                  <div class="privacy-description">选择谁可以评论你上传的视频</div>
                </div>
                <n-select v-model:value="privacySettings.commentPermission" :options="commentOptions"
                  style="width: 150px" />
              </n-space>
            </n-space>
          </n-card>

          <div class="form-actions">
            <n-button @click="resetPrivacy">取消</n-button>
            <n-button type="primary" attr-type="submit">保存设置</n-button>
          </div>
        </n-form>
      </div>

      <!-- 外观设置 -->
      <div v-if="activeSection === 'appearance'" class="settings-section">
        <h2 class="section-title">外观设置</h2>
        <p class="section-description">自定义网站的显示方式</p>

        <n-form class="settings-form">
          <div class="appearance-settings">
            <h3 class="settings-section-title">{{ $t('settings.appearance') }}</h3>

            <div class="form-group">
              <label for="theme" class="form-label">{{ $t('settings.theme') }}</label>
              <n-select id="theme" v-model:value="appearanceSettings.theme" :options="themeOptions" />
            </div>

            <div class="form-group">
              <label for="fontSize" class="form-label">{{ $t('settings.fontSize') }}</label>
              <div class="fontSize-selector">
                <span class="fontSize-label">小</span>
                <n-slider v-model:value="appearanceSettings.fontSize" :min="12" :max="20" :step="1" />
                <span class="fontSize-value">{{ appearanceSettings.fontSize }}px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="language" class="form-label">{{ $t('settings.language') }}</label>
              <LanguageSelectorComponent class="settings-language-selector" />
            </div>

            <div class="settings-actions">
              <n-button @click="resetAppearance">取消</n-button>
              <n-button type="primary" @click="saveAppearanceSettings">保存设置</n-button>
            </div>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, h } from 'vue';
  import {
    NMenu,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NAvatar,
    NGrid,
    NGridItem,
    NSelect,
    NSwitch,
    NCard,
    NSpace,
    NText,
    NRadioGroup,
    NRadio,
    NSlider,
    NUpload,
    useMessage
  } from 'naive-ui';
  import LanguageSelectorComponent from '@/components/business/user/LanguageSelectorComponent.vue';
  import { useUserSettings } from '@/composables/useUserSettings';
  import type { User } from '@/types';

  // Props
  const props = defineProps<{
    userData?: User;
  }>();

  // 使用useUserSettings composable
  const {
    isLoading,
    saveLoading,
    profileSettings,
    accountSettings,
    notificationSettings,
    privacySettings,
    appearanceSettings,
    passwordStrength,
    passwordStrengthText,
    passwordStrengthColor,
    passwordsMatch,
    loadUserSettings,
    saveProfileSettings,
    saveAccountSettings,
    saveNotificationSettings,
    savePrivacySettings,
    saveAppearanceSettings,
    addSocialLink,
    removeSocialLink,
    resetProfileSettings,
    resetAccountSettings,
    resetNotificationSettings,
    resetPrivacySettings,
    resetAppearanceSettings
  } = useUserSettings();

  // 消息提示
  const message = useMessage();

  // 当前活动部分
  const activeSection = ref('profile');

  // 设置部分列表
  const sections = [
    { id: 'profile', name: '个人资料', icon: '👤' },
    { id: 'account', name: '帐号设置', icon: '🔐' },
    { id: 'notifications', name: '通知设置', icon: '🔔' },
    { id: 'privacy', name: '隐私设置', icon: '🔒' },
    { id: 'appearance', name: '外观设置', icon: '🎨' }
  ];

  // 菜单选项
  const menuOptions = computed(() =>
    sections.map(section => ({
      label: section.name,
      key: section.id,
      icon: () => h('span', { class: 'nav-icon' }, section.icon)
    }))
  );

  // 主题选项
  const themeOptions = [
    { label: '跟随系统', value: 'system' },
    { label: '亮色模式', value: 'light' },
    { label: '暗色模式', value: 'dark' }
  ];

  // 社交平台选项
  const socialPlatformOptions = [
    { label: 'GitHub', value: 'GitHub' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'YouTube', value: 'YouTube' },
    { label: 'Instagram', value: 'Instagram' },
    { label: '个人网站', value: 'Personal' }
  ];

  // 评论权限选项
  const commentOptions = [
    { label: '所有人', value: 'everyone' },
    { label: '已关注我的人', value: 'followers' },
    { label: '我关注的人', value: 'following' },
    { label: '禁止评论', value: 'none' }
  ];

  // 上传头像处理函数
  function uploadAvatar({ file }: { file: File }) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        profileSettings.avatar = result;
        message.success('头像已上传');
      }
    };
    reader.readAsDataURL(file);
  }

  // 上传封面图处理函数
  function uploadCoverImage({ file }: { file: File }) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        profileSettings.coverImage = result;
        message.success('封面图片已上传');
      }
    };
    reader.readAsDataURL(file);
  }

  // 添加社交链接
  function addLink() {
    addSocialLink();
  }

  // 删除社交链接
  function removeLink(index: number) {
    removeSocialLink(index);
  }

  // 应用主题
  function applyTheme(theme: string) {
    const htmlEl = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      htmlEl.setAttribute('data-theme', theme);
    }
  }

  // 应用字体大小
  function applyFontSize(size: number) {
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
  }

  // 重置个人资料设置
  function resetProfile() {
    resetProfileSettings();
  }

  // 重置账号设置
  function resetAccount() {
    resetAccountSettings();
  }

  // 重置通知设置
  function resetNotifications() {
    resetNotificationSettings();
  }

  // 重置隐私设置
  function resetPrivacy() {
    resetPrivacySettings();
  }

  // 重置外观设置
  function resetAppearance() {
    resetAppearanceSettings();
  }
</script>

<style scoped>
  :root {
    --base-font-size: 16px;
  }

  .settings-container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
    gap: 24px;
    font-size: var(--base-font-size);
  }

  .settings-sidebar {
    width: 250px;
    flex-shrink: 0;
  }

  .sidebar-title {
    font-size: calc(var(--base-font-size) * 1.25);
    font-weight: 600;
    margin: 0 0 24px;
    color: var(--color-text-primary);
  }

  .settings-content {
    flex: 1;
    min-width: 0;
  }

  .settings-section {
    background-color: var(--color-bg-surface);
    border-radius: 8px;
    padding: 24px;
  }

  .section-title {
    font-size: calc(var(--base-font-size) * 1.25);
    font-weight: 600;
    margin: 0 0 8px;
    color: var(--color-text-primary);
  }

  .section-description {
    font-size: calc(var(--base-font-size) * 0.875);
    color: var(--color-text-secondary);
    margin: 0 0 32px;
  }

  .settings-form {
    max-width: 700px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-group-half {
    width: calc(50% - 8px);
  }

  .form-row {
    display: flex;
    gap: 16px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--color-text-primary);
    font-size: inherit;
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
    font-size: calc(var(--base-font-size) * 0.875);
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

  .form-input:disabled {
    background-color: var(--color-bg-subtle);
    cursor: not-allowed;
  }

  .form-hint {
    font-size: calc(var(--base-font-size) * 0.75);
    color: var(--color-text-secondary);
    margin-top: 4px;
  }

  .char-count {
    font-size: calc(var(--base-font-size) * 0.75);
    color: var(--color-text-secondary);
    text-align: right;
    margin-top: 4px;
  }

  .avatar-uploader,
  .cover-uploader {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .cover-preview {
    width: 200px;
    height: 80px;
    border-radius: 4px;
    background-size: cover;
    background-position: center;
  }

  .avatar-upload-btn,
  .cover-upload-btn {
    padding: 8px 16px;
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
    border-radius: 4px;
    cursor: pointer;
    font-size: calc(var(--base-font-size) * 0.875);
    transition: background-color 0.2s;
  }

  .avatar-upload-btn:hover,
  .cover-upload-btn:hover {
    background-color: var(--color-bg-subtle);
  }

  .social-link-input {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .social-link-input .form-select {
    width: 120px;
    flex-shrink: 0;
  }

  .social-link-input .form-input {
    flex: 1;
  }

  .btn-remove-link {
    padding: 0 8px;
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-danger);
    border-radius: 4px;
    cursor: pointer;
    font-size: calc(var(--base-font-size) * 0.875);
  }

  .btn-add-link {
    padding: 8px 16px;
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
    border-radius: 4px;
    cursor: pointer;
    font-size: calc(var(--base-font-size) * 0.875);
    transition: background-color 0.2s;
  }

  .btn-add-link:hover {
    background-color: var(--color-bg-subtle);
  }

  .btn-add-link:disabled {
    color: var(--color-text-muted);
    cursor: not-allowed;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 24px;
    border-radius: 4px;
    font-size: calc(var(--base-font-size) * 0.875);
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-primary {
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-primary);
  }

  .btn-secondary:hover {
    background-color: var(--color-bg-subtle);
  }

  .notification-group,
  .privacy-group {
    margin-bottom: 32px;
  }

  .notification-title,
  .privacy-title {
    font-size: calc(var(--base-font-size) * 1);
    font-weight: 600;
    margin: 0 0 16px;
    color: var(--color-text-primary);
  }

  .notification-item,
  .privacy-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .notification-label,
  .privacy-label {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--color-text-primary);
  }

  .notification-description,
  .privacy-description {
    font-size: calc(var(--base-font-size) * 0.8125);
    color: var(--color-text-secondary);
  }

  /* 开关样式 */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-bg-inset);
    transition: .4s;
    border-radius: 24px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked+.toggle-slider {
    background-color: var(--color-accent-primary);
  }

  input:checked+.toggle-slider:before {
    transform: translateX(22px);
  }

  @media (max-width: 768px) {
    .settings-container {
      flex-direction: column;
    }

    .settings-sidebar {
      width: 100%;
      margin-bottom: 24px;
    }

    .form-row {
      flex-direction: column;
      gap: 24px;
    }

    .form-group-half {
      width: 100%;
    }

    .avatar-uploader,
    .cover-uploader {
      flex-direction: column;
      align-items: flex-start;
    }

    .cover-preview {
      width: 100%;
    }
  }

  .settings-language-selector {
    margin-top: 8px;
    width: 100%;
  }

  .settings-language-selector :deep(.selector-trigger) {
    width: 100%;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    height: 38px;
  }

  /* 字体大小选择器样式 */
  .fontSize-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  .fontSize-label {
    font-size: calc(var(--base-font-size) * 0.875);
    color: var(--color-text-secondary);
    width: 60px;
  }

  .fontSize-value {
    font-size: calc(var(--base-font-size) * 0.875);
    color: var(--color-text-primary);
    width: 30px;
    text-align: right;
  }

  /* 密码强度样式 */
  .password-strength {
    display: flex;
    align-items: center;
    margin-top: 8px;
    gap: 10px;
  }

  .strength-bar-container {
    flex: 1;
    height: 4px;
    background-color: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .strength-bar {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
  }

  .strength-text {
    font-size: 12px;
    width: 30px;
    text-align: center;
  }
</style>