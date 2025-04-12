import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

/**
 * 权限检查hook
 * 提供方便的方法来检查用户角色和权限
 */
export function usePermission() {
  const authStore = useAuthStore();

  // 获取当前用户角色
  const userRole = computed(() => authStore.userRole);

  // 是否管理员
  const isAdmin = computed(() => userRole.value === 'ADMIN');

  // 是否创作者
  const isCreator = computed(() => userRole.value === 'CREATOR' || isAdmin.value);

  // 是否普通用户
  const isUser = computed(() => userRole.value === 'USER' || isCreator.value || isAdmin.value);

  // 是否游客(未登录)
  const isGuest = computed(() => !authStore.isAuthenticated);

  /**
   * 检查是否拥有指定角色
   * @param roles 角色或角色数组
   * @returns 是否拥有权限
   */
  function hasRole(roles: string | string[]): boolean {
    if (!userRole.value) return false;

    if (typeof roles === 'string') {
      return userRole.value === roles;
    }

    return roles.includes(userRole.value);
  }

  /**
   * 检查是否至少拥有指定角色之一
   * @param roles 角色数组
   * @returns 是否拥有至少一个角色
   */
  function hasAnyRole(roles: string[]): boolean {
    return hasRole(roles);
  }

  /**
   * 检查是否拥有所有指定角色
   * 注意：在当前实现中，用户只能有一个角色，所以这个方法在有多个角色时始终返回false
   * @param roles 角色数组
   * @returns 是否拥有所有角色
   */
  function hasAllRoles(roles: string[]): boolean {
    if (!userRole.value || roles.length === 0) return false;
    if (roles.length === 1) return userRole.value === roles[0];

    // 当前用户模型下，用户只能有一个角色，所以多个角色时始终返回false
    return false;
  }

  return {
    userRole,
    isAdmin,
    isCreator,
    isUser,
    isGuest,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}
