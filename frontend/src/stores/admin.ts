/**
 * @file admin.ts
 * @description 管理后台状态管理
 */

import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import adminService, {
  DashboardStats,
  Activity,
  AdminVideo,
  AdminUser,
  AdminComment,
  AdminReport,
  PaginatedResult,
} from '@/services/admin/adminService';
import { useToast } from '@/composables/useToast';

// 管理后台状态
export const useAdminStore = defineStore('admin', () => {
  // 通用状态
  const isLoading = ref(false);
  const loadingText = ref('');
  const currentPage = ref('dashboard');
  const error = ref<string | null>(null);

  // 仪表盘状态
  const dashboardStats = reactive<DashboardStats>({
    totalUsers: 0,
    newUsersToday: 0,
    totalVideos: 0,
    newVideosToday: 0,
    totalViews: 0,
    viewsToday: 0,
    pendingVideos: 0,
    pendingReports: 0,
    totalRevenue: 0,
    revenueToday: 0,
    userGrowthRate: 0,
    contentGrowthRate: 0,
    viewsGrowthRate: 0,
    revenueGrowthRate: 0,
  });
  const recentActivities = ref<Activity[]>([]);

  // 视频管理状态
  const videos = ref<AdminVideo[]>([]);
  const videosTotalCount = ref(0);
  const videosCurrentPage = ref(1);
  const videosPageSize = ref(10);
  const videosTotalPages = ref(1);
  const selectedVideo = ref<AdminVideo | null>(null);
  const videoFilterStatus = ref<string | null>(null);
  const videoFilterCategory = ref<string | null>(null);
  const videoSearchQuery = ref('');
  const videoSortBy = ref('createdAt');
  const videoSortOrder = ref<'asc' | 'desc'>('desc');

  // 用户管理状态
  const users = ref<AdminUser[]>([]);
  const usersTotalCount = ref(0);
  const usersCurrentPage = ref(1);
  const usersPageSize = ref(10);
  const usersTotalPages = ref(1);
  const selectedUser = ref<AdminUser | null>(null);
  const userFilterRole = ref<string | null>(null);
  const userFilterStatus = ref<string | null>(null);
  const userSearchQuery = ref('');

  // 评论管理状态
  const comments = ref<AdminComment[]>([]);
  const commentsTotalCount = ref(0);
  const commentsCurrentPage = ref(1);
  const commentsPageSize = ref(10);
  const commentsTotalPages = ref(1);
  const commentFilterStatus = ref<string | null>(null);
  const commentFilterVideoId = ref<string | null>(null);
  const commentFilterUserId = ref<string | null>(null);
  const commentSearchQuery = ref('');

  // 举报管理状态
  const reports = ref<AdminReport[]>([]);
  const reportsTotalCount = ref(0);
  const reportsCurrentPage = ref(1);
  const reportsPageSize = ref(10);
  const reportsTotalPages = ref(1);
  const reportFilterStatus = ref<string | null>(null);
  const reportFilterType = ref<string | null>(null);
  const reportFilterSeverity = ref<string | null>(null);

  /**
   * 加载仪表盘统计数据
   */
  async function fetchDashboardStats() {
    try {
      isLoading.value = true;
      loadingText.value = '加载仪表盘数据...';

      const stats = await adminService.getDashboardStats();

      // 更新状态
      Object.assign(dashboardStats, stats);
    } catch (err) {
      error.value = '加载仪表盘数据失败';
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 加载最近活动
   */
  async function fetchRecentActivities() {
    try {
      isLoading.value = true;
      loadingText.value = '加载最近活动...';

      const activities = await adminService.getRecentActivities();

      // 更新状态
      recentActivities.value = activities;
    } catch (err) {
      error.value = '加载最近活动失败';
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 初始化仪表盘
   */
  async function initDashboard() {
    const toast = useToast();
    error.value = null;

    try {
      await Promise.all([fetchDashboardStats(), fetchRecentActivities()]);
    } catch (err) {
      error.value = '初始化仪表盘失败';
      toast.error(error.value);
      console.error(error.value, err);
    }
  }

  /**
   * 加载视频列表
   */
  async function fetchVideos(page: number = videosCurrentPage.value) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '加载视频列表...';

      const params = {
        page,
        pageSize: videosPageSize.value,
        status: videoFilterStatus.value || undefined,
        category: videoFilterCategory.value || undefined,
        query: videoSearchQuery.value || undefined,
        sortBy: videoSortBy.value,
        sortOrder: videoSortOrder.value,
      };

      const result = await adminService.getVideos(params);

      // 更新状态
      videos.value = result.data;
      videosTotalCount.value = result.total;
      videosCurrentPage.value = result.page;
      videosTotalPages.value = result.totalPages;
    } catch (err) {
      error.value = '加载视频列表失败';
      toast.error(error.value);
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 加载视频详情
   */
  async function fetchVideoDetail(id: string) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '加载视频详情...';

      const video = await adminService.getVideoById(id);

      // 更新状态
      selectedVideo.value = video;
    } catch (err) {
      error.value = '加载视频详情失败';
      toast.error(error.value);
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 更新视频
   */
  async function updateVideo(id: string, data: Partial<AdminVideo>) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '更新视频...';

      const result = await adminService.updateVideo(id, data);

      if (result.success) {
        toast.success(result.message || '视频更新成功');

        // 刷新视频列表
        await fetchVideos();

        // 如果当前有选中的视频，也刷新它
        if (selectedVideo.value && selectedVideo.value.id === id) {
          await fetchVideoDetail(id);
        }

        return true;
      } else {
        throw new Error(result.message || '未知错误');
      }
    } catch (err: any) {
      error.value = '更新视频失败';
      toast.error(error.value + (err.message ? `: ${err.message}` : ''));
      console.error(error.value, err);
      return false;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 删除视频
   */
  async function deleteVideo(id: string) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '删除视频...';

      const result = await adminService.deleteVideo(id);

      if (result.success) {
        toast.success(result.message || '视频删除成功');

        // 清除选中状态（如果被删除的是当前选中的视频）
        if (selectedVideo.value && selectedVideo.value.id === id) {
          selectedVideo.value = null;
        }

        // 刷新视频列表
        await fetchVideos();

        return true;
      } else {
        throw new Error(result.message || '未知错误');
      }
    } catch (err: any) {
      error.value = '删除视频失败';
      toast.error(error.value + (err.message ? `: ${err.message}` : ''));
      console.error(error.value, err);
      return false;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 加载用户列表
   */
  async function fetchUsers(page: number = usersCurrentPage.value) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '加载用户列表...';

      const params = {
        page,
        pageSize: usersPageSize.value,
        role: userFilterRole.value || undefined,
        status: userFilterStatus.value || undefined,
        query: userSearchQuery.value || undefined,
      };

      const result = await adminService.getUsers(params);

      // 更新状态
      users.value = result.data;
      usersTotalCount.value = result.total;
      usersCurrentPage.value = result.page;
      usersTotalPages.value = result.totalPages;
    } catch (err) {
      error.value = '加载用户列表失败';
      toast.error(error.value);
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 加载用户详情
   */
  async function fetchUserDetail(id: string) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '加载用户详情...';

      const user = await adminService.getUserById(id);

      // 更新状态
      selectedUser.value = user;
    } catch (err) {
      error.value = '加载用户详情失败';
      toast.error(error.value);
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 更新用户
   */
  async function updateUser(id: string, data: Partial<AdminUser>) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '更新用户...';

      const result = await adminService.updateUser(id, data);

      if (result.success) {
        toast.success(result.message || '用户更新成功');

        // 刷新用户列表
        await fetchUsers();

        // 如果当前有选中的用户，也刷新它
        if (selectedUser.value && selectedUser.value.id === id) {
          await fetchUserDetail(id);
        }

        return true;
      } else {
        throw new Error(result.message || '未知错误');
      }
    } catch (err: any) {
      error.value = '更新用户失败';
      toast.error(error.value + (err.message ? `: ${err.message}` : ''));
      console.error(error.value, err);
      return false;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 删除用户
   */
  async function deleteUser(id: string) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '删除用户...';

      const result = await adminService.deleteUser(id);

      if (result.success) {
        toast.success(result.message || '用户删除成功');

        // 清除选中状态（如果被删除的是当前选中的用户）
        if (selectedUser.value && selectedUser.value.id === id) {
          selectedUser.value = null;
        }

        // 刷新用户列表
        await fetchUsers();

        return true;
      } else {
        throw new Error(result.message || '未知错误');
      }
    } catch (err: any) {
      error.value = '删除用户失败';
      toast.error(error.value + (err.message ? `: ${err.message}` : ''));
      console.error(error.value, err);
      return false;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 加载评论列表
   */
  async function fetchComments(page: number = commentsCurrentPage.value) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '加载评论列表...';

      const params = {
        page,
        pageSize: commentsPageSize.value,
        status: commentFilterStatus.value || undefined,
        videoId: commentFilterVideoId.value || undefined,
        userId: commentFilterUserId.value || undefined,
        query: commentSearchQuery.value || undefined,
      };

      const result = await adminService.getComments(params);

      // 更新状态
      comments.value = result.data;
      commentsTotalCount.value = result.total;
      commentsCurrentPage.value = result.page;
      commentsTotalPages.value = result.totalPages;
    } catch (err) {
      error.value = '加载评论列表失败';
      toast.error(error.value);
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 加载举报列表
   */
  async function fetchReports(page: number = reportsCurrentPage.value) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '加载举报列表...';

      const params = {
        page,
        pageSize: reportsPageSize.value,
        status: reportFilterStatus.value || undefined,
        type: reportFilterType.value || undefined,
        severity: reportFilterSeverity.value || undefined,
      };

      const result = await adminService.getReports(params);

      // 更新状态
      reports.value = result.data;
      reportsTotalCount.value = result.total;
      reportsCurrentPage.value = result.page;
      reportsTotalPages.value = result.totalPages;
    } catch (err) {
      error.value = '加载举报列表失败';
      toast.error(error.value);
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 处理举报
   */
  async function handleReport(id: string, status: 'resolved' | 'ignored', resolution?: string) {
    const toast = useToast();
    error.value = null;

    try {
      isLoading.value = true;
      loadingText.value = '处理举报...';

      const result = await adminService.handleReport(id, { status, resolution });

      if (result.success) {
        toast.success(result.message || '举报处理成功');

        // 刷新举报列表
        await fetchReports();

        return true;
      } else {
        throw new Error(result.message || '未知错误');
      }
    } catch (err: any) {
      error.value = '处理举报失败';
      toast.error(error.value + (err.message ? `: ${err.message}` : ''));
      console.error(error.value, err);
      return false;
    } finally {
      isLoading.value = false;
      loadingText.value = '';
    }
  }

  /**
   * 清除错误
   */
  function clearError() {
    error.value = null;
  }

  /**
   * 待处理任务计数
   */
  const pendingTaskCount = computed(() => {
    return dashboardStats.pendingVideos + dashboardStats.pendingReports;
  });

  return {
    // 通用状态
    isLoading,
    loadingText,
    currentPage,
    error,
    clearError,

    // 仪表盘状态和方法
    dashboardStats,
    recentActivities,
    pendingTaskCount,
    fetchDashboardStats,
    fetchRecentActivities,
    initDashboard,

    // 视频状态和方法
    videos,
    videosTotalCount,
    videosCurrentPage,
    videosPageSize,
    videosTotalPages,
    selectedVideo,
    videoFilterStatus,
    videoFilterCategory,
    videoSearchQuery,
    videoSortBy,
    videoSortOrder,
    fetchVideos,
    fetchVideoDetail,
    updateVideo,
    deleteVideo,

    // 用户状态和方法
    users,
    usersTotalCount,
    usersCurrentPage,
    usersPageSize,
    usersTotalPages,
    selectedUser,
    userFilterRole,
    userFilterStatus,
    userSearchQuery,
    fetchUsers,
    fetchUserDetail,
    updateUser,
    deleteUser,

    // 评论状态和方法
    comments,
    commentsTotalCount,
    commentsCurrentPage,
    commentsPageSize,
    commentsTotalPages,
    commentFilterStatus,
    commentFilterVideoId,
    commentFilterUserId,
    commentSearchQuery,
    fetchComments,

    // 举报状态和方法
    reports,
    reportsTotalCount,
    reportsCurrentPage,
    reportsPageSize,
    reportsTotalPages,
    reportFilterStatus,
    reportFilterType,
    reportFilterSeverity,
    fetchReports,
    handleReport,
  };
});
