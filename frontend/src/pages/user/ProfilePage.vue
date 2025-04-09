/**
* @file ProfilePage.vue
* @description 用户个人主页页面，使用 UserProfileComponent 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="profile-page">
    <UserProfileComponent />
  </div>
</template>

<script setup lang="ts">
  import UserProfileComponent from '@/components/business/user/UserProfileComponent.vue'
</script>

<style scoped>
  .profile-page {
    min-height: 100vh;
  }
</style>