import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core';

export function useBreakpoints() {
  const { width } = useWindowSize();

  const breakpoints = computed(() => ({
    sm: width.value >= 640,
    md: width.value >= 768,
    lg: width.value >= 1024,
    xl: width.value >= 1280,
    '2xl': width.value >= 1536,
  }));

  return breakpoints;
}
