/**
 * @file useUserSettings.ts
 * @description 用户设置相关的Composable
 */

import { ref, reactive, computed, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useToast } from './useToast';
import type { UserPreferences, UserNotificationSettings, UserPrivacySettings } from '@/types';

export function useUserSettings() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const toast = useToast();

  // 加载状态
  const isLoading = ref(false);
  const saveLoading = ref(false);

  // 个人资料设置
  const profileSettings = reactive({
    avatar: '',
    coverImage: '',
    nickname: '',
    username: '',
    bio: '',
    socialLinks: [] as { platform: string; url: string }[],
  });

  // 账号设置
  const accountSettings = reactive({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 通知设置
  const notificationSettings = reactive({
    likes: true,
    comments: true,
    replies: true,
    follows: true,
    videoProcessing: true,
    updates: false,
    emailNotification: true,
    browserNotification: false,
  });

  // 隐私设置
  const privacySettings = reactive({
    showWatchHistory: false,
    showFavorites: true,
    showFollowing: true,
    showLikes: false,
    commentPermission: 'everyone' as 'everyone' | 'followers' | 'following' | 'none',
  });

  // 外观设置
  const appearanceSettings = reactive({
    theme: 'system' as 'system' | 'light' | 'dark',
    fontSize: 16,
  });

  // 计算属性 - 密码强度
  const passwordStrength = computed(() => {
    if (!accountSettings.newPassword) return 0;
    let strength = 0;

    // 长度检查
    if (accountSettings.newPassword.length >= 6) strength += 20;
    if (accountSettings.newPassword.length >= 10) strength += 10;

    // 复杂度检查
    if (/[A-Z]/.test(accountSettings.newPassword)) strength += 20;
    if (/[a-z]/.test(accountSettings.newPassword)) strength += 20;
    if (/[0-9]/.test(accountSettings.newPassword)) strength += 20;
    if (/[^A-Za-z0-9]/.test(accountSettings.newPassword)) strength += 20;

    return Math.min(strength, 100);
  });

  // 密码强度文本
  const passwordStrengthText = computed(() => {
    if (passwordStrength.value === 0) return '未设置';
    if (passwordStrength.value < 40) return '弱';
    if (passwordStrength.value < 70) return '中';
    return '强';
  });

  // 密码强度颜色
  const passwordStrengthColor = computed(() => {
    if (passwordStrength.value === 0) return '#ccc';
    if (passwordStrength.value < 40) return '#f56c6c';
    if (passwordStrength.value < 70) return '#e6a23c';
    return '#67c23a';
  });

  // 密码校验
  const passwordsMatch = computed(() => {
    if (!accountSettings.newPassword || !accountSettings.confirmPassword) return true;
    return accountSettings.newPassword === accountSettings.confirmPassword;
  });

  // 加载用户设置
  const loadUserSettings = async () => {
    isLoading.value = true;
    try {
      const userData = userStore.currentUser;
      if (!userData) {
        throw new Error('用户未登录');
      }

      // 加载个人资料设置
      profileSettings.avatar = userData.avatar || 'https://i.pravatar.cc/150?u=user1';
      profileSettings.coverImage = userData.coverImage || 'https://picsum.photos/1200/300?random=1';
      profileSettings.nickname = userData.nickname || '';
      profileSettings.username = userData.username || '';
      profileSettings.bio = userData.bio || '';

      // 加载社交链接
      profileSettings.socialLinks = [];
      if (userData.social) {
        if (userData.social.website) {
          profileSettings.socialLinks.push({ platform: 'Personal', url: userData.social.website });
        }
        if (userData.social.github) {
          profileSettings.socialLinks.push({ platform: 'GitHub', url: userData.social.github });
        }
        if (userData.social.twitter) {
          profileSettings.socialLinks.push({ platform: 'Twitter', url: userData.social.twitter });
        }
      }

      // 账号设置
      accountSettings.email = userData.email || '';

      // 加载通知、隐私和外观设置
      loadSettingsFromLocalStorage();

      toast.showSuccess('设置加载成功');
    } catch (error) {
      console.error('加载用户设置失败:', error);
      toast.showError('加载用户设置失败');
    } finally {
      isLoading.value = false;
    }
  };

  // 从localStorage加载设置
  const loadSettingsFromLocalStorage = () => {
    try {
      // 通知设置
      const savedNotifications = localStorage.getItem('notificationSettings');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        Object.assign(notificationSettings, parsed);
      }

      // 隐私设置
      const savedPrivacy = localStorage.getItem('privacySettings');
      if (savedPrivacy) {
        const parsed = JSON.parse(savedPrivacy);
        Object.assign(privacySettings, parsed);
      }

      // 外观设置
      const savedAppearance = localStorage.getItem('appearanceSettings');
      if (savedAppearance) {
        const parsed = JSON.parse(savedAppearance);
        Object.assign(appearanceSettings, parsed);
      }
    } catch (error) {
      console.error('从本地存储加载设置失败:', error);
    }
  };

  // 保存个人资料设置
  const saveProfileSettings = async () => {
    saveLoading.value = true;
    try {
      // 构建社交链接对象
      const social: Record<string, string> = {};
      profileSettings.socialLinks.forEach(link => {
        if (link.platform === 'Personal') {
          social.website = link.url;
        } else if (link.platform === 'GitHub') {
          social.github = link.url;
        } else if (link.platform === 'Twitter') {
          social.twitter = link.url;
        }
      });

      // 确保当前用户存在
      if (!userStore.currentUser) {
        throw new Error('用户未登录');
      }

      // 更新用户数据
      const updatedUserData = {
        ...userStore.currentUser,
        nickname: profileSettings.nickname,
        bio: profileSettings.bio,
        avatar: profileSettings.avatar,
        coverImage: profileSettings.coverImage,
        social,
      };

      // 保存到store
      userStore.setUser(updatedUserData as User);
      toast.showSuccess('个人资料已更新');
    } catch (error) {
      console.error('保存个人资料失败:', error);
      toast.showError('保存个人资料失败');
    } finally {
      saveLoading.value = false;
    }
  };

  // 保存账号设置
  const saveAccountSettings = async () => {
    if (!passwordsMatch.value) {
      toast.showError('两次输入的密码不一致');
      return;
    }

    saveLoading.value = true;
    try {
      // 在实际应用中，这里应该调用API
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新邮箱
      if (userStore.currentUser) {
        const updatedUserData = {
          ...userStore.currentUser,
          email: accountSettings.email,
        };
        userStore.setUser(updatedUserData);
      }

      toast.showSuccess('账号设置已更新');

      // 清空密码字段
      accountSettings.currentPassword = '';
      accountSettings.newPassword = '';
      accountSettings.confirmPassword = '';
    } catch (error) {
      console.error('保存账号设置失败:', error);
      toast.showError('保存账号设置失败');
    } finally {
      saveLoading.value = false;
    }
  };

  // 保存通知设置
  const saveNotificationSettings = async () => {
    saveLoading.value = true;
    try {
      // 保存到localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      toast.showSuccess('通知设置已更新');
    } catch (error) {
      console.error('保存通知设置失败:', error);
      toast.showError('保存通知设置失败');
    } finally {
      saveLoading.value = false;
    }
  };

  // 保存隐私设置
  const savePrivacySettings = async () => {
    saveLoading.value = true;
    try {
      // 保存到localStorage
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      toast.showSuccess('隐私设置已更新');
    } catch (error) {
      console.error('保存隐私设置失败:', error);
      toast.showError('保存隐私设置失败');
    } finally {
      saveLoading.value = false;
    }
  };

  // 保存外观设置
  const saveAppearanceSettings = async () => {
    saveLoading.value = true;
    try {
      // 保存到localStorage
      localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));

      // 应用主题设置
      document.documentElement.setAttribute('data-theme', appearanceSettings.theme);

      // 应用字体大小
      document.documentElement.style.setProperty(
        '--base-font-size',
        `${appearanceSettings.fontSize}px`
      );

      toast.showSuccess('外观设置已更新');
    } catch (error) {
      console.error('保存外观设置失败:', error);
      toast.showError('保存外观设置失败');
    } finally {
      saveLoading.value = false;
    }
  };

  // 添加社交链接
  const addSocialLink = () => {
    if (profileSettings.socialLinks.length < 5) {
      profileSettings.socialLinks.push({ platform: 'GitHub', url: '' });
    }
  };

  // 删除社交链接
  const removeSocialLink = (index: number) => {
    profileSettings.socialLinks.splice(index, 1);
  };

  // 重置个人资料设置
  const resetProfileSettings = () => {
    loadUserSettings();
  };

  // 重置账号设置
  const resetAccountSettings = () => {
    if (userStore.currentUser) {
      accountSettings.email = userStore.currentUser.email || '';
    }
    accountSettings.currentPassword = '';
    accountSettings.newPassword = '';
    accountSettings.confirmPassword = '';
  };

  // 重置通知设置
  const resetNotificationSettings = () => {
    loadSettingsFromLocalStorage();
  };

  // 重置隐私设置
  const resetPrivacySettings = () => {
    loadSettingsFromLocalStorage();
  };

  // 重置外观设置
  const resetAppearanceSettings = () => {
    loadSettingsFromLocalStorage();
  };

  // 初始自动加载
  loadUserSettings();

  return {
    // 状态
    isLoading,
    saveLoading,
    profileSettings,
    accountSettings,
    notificationSettings,
    privacySettings,
    appearanceSettings,

    // 计算属性
    passwordStrength,
    passwordStrengthText,
    passwordStrengthColor,
    passwordsMatch,

    // 方法
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
    resetAppearanceSettings,
  };
}
