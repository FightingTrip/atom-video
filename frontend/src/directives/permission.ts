import { ObjectDirective } from 'vue';
import { useAuthStore } from '@/stores/auth';

/**
 * 权限指令：v-permission
 * 用法：
 * v-permission="'ADMIN'" - 只有管理员角色可见
 * v-permission="['ADMIN', 'CREATOR']" - 管理员和创作者可见
 * v-permission.not="'USER'" - 非普通用户可见
 */
export const vPermission: ObjectDirective<HTMLElement, string | string[]> = {
  beforeMount(el, binding) {
    const authStore = useAuthStore();
    const { value, modifiers } = binding;

    // 获取当前用户角色
    const userRole = authStore.userRole;

    // 无权限直接隐藏元素
    if (!userRole) {
      el.style.display = 'none';
      return;
    }

    // 处理取反修饰符
    const hasNot = Object.keys(modifiers).includes('not');

    // 权限判断
    let hasPermission = false;

    if (typeof value === 'string') {
      hasPermission = userRole === value;
    } else if (Array.isArray(value)) {
      hasPermission = value.includes(userRole);
    }

    // 取反逻辑
    if (hasNot) {
      hasPermission = !hasPermission;
    }

    // 无权限则隐藏元素
    if (!hasPermission) {
      el.style.display = 'none';
    }
  },
};

/**
 * 按钮权限指令：v-permission-btn
 * 用法同v-permission，但会禁用按钮而不是隐藏
 */
export const vPermissionBtn: ObjectDirective<HTMLElement, string | string[]> = {
  beforeMount(el, binding) {
    const authStore = useAuthStore();
    const { value, modifiers } = binding;

    // 获取当前用户角色
    const userRole = authStore.userRole;

    // 无权限直接禁用元素
    if (!userRole) {
      el.setAttribute('disabled', 'disabled');
      el.classList.add('disabled-btn');
      return;
    }

    // 处理取反修饰符
    const hasNot = Object.keys(modifiers).includes('not');

    // 权限判断
    let hasPermission = false;

    if (typeof value === 'string') {
      hasPermission = userRole === value;
    } else if (Array.isArray(value)) {
      hasPermission = value.includes(userRole);
    }

    // 取反逻辑
    if (hasNot) {
      hasPermission = !hasPermission;
    }

    // 无权限则禁用元素
    if (!hasPermission) {
      el.setAttribute('disabled', 'disabled');
      el.classList.add('disabled-btn');
    }
  },
};

export default {
  vPermission,
  vPermissionBtn,
};
