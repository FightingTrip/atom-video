/**
* @file SettingsPage.vue
* @description 用户设置页面，使用 Settings 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="settings-page">
    <Settings />
  </div>
</template>

<script setup lang="ts">
  import Settings from '@/components/business/user/Settings.vue'
</script>

<style scoped>
  .settings-page {
    min-height: 100vh;
  }
</style>