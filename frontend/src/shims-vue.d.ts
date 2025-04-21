/**
 * @file shims-vue.d.ts
 * @description 声明Vue组件和其他模块的类型
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明特定模块
declare module '@/utils/mockData';
declare module '@/components/business/video/VideoPlayerComponent.vue';
