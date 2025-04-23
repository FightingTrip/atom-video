/**
* @file ActionButton.vue
* @description 通用动作按钮组件，支持点赞、收藏等操作，带有动画效果
* @author Atom Video Team
*/

<template>
  <n-button v-bind="buttonProps" :class="[
    'action-button',
    `action-type-${type}`,
    { 'is-active': modelValue },
    sizeClass
  ]" @click="handleClick">
    <template #icon>
      <n-icon :size="iconSize">
        <component :is="modelValue ? activeIcon : inactiveIcon" />
      </n-icon>
    </template>
    <span v-if="showCount && count !== undefined" class="count">{{ formatCount(count) }}</span>
    <span v-if="showText" class="text">{{ text }}</span>

    <!-- 点赞动画特效 -->
    <transition-group v-if="showAnimation && type === 'like'" class="animation-container" tag="div"
      name="action-animation">
      <div v-for="particle in activeParticles" :key="particle.id" :style="particle.style" class="animation-particle">
        <n-icon :color="particle.color">
          <component :is="activeIcon" />
        </n-icon>
      </div>
    </transition-group>

    <!-- 收藏动画特效 -->
    <div v-if="showAnimation && type === 'favorite'" class="heart-burst" :class="{ 'active': showBurst }">
      <div class="burst-particle" v-for="n in 6" :key="n" :style="particleStyle(n)"></div>
    </div>
  </n-button>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { NButton, NIcon } from 'naive-ui';
  import {
    ThumbsUp,
    ThumbsUpOutline,
    Heart,
    HeartOutline,
    BookmarkOutline,
    Bookmark,
    ShareSocialOutline,
    ShareSocial,
    DownloadOutline,
    Download
  } from '@vicons/ionicons5';

  const props = defineProps({
    type: {
      type: String as () => 'like' | 'favorite' | 'share' | 'download' | 'subscribe' | 'custom',
      default: 'like'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: undefined
    },
    text: {
      type: String,
      default: ''
    },
    showCount: {
      type: Boolean,
      default: true
    },
    showText: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    },
    showAnimation: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    customActiveIcon: {
      type: Object,
      default: null
    },
    customInactiveIcon: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String as () => 'default' | 'text' | 'quaternary' | 'tertiary',
      default: 'quaternary'
    },
    circle: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:modelValue', 'click']);

  // 根据类型选择图标
  const activeIcon = computed(() => {
    if (props.customActiveIcon) return props.customActiveIcon;

    switch (props.type) {
      case 'like':
        return ThumbsUp;
      case 'favorite':
        return Heart;
      case 'share':
        return ShareSocial;
      case 'download':
        return Download;
      case 'subscribe':
        return Bookmark;
      default:
        return ThumbsUp;
    }
  });

  const inactiveIcon = computed(() => {
    if (props.customInactiveIcon) return props.customInactiveIcon;

    switch (props.type) {
      case 'like':
        return ThumbsUpOutline;
      case 'favorite':
        return HeartOutline;
      case 'share':
        return ShareSocialOutline;
      case 'download':
        return DownloadOutline;
      case 'subscribe':
        return BookmarkOutline;
      default:
        return ThumbsUpOutline;
    }
  });

  // 尺寸相关
  const sizeClass = computed(() => `size-${props.size}`);
  const iconSize = computed(() => {
    switch (props.size) {
      case 'small':
        return 16;
      case 'medium':
        return 18;
      case 'large':
        return 22;
      default:
        return 18;
    }
  });

  // 按钮属性
  const buttonProps = computed(() => ({
    quaternary: props.mode === 'quaternary',
    tertiary: props.mode === 'tertiary',
    text: props.mode === 'text',
    type: props.modelValue ? props.color : 'default',
    disabled: props.disabled,
    circle: props.circle
  }));

  // 点赞动画
  const activeParticles = ref<Array<{
    id: number;
    style: {
      top: string;
      left: string;
      transform: string;
      opacity: string;
    },
    color: string;
  }>>([]);

  // 收藏动画
  const showBurst = ref(false);

  // 处理点击
  function handleClick() {
    if (props.disabled) return;

    emit('update:modelValue', !props.modelValue);
    emit('click');

    // 如果从未激活到激活状态，触发动画
    if (!props.modelValue && props.showAnimation) {
      if (props.type === 'like') {
        createParticleAnimation();
      } else if (props.type === 'favorite') {
        triggerBurstAnimation();
      }
    }
  }

  // 创建点赞粒子动画
  function createParticleAnimation() {
    const colors = ['var(--primary-color)', 'var(--warning-color)', 'var(--success-color)'];

    // 清空现有粒子
    activeParticles.value = [];

    // 创建6-10个动画粒子
    const particleCount = Math.floor(Math.random() * 5) + 6;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2; // 随机角度
      const distance = 20 + Math.random() * 30; // 随机距离
      const delay = Math.random() * 0.2; // 随机延迟
      const size = 0.5 + Math.random() * 0.5; // 随机大小

      // 计算终点位置
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // 随机颜色
      const color = colors[Math.floor(Math.random() * colors.length)];

      // 添加粒子
      activeParticles.value.push({
        id: Date.now() + i,
        style: {
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${size})`,
          opacity: `${0.8 - delay}`,
        },
        color
      });
    }

    // 清除动画
    setTimeout(() => {
      activeParticles.value = [];
    }, 1000);
  }

  // 触发收藏爆炸动画
  function triggerBurstAnimation() {
    showBurst.value = true;

    // 动画结束后重置
    setTimeout(() => {
      showBurst.value = false;
    }, 600);
  }

  // 收藏爆炸粒子样式
  function particleStyle(index: number) {
    const angle = (index - 1) * 60; // 360度平均分配6个粒子
    return {
      transform: `rotate(${angle}deg) translateY(-25px)`,
    };
  }

  // 格式化数字
  function formatCount(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
</script>

<style scoped>
  .action-button {
    position: relative;
    overflow: visible;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .action-button.is-active {
    color: var(--primary-color);
  }

  .action-button:active {
    transform: scale(1.1);
  }

  .count {
    font-size: 12px;
    transition: all 0.2s;
  }

  .text {
    font-size: 12px;
    margin-left: 2px;
  }

  .is-active .count,
  .is-active .text {
    color: var(--primary-color);
    font-weight: 500;
  }

  /* 类型特殊样式 */
  .action-type-favorite.is-active {
    color: var(--error-color);
  }

  .action-type-favorite.is-active .count,
  .action-type-favorite.is-active .text {
    color: var(--error-color);
  }

  /* 尺寸变体 */
  .size-small {
    font-size: 12px;
  }

  .size-medium {
    font-size: 14px;
  }

  .size-large {
    font-size: 16px;
  }

  /* 点赞动画容器 */
  .animation-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 10;
  }

  .animation-particle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* 点赞动画效果 */
  .action-animation-enter-active {
    animation: float-up 0.8s forwards;
  }

  .action-animation-leave-active {
    animation: fade-out 0.3s forwards;
  }

  @keyframes float-up {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }

    10% {
      opacity: 1;
    }

    70% {
      opacity: 0.8;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  /* 收藏爆炸动画 */
  .heart-burst {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .heart-burst.active {
    opacity: 1;
  }

  .burst-particle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--error-color);
    opacity: 0;
  }

  .heart-burst.active .burst-particle {
    animation: burst 0.5s ease-out forwards;
  }

  @keyframes burst {
    0% {
      opacity: 1;
      transform: rotate(0deg) translateY(0);
    }

    100% {
      opacity: 0;
      transform: rotate(0deg) translateY(-20px);
    }
  }
</style>