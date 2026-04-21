<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth_v2'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const route = useRoute()

const userName = computed(() => auth.user?.displayName || 'User')
const userId = computed(() => auth.user?.userId || 'unknown')

function handleLogout() {
  auth.logout()
  window.location.href = '/login'
}
</script>

<template>
  <div class="legacy-root bg-white min-h-screen font-sans text-sm">
    <!-- 1:1 Titlebar -->
    <div id="titlebar" class="border-b border-[#ccc] bg-white px-2 py-1 flex justify-end items-center gap-2 text-[12px] font-bold text-black">
      <RouterLink to="/legacy/cart" class="text-blue-700 hover:underline">
        購物車({{ cart.itemCount }})
      </RouterLink>
      <span class="text-[#ccc]">|</span>
      <RouterLink to="/legacy/orders" class="text-blue-700 hover:underline">
        訂單列表
      </RouterLink>
      <span class="text-[#ccc]">|</span>
      <RouterLink to="/legacy/dongles" class="text-blue-700 hover:underline">
        Dongle列表
      </RouterLink>
      <span class="text-[#ccc]">|</span>
      <b class="text-black">{{ userId }}( {{ userName }} )</b>
      <span class="text-[#ccc]">|</span>
      <RouterLink to="/legacy/account" class="text-blue-700 hover:underline">
        帳戶設定
      </RouterLink>
      <span class="text-[#ccc]">|</span>
      <RouterLink to="/admin" class="text-blue-700 hover:underline">
        管理界面
      </RouterLink>
      <span class="text-[#ccc]">|</span>
      <a href="javascript:void(0)" class="text-blue-700 hover:underline" @click="handleLogout">
        登出
      </a>
    </div>

    <!-- 1:1 Header -->
    <div id="header" class="bg-white p-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-[#333]">EBMtech 電子商務平臺</h1>
      </div>
      
      <!-- 1:1 Menu Container -->
      <div id="menucontainer" class="mt-4">
        <ul id="menuleft" class="flex border-b border-[#ccc]">
          <li class="mr-1">
            <RouterLink 
              to="/app" 
              class="inline-block px-4 py-2 text-[#333] border-t border-l border-r border-[#ccc] hover:bg-[#f0f0f0]"
              active-class="bg-white font-bold mb-[-1px] border-b-white"
            >
              首頁
            </RouterLink>
          </li>
          <li class="mr-1">
            <RouterLink 
              to="/app/products" 
              class="inline-block px-4 py-2 text-[#333] border-t border-l border-r border-[#ccc] hover:bg-[#f0f0f0]"
              active-class="bg-white font-bold mb-[-1px] border-b-white"
            >
              產品列表
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/legacy/products" 
              class="inline-block px-4 py-2 text-[#333] border-t border-l border-r border-[#ccc] hover:bg-[#f0f0f0]"
              active-class="bg-white font-bold mb-[-1px] border-b-white"
            >
              新購/升級產品
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div id="main" class="p-4 max-w-6xl">
      <slot />
    </div>

    <!-- 1:1 Footer -->
    <div id="footer" class="mt-10 p-4 border-t border-[#ccc] text-[12px] text-black bg-white">
      <div class="flex items-center">
        <span class="mr-4">Copyright (C) 2010 EBM Technologies. All Rights Reserved.</span>
        <a href="http://www.ebmtech.com/" target="_blank" class="text-blue-700 hover:underline">www.ebmtech.com</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 模擬舊系統的 CSS 特性 */
#titlebar a, #menucontainer a {
  text-decoration: none;
}
</style>
