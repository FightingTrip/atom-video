<template>
  <div class="settings-container">
    <div class="settings-sidebar">
      <h2 class="sidebar-title">设置</h2>
      <div class="sidebar-nav">
        <button v-for="section in sections" :key="section.id" class="nav-item"
          :class="{ active: activeSection === section.id }" @click="activeSection = section.id">
          <span class="nav-icon">{{ section.icon }}</span>
          <span class="nav-label">{{ section.name }}</span>
        </button>
      </div>
    </div>

    <div class="settings-content">
      <!-- 个人资料设置 -->
      <div v-if="activeSection === 'profile'" class="settings-section">
        <h2 class="section-title">个人资料</h2>
        <p class="section-description">管理你的个人信息和公开资料</p>

        <form class="settings-form" @submit.prevent="saveProfileSettings">
          <div class="form-group">
            <label for="avatar" class="form-label">头像</label>
            <div class="avatar-uploader">
              <img :src="profileSettings.avatar" alt="User Avatar" class="avatar-preview" />
              <button type="button" class="avatar-upload-btn">更换头像</button>
            </div>
          </div>

          <div class="form-group">
            <label for="cover" class="form-label">封面图</label>
            <div class="cover-uploader">
              <div class="cover-preview" :style="{ backgroundImage: `url(${profileSettings.coverImage})` }"></div>
              <button type="button" class="cover-upload-btn">更换封面</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="nickname" class="form-label">昵称</label>
              <input id="nickname" v-model="profileSettings.nickname" type="text" class="form-input"
                placeholder="输入你的昵称" />
            </div>

            <div class="form-group form-group-half">
              <label for="username" class="form-label">用户名</label>
              <input id="username" v-model="profileSettings.username" type="text" class="form-input"
                placeholder="输入你的用户名" :disabled="true" />
              <div class="form-hint">用户名不可更改</div>
            </div>
          </div>

          <div class="form-group">
            <label for="bio" class="form-label">个人简介</label>
            <textarea id="bio" v-model="profileSettings.bio" class="form-textarea" placeholder="介绍一下你自己..."
              rows="4"></textarea>
            <div class="char-count">{{ profileSettings.bio.length }}/200</div>
          </div>

          <div class="form-group">
            <label class="form-label">社交链接</label>
            <div v-for="(link, index) in profileSettings.socialLinks" :key="index" class="social-link-input">
              <select v-model="link.platform" class="form-select">
                <option value="GitHub">GitHub</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Website">个人网站</option>
              </select>
              <input v-model="link.url" type="url" class="form-input" placeholder="https://..." />
              <button type="button" class="btn-remove-link" @click="removeLink(index)">删除</button>
            </div>

            <button type="button" class="btn-add-link" @click="addLink"
              :disabled="profileSettings.socialLinks.length >= 5">
              添加社交链接
            </button>
            <div class="form-hint">最多添加5个社交链接</div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetProfile">取消</button>
            <button type="submit" class="btn-primary">保存更改</button>
          </div>
        </form>
      </div>

      <!-- 帐号设置 -->
      <div v-if="activeSection === 'account'" class="settings-section">
        <h2 class="section-title">帐号设置</h2>
        <p class="section-description">更新你的邮箱地址和密码</p>

        <form class="settings-form" @submit.prevent="saveAccountSettings">
          <div class="form-group">
            <label for="email" class="form-label">邮箱地址</label>
            <input id="email" v-model="accountSettings.email" type="email" class="form-input" placeholder="你的邮箱地址" />
            <div class="form-hint">用于接收通知和重置密码</div>
          </div>

          <div class="form-group">
            <label for="currentPassword" class="form-label">当前密码</label>
            <input id="currentPassword" v-model="accountSettings.currentPassword" type="password" class="form-input"
              placeholder="输入当前密码" />
          </div>

          <div class="form-group">
            <label for="newPassword" class="form-label">新密码</label>
            <input id="newPassword" v-model="accountSettings.newPassword" type="password" class="form-input"
              placeholder="输入新密码" />
            <div class="form-hint">密码长度至少8位，且包含字母和数字</div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">确认新密码</label>
            <input id="confirmPassword" v-model="accountSettings.confirmPassword" type="password" class="form-input"
              placeholder="再次输入新密码" />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetAccount">取消</button>
            <button type="submit" class="btn-primary">更新密码</button>
          </div>
        </form>
      </div>

      <!-- 通知设置 -->
      <div v-if="activeSection === 'notifications'" class="settings-section">
        <h2 class="section-title">通知设置</h2>
        <p class="section-description">管理你接收的通知和提醒方式</p>

        <form class="settings-form" @submit.prevent="saveNotificationSettings">
          <div class="notification-group">
            <h3 class="notification-title">互动通知</h3>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">点赞</div>
                <div class="notification-description">当有人点赞你的视频或评论时通知你</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.likes">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">评论</div>
                <div class="notification-description">当有人评论你的视频时通知你</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.comments">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">回复</div>
                <div class="notification-description">当有人回复你的评论时通知你</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.replies">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">关注</div>
                <div class="notification-description">当有人关注你时通知你</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.follows">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-group">
            <h3 class="notification-title">系统通知</h3>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">视频处理</div>
                <div class="notification-description">当你的视频处理完成或失败时通知你</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.videoProcessing">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">更新与公告</div>
                <div class="notification-description">接收关于平台更新和重要公告的通知</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.updates">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-group">
            <h3 class="notification-title">通知方式</h3>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">邮件通知</div>
                <div class="notification-description">通过邮件接收通知</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.emailNotifications">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-text">
                <div class="notification-label">浏览器通知</div>
                <div class="notification-description">通过浏览器推送接收通知</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.browserNotifications">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetNotifications">取消</button>
            <button type="submit" class="btn-primary">保存设置</button>
          </div>
        </form>
      </div>

      <!-- 隐私设置 -->
      <div v-if="activeSection === 'privacy'" class="settings-section">
        <h2 class="section-title">隐私设置</h2>
        <p class="section-description">管理你的隐私选项和数据使用方式</p>

        <form class="settings-form" @submit.prevent="savePrivacySettings">
          <div class="privacy-group">
            <h3 class="privacy-title">内容隐私</h3>

            <div class="form-group">
              <label for="defaultVideoPrivacy" class="form-label">默认视频可见性</label>
              <select id="defaultVideoPrivacy" v-model="privacySettings.defaultVideoPrivacy" class="form-select">
                <option value="public">公开 - 所有人可见</option>
                <option value="unlisted">不公开 - 仅通过链接访问</option>
                <option value="private">私密 - 仅自己可见</option>
              </select>
              <div class="form-hint">上传新视频时的默认可见性设置</div>
            </div>

            <div class="privacy-item">
              <div class="privacy-text">
                <div class="privacy-label">隐藏我的观看历史</div>
                <div class="privacy-description">不向其他用户显示你正在观看的内容</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="privacySettings.hideWatchHistory">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-text">
                <div class="privacy-label">隐藏我已点赞的内容</div>
                <div class="privacy-description">不向其他用户显示你点赞的视频</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="privacySettings.hideLikedVideos">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="privacy-group">
            <h3 class="privacy-title">个人资料隐私</h3>

            <div class="privacy-item">
              <div class="privacy-text">
                <div class="privacy-label">隐藏我的关注列表</div>
                <div class="privacy-description">不向其他用户显示你关注的频道</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="privacySettings.hideFollowing">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-text">
                <div class="privacy-label">隐藏我的粉丝列表</div>
                <div class="privacy-description">不向其他用户显示关注你的用户</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="privacySettings.hideFollowers">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="privacy-group">
            <h3 class="privacy-title">数据使用</h3>

            <div class="privacy-item">
              <div class="privacy-text">
                <div class="privacy-label">个性化推荐</div>
                <div class="privacy-description">基于你的观看历史提供个性化内容推荐</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="privacySettings.personalization">
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-text">
                <div class="privacy-label">使用统计分析</div>
                <div class="privacy-description">允许收集使用数据以改进平台体验</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="privacySettings.analytics">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetPrivacy">取消</button>
            <button type="submit" class="btn-primary">保存设置</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';

  // 设置部分列表
  const sections = [
    { id: 'profile', name: '个人资料', icon: '👤' },
    { id: 'account', name: '帐号设置', icon: '🔐' },
    { id: 'notifications', name: '通知设置', icon: '🔔' },
    { id: 'privacy', name: '隐私设置', icon: '🔒' }
  ];

  // 当前活动部分
  const activeSection = ref('profile');

  // 个人资料设置
  const profileSettings = reactive({
    avatar: 'https://i.pravatar.cc/150?u=user1',
    coverImage: 'https://picsum.photos/1200/300?random=1',
    nickname: '示例用户',
    username: 'example_user',
    bio: '这是个人简介，可以介绍一下你自己或者分享你感兴趣的内容。',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'Twitter', url: 'https://twitter.com' }
    ]
  });

  // 账号设置
  const accountSettings = reactive({
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 通知设置
  const notificationSettings = reactive({
    likes: true,
    comments: true,
    replies: true,
    follows: true,
    videoProcessing: true,
    updates: false,
    emailNotifications: true,
    browserNotifications: false
  });

  // 隐私设置
  const privacySettings = reactive({
    defaultVideoPrivacy: 'public',
    hideWatchHistory: false,
    hideLikedVideos: false,
    hideFollowing: false,
    hideFollowers: false,
    personalization: true,
    analytics: true
  });

  // 添加社交链接
  function addLink() {
    if (profileSettings.socialLinks.length < 5) {
      profileSettings.socialLinks.push({ platform: 'GitHub', url: '' });
    }
  }

  // 删除社交链接
  function removeLink(index: number) {
    profileSettings.socialLinks.splice(index, 1);
  }

  // 保存个人资料设置
  function saveProfileSettings() {
    // 模拟保存操作
    console.log('保存个人资料设置:', profileSettings);
    alert('个人资料已更新');
  }

  // 重置个人资料设置
  function resetProfile() {
    // 模拟从服务器获取原始数据
    // 这里仅用于示例
    profileSettings.nickname = '示例用户';
    profileSettings.bio = '这是个人简介，可以介绍一下你自己或者分享你感兴趣的内容。';
    profileSettings.socialLinks = [
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'Twitter', url: 'https://twitter.com' }
    ];
  }

  // 保存账号设置
  function saveAccountSettings() {
    // 验证密码
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    // 模拟保存操作
    console.log('保存账号设置:', accountSettings);
    alert('密码已更新');

    // 清空密码字段
    accountSettings.currentPassword = '';
    accountSettings.newPassword = '';
    accountSettings.confirmPassword = '';
  }

  // 重置账号设置
  function resetAccount() {
    accountSettings.currentPassword = '';
    accountSettings.newPassword = '';
    accountSettings.confirmPassword = '';
  }

  // 保存通知设置
  function saveNotificationSettings() {
    // 模拟保存操作
    console.log('保存通知设置:', notificationSettings);
    alert('通知设置已更新');
  }

  // 重置通知设置
  function resetNotifications() {
    // 模拟从服务器获取原始数据
    Object.assign(notificationSettings, {
      likes: true,
      comments: true,
      replies: true,
      follows: true,
      videoProcessing: true,
      updates: false,
      emailNotifications: true,
      browserNotifications: false
    });
  }

  // 保存隐私设置
  function savePrivacySettings() {
    // 模拟保存操作
    console.log('保存隐私设置:', privacySettings);
    alert('隐私设置已更新');
  }

  // 重置隐私设置
  function resetPrivacy() {
    // 模拟从服务器获取原始数据
    Object.assign(privacySettings, {
      defaultVideoPrivacy: 'public',
      hideWatchHistory: false,
      hideLikedVideos: false,
      hideFollowing: false,
      hideFollowers: false,
      personalization: true,
      analytics: true
    });
  }

  // 初始化
  onMounted(() => {
    // 模拟从服务器获取设置数据
    // 这里使用的是默认值
  });
</script>

<style scoped>
  .settings-container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
    gap: 24px;
  }

  .settings-sidebar {
    width: 250px;
    flex-shrink: 0;
  }

  .sidebar-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px;
    color: var(--color-text-primary);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--color-text-secondary);
  }

  .nav-item:hover {
    background-color: var(--color-bg-subtle);
  }

  .nav-item.active {
    background-color: var(--color-bg-subtle);
    color: var(--color-accent-primary);
    font-weight: 500;
  }

  .nav-icon {
    margin-right: 12px;
    font-size: 18px;
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
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
    color: var(--color-text-primary);
  }

  .section-description {
    font-size: 14px;
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

  .form-input:disabled {
    background-color: var(--color-bg-subtle);
    cursor: not-allowed;
  }

  .form-hint {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }

  .char-count {
    font-size: 12px;
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
    font-size: 14px;
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
    font-size: 14px;
  }

  .btn-add-link {
    padding: 8px 16px;
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
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
    font-size: 14px;
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
    font-size: 16px;
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
    font-size: 13px;
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

    .sidebar-nav {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
    }

    .nav-item {
      flex: 1;
      min-width: calc(50% - 8px);
      justify-content: center;
      padding: 8px;
    }

    .nav-icon {
      margin-right: 8px;
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
</style>