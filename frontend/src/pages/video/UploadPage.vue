/**
* @file UploadPage.vue
* @description 视频上传页面，使用 Upload 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="upload-page">
    <Upload />
  </div>
</template>

<script setup lang="ts">
  import Upload from '@/components/business/video/Upload.vue'
</script>

<style scoped>
  .upload-page {
    min-height: 100vh;
  }
</style>