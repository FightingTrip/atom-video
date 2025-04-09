/**
* @file SettingsPage.vue
* @description 用户设置页面，使用 UserSettingsComponent 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="settings-page">
    <UserSettingsComponent />
  </div>
</template>

<script setup lang="ts">
  import UserSettingsComponent from '@/components/business/user/UserSettingsComponent.vue'
</script>

<style scoped>
  .settings-page {
    min-height: 100vh;
  }
</style>