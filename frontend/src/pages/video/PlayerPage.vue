/**
* @file PlayerPage.vue
* @description 视频播放页面，使用 Player 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="player-page">
    <Player />
  </div>
</template>

<script setup lang="ts">
  import Player from '@/components/business/video/Player.vue'
</script>

<style scoped>
  .player-page {
    min-height: 100vh;
  }
</style>