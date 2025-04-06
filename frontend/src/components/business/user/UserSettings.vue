/**
* @file UserSettings.vue
* @description 用户设置业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="user-settings">
    <h1 class="page-title">账号设置</h1>

    <!-- 基本信息设置 -->
    <section class="settings-section">
      <h2 class="section-title">基本信息</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <Input id="username" v-model="form.username" :error="errors.username" placeholder="请输入用户名" />
      </div>
      <div class="form-group">
        <label for="bio">个人简介</label>
        <Textarea id="bio" v-model="form.bio" :error="errors.bio" placeholder="请输入个人简介" :maxlength="200" />
      </div>
      <div class="form-group">
        <label for="avatar">头像</label>
        <div class="avatar-upload">
          <Avatar :src="form.avatarUrl" :size="100" />
          <Button @click="handleAvatarUpload">
            更换头像
          </Button>
        </div>
      </div>
    </section>

    <!-- 安全设置 -->
    <section class="settings-section">
      <h2 class="section-title">安全设置</h2>
      <div class="form-group">
        <label for="currentPassword">当前密码</label>
        <Input id="currentPassword" v-model="form.currentPassword" type="password" :error="errors.currentPassword"
          placeholder="请输入当前密码" />
      </div>
      <div class="form-group">
        <label for="newPassword">新密码</label>
        <Input id="newPassword" v-model="form.newPassword" type="password" :error="errors.newPassword"
          placeholder="请输入新密码" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <Input id="confirmPassword" v-model="form.confirmPassword" type="password" :error="errors.confirmPassword"
          placeholder="请再次输入新密码" />
      </div>
    </section>

    <!-- 通知设置 -->
    <section class="settings-section">
      <h2 class="section-title">通知设置</h2>
      <div class="form-group">
        <label class="checkbox-label">
          <Checkbox v-model="form.notifications.email" />
          接收邮件通知
        </label>
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <Checkbox v-model="form.notifications.push" />
          接收推送通知
        </label>
      </div>
    </section>

    <!-- 操作按钮 -->
    <div class="actions">
      <Button :loading="loading" @click="handleSave">
        保存设置
      </Button>
      <Button type="danger" @click="handleDeleteAccount">
        删除账号
      </Button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUser } from '@/composables/useUser';
  import Avatar from '@/components/common/avatar/Avatar.vue';
  import Button from '@/components/common/button/Button.vue';
  import Input from '@/components/common/input/Input.vue';
  import Textarea from '@/components/common/textarea/Textarea.vue';
  import Checkbox from '@/components/common/checkbox/Checkbox.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
  import type { User } from '@/types';

  const router = useRouter();

  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const form = ref({
    username: '',
    bio: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
    },
  });
  const errors = ref({
    username: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 组合式函数
  const { fetchUserProfile, updateUserProfile, updatePassword, deleteAccount } = useUser();

  // 方法
  const handleAvatarUpload = () => {
    // TODO: 实现头像上传功能
  };

  const validateForm = () => {
    let isValid = true;
    errors.value = {
      username: '',
      bio: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // 用户名验证
    if (!form.value.username) {
      errors.value.username = '请输入用户名';
      isValid = false;
    }

    // 个人简介验证
    if (form.value.bio.length > 200) {
      errors.value.bio = '个人简介不能超过200个字符';
      isValid = false;
    }

    // 密码验证
    if (form.value.newPassword) {
      if (!form.value.currentPassword) {
        errors.value.currentPassword = '请输入当前密码';
        isValid = false;
      }

      if (form.value.newPassword.length < 8) {
        errors.value.newPassword = '新密码不能少于8个字符';
        isValid = false;
      }

      if (form.value.newPassword !== form.value.confirmPassword) {
        errors.value.confirmPassword = '两次输入的密码不一致';
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      loading.value = true;
      error.value = null;

      // 更新用户信息
      await updateUserProfile({
        username: form.value.username,
        bio: form.value.bio,
        avatarUrl: form.value.avatarUrl,
      });

      // 更新密码
      if (form.value.newPassword) {
        await updatePassword({
          currentPassword: form.value.currentPassword,
          newPassword: form.value.newPassword,
        });
      }

      // 更新通知设置
      await updateUserProfile({
        notifications: form.value.notifications,
      });

      router.push('/profile');
    } catch (err) {
      error.value = '保存设置失败';
      console.error('保存设置失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('确定要删除账号吗？此操作不可恢复。')) return;

    try {
      loading.value = true;
      error.value = null;

      await deleteAccount();
      router.push('/login');
    } catch (err) {
      error.value = '删除账号失败';
      console.error('删除账号失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 初始化
  onMounted(async () => {
    try {
      loading.value = true;
      error.value = null;

      const user = await fetchUserProfile();
      form.value = {
        username: user.username,
        bio: user.bio || '',
        avatarUrl: user.avatarUrl,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        notifications: user.notifications || {
          email: true,
          push: true,
        },
      };
    } catch (err) {
      error.value = '加载用户信息失败';
      console.error('加载用户信息失败:', err);
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .user-settings {
    max-width: var(--container-md);
    margin: 0 auto;
    padding: var(--spacing-lg);
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }

  .page-title {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
  }

  .settings-section {
    background: var(--secondary-bg);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    border: 1px solid var(--border-light);
  }

  .section-title {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  .avatar-upload {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background-color: var(--primary-bg);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  .actions {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
    background-color: var(--secondary-bg);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .error-container {
    margin-top: var(--spacing-md);
    background-color: var(--error-bg);
    color: var(--error-text);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--error-border);
  }

  @media (max-width: 768px) {
    .user-settings {
      padding: var(--spacing-md);
    }

    .page-title {
      font-size: var(--text-xl);
    }

    .settings-section {
      padding: var(--spacing-md);
    }
  }
</style>