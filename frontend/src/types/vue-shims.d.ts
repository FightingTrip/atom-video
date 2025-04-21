/**
 * @file vue-shims.d.ts
 * @description 全局Vue相关类型声明
 */

// 声明所有.vue文件
declare module '*.vue' {
  import type { ComponentOptions } from 'vue';
  const component: ComponentOptions;
  export default component;
}

// 声明特定模块
declare module '@/utils/mockData';
declare module '@/components/business/video/VideoPlayerComponent.vue';
declare module '../../../utils/mockData';
declare module '../../../components/business/video/VideoPlayerComponent.vue';
