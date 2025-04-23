/**
* @file LikeButton.vue
* @description 带动画效果的点赞按钮组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <n-button quaternary :class="[
    'like-button',
    { 'is-active': modelValue },
    sizeClass
  ]" @click="handleClick">
    <template #icon>
      <n-icon size="18">
        <component :is="modelValue ? filledIcon : outlineIcon" />
      </n-icon>
    </template>
    <span v-if="showCount" class="count">{{ formatCount(count) }}</span>

    <!-- 点赞动画特效 -->
    <transition-group v-if="showAnimation" class="animation-container" tag="div" name="like-animation">
      <div v-for="particle in activeParticles" :key="particle.id" :style="particle.style" class="animation-particle">
        <n-icon :color="particle.color">
          <component :is="filledIcon" />
        </n-icon>
      </div>
    </transition-group>
  </n-button>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onBeforeUnmount } from 'vue';
  import { NButton, NIcon } from 'naive-ui';
  import { ThumbsUp, ThumbsUpOutline, Heart, HeartOutline } from '@vicons/ionicons5';

  const props = defineProps({
    type: {
      type: String as () => 'like' | 'favorite',
      default: 'like'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    showCount: {
      type: Boolean,
      default: true
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    },
    showAnimation: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits(['update:modelValue', 'click']);

  // 图标选择
  const filledIcon = computed(() => props.type === 'like' ? ThumbsUp : Heart);
  const outlineIcon = computed(() => props.type === 'like' ? ThumbsUpOutline : HeartOutline);

  // 尺寸类名
  const sizeClass = computed(() => `size-${props.size}`);

  // 动画效果
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

  // 处理点击
  function handleClick() {
    emit('update:modelValue', !props.modelValue);
    emit('click');

    // 如果从未激活到激活状态，触发动画
    if (!props.modelValue && props.showAnimation) {
      createParticleAnimation();
    }
  }

  // 创建粒子动画
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

  // 清理函数
  onBeforeUnmount(() => {
    activeParticles.value = [];
  });
</script>

<style scoped>
  .like-button {
    position: relative;
    overflow: visible;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .like-button.is-active {
    color: var(--primary-color);
  }

  .like-button:active {
    transform: scale(1.1);
  }

  .count {
    font-size: 12px;
    transition: all 0.2s;
  }

  .is-active .count {
    color: var(--primary-color);
    font-weight: 500;
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
    padding: 8px 12px;
  }

  /* 动画容器 */
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
    font-size: 14px;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* 动画效果 */
  .like-animation-enter-active {
    animation: float-up 0.8s forwards;
  }

  .like-animation-leave-active {
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
</style>