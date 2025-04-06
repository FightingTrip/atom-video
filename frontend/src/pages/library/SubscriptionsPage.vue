/**
* @file SubscriptionsPage.vue
* @description 订阅页面，使用 Subscriptions 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="subscriptions-page">
    <Subscriptions />
  </div>
</template>

<script setup lang="ts">
  import Subscriptions from '@/components/business/library/Subscriptions.vue'
</script>

<style scoped>
  .subscriptions-page {
    min-height: 100vh;
  }
</style>