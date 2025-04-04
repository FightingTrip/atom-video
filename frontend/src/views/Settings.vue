<template>
  <div class="settings-page">
    <h1 class="page-title">设置</h1>
    
    <div class="settings-grid">
      <div class="settings-nav">
        <button 
          v-for="section in sections" 
          :key="section.id"
          :class="['nav-item', { active: currentSection === section.id }]"
          @click="currentSection = section.id"
        >
          {{ section.label }}
        </button>
      </div>

      <div class="settings-content">
        <!-- 账户设置 -->
        <div v-if="currentSection === 'account'" class="settings-section">
          <h2 class="section-title">账户设置</h2>
          <form @submit.prevent="saveAccountSettings" class="settings-form">
            <div class="form-group">
              <label for="username">用户名</label>
              <input 
                id="username" 
                v-model="accountSettings.username" 
                type="text" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="email">电子邮箱</label>
              <input 
                id="email" 
                v-model="accountSettings.email" 
                type="email" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="bio">个人简介</label>
              <textarea 
                id="bio" 
                v-model="accountSettings.bio" 
                class="form-input"
                rows="4"
              ></textarea>
            </div>
            <button type="submit" class="btn-primary">保存更改</button>
          </form>
        </div>

        <!-- 隐私设置 -->
        <div v-if="currentSection === 'privacy'" class="settings-section">
          <h2 class="section-title">隐私设置</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h3>公开个人资料</h3>
                <p>允许其他用户查看您的个人资料</p>
              </div>
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="privacySettings.isProfilePublic"
                >
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h3>显示观看历史</h3>
                <p>允许其他用户查看您的观看历史</p>
              </div>
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="privacySettings.isWatchHistoryPublic"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div v-if="currentSection === 'notifications'" class="settings-section">
          <h2 class="section-title">通知设置</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h3>新订阅者通知</h3>
                <p>当有新用户订阅您时接收通知</p>
              </div>
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="notificationSettings.newSubscriber"
                >
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h3>评论通知</h3>
                <p>当有人评论您的视频时接收通知</p>
              </div>
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="notificationSettings.newComment"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentSection = ref('account');

const sections = [
  { id: 'account', label: '账户' },
  { id: 'privacy', label: '隐私' },
  { id: 'notifications', label: '通知' }
];

const accountSettings = ref({
  username: '用户名',
  email: 'user@example.com',
  bio: '这是个人简介'
});

const privacySettings = ref({
  isProfilePublic: true,
  isWatchHistoryPublic: false
});

const notificationSettings = ref({
  newSubscriber: true,
  newComment: true
});

const saveAccountSettings = () => {
  // 保存账户设置的逻辑
  console.log('保存账户设置:', accountSettings.value);
};
</script>

<style scoped>
.settings-page {
  @apply max-w-7xl mx-auto px-4 py-8;
}

.page-title {
  @apply text-2xl font-bold mb-8;
}

.settings-grid {
  @apply grid grid-cols-1 md:grid-cols-4 gap-8;
}

.settings-nav {
  @apply md:col-span-1 space-y-2;
}

.nav-item {
  @apply w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-lg;
}

.nav-item.active {
  @apply bg-blue-50 text-blue-600;
}

.settings-content {
  @apply md:col-span-3 bg-white rounded-lg shadow p-6;
}

.section-title {
  @apply text-xl font-semibold mb-6;
}

.settings-form {
  @apply space-y-6;
}

.form-group {
  @apply space-y-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.settings-list {
  @apply space-y-6;
}

.setting-item {
  @apply flex items-center justify-between py-4 border-b last:border-b-0;
}

.setting-info h3 {
  @apply font-medium text-gray-900;
}

.setting-info p {
  @apply text-sm text-gray-500;
}

.switch {
  @apply relative inline-block w-12 h-6;
}

.switch input {
  @apply opacity-0 w-0 h-0;
}

.slider {
  @apply absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-colors duration-200;
}

.slider:before {
  content: '';
  @apply absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-transform duration-200;
}

input:checked + .slider {
  @apply bg-blue-600;
}

input:checked + .slider:before {
  @apply transform translate-x-6;
}
</style> 