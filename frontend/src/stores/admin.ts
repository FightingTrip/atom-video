/**
 * 管理后台状态管理
 *
 * 负责管理后台的全局状态和数据获取
 */

import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';

// 仪表盘统计数据类型
interface DashboardStats {
  userCount: number;
  videoCount: number;
  commentCount: number;
  interactionCount: number;
  newUserCount: number;
  newVideoCount: number;
  activeUserCount: number;
  reportCount: number;
}

// 管理后台状态
export const useAdminStore = defineStore('admin', () => {
  // 仪表盘数据
  const dashboardStats = reactive<DashboardStats>({
    userCount: 0,
    videoCount: 0,
    commentCount: 0,
    interactionCount: 0,
    newUserCount: 0,
    newVideoCount: 0,
    activeUserCount: 0,
    reportCount: 0,
  });

  // 管理员权限
  const permissions = ref<string[]>([]);

  // 加载状态
  const isLoading = ref(false);
  const loadingText = ref('');

  // 通知数量
  const notificationCount = ref(0);

  // 最近活动
  const recentActivities = ref<any[]>([]);

  // 待处理任务数
  const pendingTaskCount = computed(() => {
    // 举报数 + 待审核视频数
    return dashboardStats.reportCount;
  });

  // 获取仪表盘数据
  async function fetchDashboardStats() {
    isLoading.value = true;
    loadingText.value = '加载统计数据...';

    try {
      // TODO: 替换为实际API调用
      // Mock数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新数据
      Object.assign(dashboardStats, {
        userCount: 12846,
        videoCount: 4295,
        commentCount: 31275,
        interactionCount: 84521,
        newUserCount: 128,
        newVideoCount: 47,
        activeUserCount: 2541,
        reportCount: 15,
      });

      return dashboardStats;
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  // 获取管理员权限
  async function fetchAdminPermissions() {
    isLoading.value = true;
    loadingText.value = '加载权限数据...';

    try {
      // TODO: 替换为实际API调用
      // Mock数据
      await new Promise(resolve => setTimeout(resolve, 500));

      permissions.value = [
        'dashboard:view',
        'user:view',
        'user:edit',
        'user:delete',
        'content:view',
        'content:edit',
        'content:delete',
        'report:view',
        'report:handle',
        'setting:view',
        'setting:edit',
        'log:view',
      ];

      return permissions.value;
    } catch (error) {
      console.error('获取管理员权限失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  // 获取最近活动
  async function fetchRecentActivities() {
    isLoading.value = true;
    loadingText.value = '加载最近活动...';

    try {
      // TODO: 替换为实际API调用
      // Mock数据
      await new Promise(resolve => setTimeout(resolve, 800));

      recentActivities.value = [
        {
          id: 1,
          type: 'user_register',
          title: '新用户注册',
          description: '用户 John Doe 完成了注册',
          time: '10分钟前',
          userId: 'user123',
          avatar: 'https://i.pravatar.cc/100?img=1',
        },
        {
          id: 2,
          type: 'video_upload',
          title: '视频上传',
          description: 'Alice 上传了新视频"Vue 3.0 深入解析"',
          time: '30分钟前',
          userId: 'user456',
          videoId: 'video789',
          avatar: 'https://i.pravatar.cc/100?img=2',
        },
        {
          id: 3,
          type: 'report_resolve',
          title: '举报处理',
          description: '管理员处理了一条内容投诉',
          time: '2小时前',
          reportId: 'report123',
          adminId: 'admin789',
          avatar: 'https://i.pravatar.cc/100?img=3',
        },
      ];

      return recentActivities.value;
    } catch (error) {
      console.error('获取最近活动失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  // 获取通知数量
  async function fetchNotificationCount() {
    try {
      // TODO: 替换为实际API调用
      // Mock数据
      await new Promise(resolve => setTimeout(resolve, 300));

      notificationCount.value = 5;

      return notificationCount.value;
    } catch (error) {
      console.error('获取通知数量失败:', error);
      throw error;
    }
  }

  // 初始化管理后台
  async function initAdminDashboard() {
    isLoading.value = true;

    try {
      await Promise.all([
        fetchAdminPermissions(),
        fetchDashboardStats(),
        fetchRecentActivities(),
        fetchNotificationCount(),
      ]);
    } catch (error) {
      console.error('初始化管理后台失败:', error);
    } finally {
      isLoading.value = false;
    }
  }

  // 检查权限
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission);
  }

  // 导出数据
  function exportDashboardData() {
    // TODO: 实现导出功能
    return {
      timestamp: new Date().toISOString(),
      stats: { ...dashboardStats },
      activities: [...recentActivities.value],
    };
  }

  return {
    // 状态
    dashboardStats,
    permissions,
    isLoading,
    loadingText,
    notificationCount,
    recentActivities,
    pendingTaskCount,

    // 获取数据方法
    fetchDashboardStats,
    fetchAdminPermissions,
    fetchRecentActivities,
    fetchNotificationCount,
    initAdminDashboard,

    // 工具方法
    hasPermission,
    exportDashboardData,
  };
});
