/**
* @file FavoriteButton.vue
* @description 带动画效果的收藏按钮组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <n-button quaternary :class="[
    'favorite-button',
    { 'is-active': modelValue },
    sizeClass
  ]" @click="handleClick">
    <template #icon>
      <n-icon size="18">
        <Heart v-if="modelValue" />
        <HeartOutline v-else />
      </n-icon>
    </template>
    <span v-if="showCount" class="count">{{ formatCount(count) }}</span>

    <!-- 收藏动画特效 -->
    <div class="heart-burst" :class="{ 'active': showBurst }">
      <div class="burst-particle" v-for="n in 6" :key="n" :style="particleStyle(n)"></div>
    </div>
  </n-button>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { NButton, NIcon } from 'naive-ui';
  import { Heart, HeartOutline } from '@vicons/ionicons5';

  const props = defineProps({
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
    }
  });

  const emit = defineEmits(['update:modelValue', 'click']);

  // 尺寸类名
  const sizeClass = computed(() => `size-${props.size}`);

  // 动画控制
  const showBurst = ref(false);

  // 处理点击
  function handleClick() {
    emit('update:modelValue', !props.modelValue);
    emit('click');

    // 如果从未激活到激活状态，触发动画
    if (!props.modelValue) {
      triggerAnimation();
    }
  }

  // 触发动画
  function triggerAnimation() {
    showBurst.value = true;

    // 动画结束后重置
    setTimeout(() => {
      showBurst.value = false;
    }, 600);
  }

  // 计算粒子样式
  function particleStyle(index: number) {
    const angle = (index - 1) * 60; // 每60度一个粒子，形成圆形
    return {
      transform: `rotate(${angle}deg) translateY(-20px)`,
      background: getParticleColor(index)
    };
  }

  // 获取粒子颜色
  function getParticleColor(index: number) {
    const colors = [
      'var(--error-color)',
      'var(--primary-color)',
      'var(--warning-color)',
      'var(--success-color)',
      'var(--info-color)',
      'var(--error-color)'
    ];
    return colors[(index - 1) % colors.length];
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
  .favorite-button {
    position: relative;
    overflow: visible;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .favorite-button.is-active {
    color: var(--error-color);
  }

  .favorite-button:active {
    transform: scale(1.2);
  }

  .count {
    font-size: 12px;
    transition: all 0.3s;
  }

  .is-active .count {
    color: var(--error-color);
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

  /* 爆炸动画效果 */
  .heart-burst {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s ease;
  }

  .heart-burst.active {
    opacity: 1;
    animation: burst 0.6s ease-out forwards;
  }

  .burst-particle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transform-origin: center;
    opacity: 0;
  }

  .heart-burst.active .burst-particle {
    animation: particle-appear 0.6s ease-out forwards;
  }

  @keyframes burst {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }

    20% {
      transform: translate(-50%, -50%) scale(1.2);
    }

    50% {
      transform: translate(-50%, -50%) scale(1);
    }

    80% {
      transform: translate(-50%, -50%) scale(1.1);
    }

    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes particle-appear {
    0% {
      opacity: 0;
      transform: rotate(0deg) translateY(0);
    }

    20% {
      opacity: 1;
    }

    80% {
      opacity: 0.8;
    }

    100% {
      opacity: 0;
      transform: rotate(var(--rotation)) translateY(-30px);
    }
  }
</style>