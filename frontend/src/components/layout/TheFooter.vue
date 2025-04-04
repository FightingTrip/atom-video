<template>
  <footer class="bg-white dark:bg-gray-900 border-t dark:border-gray-800">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 关于我们 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">关于我们</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                公司简介
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                联系我们
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                加入我们
              </a>
            </li>
          </ul>
        </div>

        <!-- 帮助中心 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">帮助中心</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                使用指南
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                常见问题
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                意见反馈
              </a>
            </li>
          </ul>
        </div>

        <!-- 条款政策 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">条款政策</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                服务条款
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                隐私政策
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                版权声明
              </a>
            </li>
          </ul>
        </div>

        <!-- 关注我们 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">关注我们</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
              <i class="fab fa-weixin text-2xl"></i>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
              <i class="fab fa-weibo text-2xl"></i>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
              <i class="fab fa-github text-2xl"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-8 pt-8 border-t dark:border-gray-800">
        <p class="text-center text-gray-500 dark:text-gray-400">
          © {{ new Date().getFullYear() }} Atom Video. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  // 组件逻辑
</script>