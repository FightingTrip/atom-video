<template>
  <footer class="py-6 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div class="flex space-x-6">
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">使用指南</a>
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">服务条款</a>
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">隐私政策</a>
        </div>

        <div class="flex items-center space-x-4">
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">
            <i class="fab fa-weixin"></i>
          </a>
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">
            <i class="fab fa-weibo"></i>
          </a>
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">
            <i class="fab fa-github"></i>
          </a>
        </div>

        <div class="w-full mt-4 text-center sm:w-auto sm:mt-0">
          © {{ new Date().getFullYear() }} Atom Video. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  // 组件逻辑
</script>