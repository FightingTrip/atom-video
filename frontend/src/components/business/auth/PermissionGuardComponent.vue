<template>
  <div v-if="hasAccess">
    <slot></slot>
  </div>
  <div v-else-if="$slots.fallback">
    <slot name="fallback"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { usePermission } from '@/composables/usePermission';

const props = defineProps({
  /**
   * 允许访问的角色，可以是单个角色或角色数组
   * - 'ADMIN': 管理员
   * - 'CREATOR': 创作者
   * - 'USER': 普通用户
   */
  roles: {
    type: [String, Array] as PropType<string | string[]>,
    required: true
  },
  
  /**
   * 访问模式
   * - 'any': 任一角色即可访问（默认）
   * - 'all': 需要所有指定角色才能访问
   */
  mode: {
    type: String as PropType<'any' | 'all'>,
    default: 'any',
    validator: (value: string) => ['any', 'all'].includes(value)
  },
  
  /**
   * 是否取反（排除指定角色）
   */
  exclude: {
    type: Boolean,
    default: false
  }
});

const { hasRole, hasAllRoles } = usePermission();

// 是否有权限访问
const hasAccess = computed(() => {
  // 检查权限的逻辑
  let result;
  
  if (props.mode === 'all') {
    // 需要所有指定角色
    result = typeof props.roles === 'string' 
      ? hasRole(props.roles) 
      : hasAllRoles(props.roles);
  } else {
    // 任一角色即可（默认）
    result = typeof props.roles === 'string' 
      ? hasRole(props.roles) 
      : props.roles.some(role => hasRole(role));
  }
  
  // 如果是排除模式，取反
  return props.exclude ? !result : result;
});
</script>

<style scoped></style> 