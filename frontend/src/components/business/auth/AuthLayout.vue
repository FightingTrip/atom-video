/**
* @file AuthLayout.vue
* @description 认证页面的布局组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/">
                <img class="h-8 w-auto" src="/logo-192.png" alt="Atom Video" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
  // 认证页面的布局组件
</script>