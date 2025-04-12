<template>
  <n-button
    v-if="showButton"
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="isDisabled"
    :color="color"
    :circle="circle"
    @click="handleClick"
  >
    <n-icon v-if="icon" :size="iconSize" class="mr-1">
      <component :is="resolveIcon" />
    </n-icon>
    <slot></slot>
  </n-button>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { usePermission } from '@/composables/usePermission';
import { NButton, NIcon } from 'naive-ui';
import { resolveIconComponent } from '@/utils/icon';

const props = defineProps({
  /**
   * 允许访问的角色，可以是单个角色或角色数组
   */
  roles: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => []
  },
  
  /**
   * 按钮类型
   */
  type: {
    type: String as PropType<'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'>,
    default: 'default'
  },
  
  /**
   * 按钮尺寸
   */
  size: {
    type: String as PropType<'tiny' | 'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  
  /**
   * 是否加载中
   */
  loading: {
    type: Boolean,
    default: false
  },
  
  /**
   * 按钮颜色
   */
  color: {
    type: String,
    default: ''
  },
  
  /**
   * 是否为圆形按钮
   */
  circle: {
    type: Boolean,
    default: false
  },
  
  /**
   * 按钮图标
   */
  icon: {
    type: String,
    default: ''
  },
  
  /**
   * 图标大小
   */
  iconSize: {
    type: Number,
    default: 18
  },
  
  /**
   * 无权限时的行为
   * - 'hide': 隐藏按钮（默认）
   * - 'disable': 禁用按钮
   */
  noPermissionAction: {
    type: String as PropType<'hide' | 'disable'>,
    default: 'hide',
    validator: (value: string) => ['hide', 'disable'].includes(value)
  }
});

const emit = defineEmits(['click']);

const { hasRole } = usePermission();

// 是否有权限
const hasPermission = computed(() => {
  // 如果没有指定角色要求，则认为有权限
  if (!props.roles || (Array.isArray(props.roles) && props.roles.length === 0)) {
    return true;
  }
  
  // 检查权限
  if (typeof props.roles === 'string') {
    return hasRole(props.roles);
  } else {
    return props.roles.some(role => hasRole(role));
  }
});

// 是否显示按钮
const showButton = computed(() => {
  if (props.noPermissionAction === 'disable') {
    return true;
  }
  return hasPermission.value;
});

// 是否禁用按钮
const isDisabled = computed(() => {
  if (props.disabled || props.loading) {
    return true;
  }
  if (props.noPermissionAction === 'disable' && !hasPermission.value) {
    return true;
  }
  return false;
});

// 解析图标组件
const resolveIcon = computed(() => {
  if (!props.icon) return null;
  return resolveIconComponent(props.icon);
});

// 处理点击事件
function handleClick(event: MouseEvent) {
  if (isDisabled.value) return;
  emit('click', event);
}
</script>

<style scoped>
.mr-1 {
  margin-right: 4px;
}
</style> 