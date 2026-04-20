<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth_v2'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const route = useRoute()

const inAdmin = computed(() => route.path.startsWith('/admin'))
const inApp = computed(() => route.path.startsWith('/app'))
const inLogin = computed(() => route.path.startsWith('/login'))

// Admin 頁面自帶 sidebar layout；登入頁也不顯示全站 header。
const showGlobalChrome = computed(() => !inAdmin.value && !inLogin.value)

async function handleLogout() {
  await auth.logout()
  // logout 完導到 /login
  window.location.href = '/login'
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header v-if="showGlobalChrome" class="bg-white border-b border-ebm-border sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <RouterLink to="/app" class="text-xl font-extrabold text-ebm-primary tracking-tight">
          EBM Technologies
        </RouterLink>

        <nav class="flex items-center gap-5">
          <RouterLink
            to="/app"
            class="text-sm font-medium text-ebm-text-muted hover:text-ebm-primary"
            active-class="text-ebm-primary"
          >
            儀表板
          </RouterLink>
          <RouterLink
            to="/app/products"
            class="text-sm font-medium text-ebm-text-muted hover:text-ebm-primary"
            active-class="text-ebm-primary"
          >
            產品
          </RouterLink>
          <RouterLink
            to="/app/dongles"
            class="text-sm font-medium text-ebm-text-muted hover:text-ebm-primary"
            active-class="text-ebm-primary"
          >
            Dongle
          </RouterLink>
          <RouterLink
            to="/app/orders"
            class="text-sm font-medium text-ebm-text-muted hover:text-ebm-primary"
            active-class="text-ebm-primary"
          >
            訂單
          </RouterLink>
          <RouterLink
            to="/app/cart"
            class="text-sm font-medium text-ebm-text-muted hover:text-ebm-primary relative"
            active-class="text-ebm-primary"
          >
            購物車
            <span
              v-if="cart.itemCount > 0"
              class="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-ebm-cta text-white text-xs font-bold flex items-center justify-center"
            >
              {{ cart.itemCount }}
            </span>
          </RouterLink>
          <RouterLink
            to="/app/account"
            class="text-sm font-medium text-ebm-text-muted hover:text-ebm-primary"
            active-class="text-ebm-primary"
          >
            帳戶
          </RouterLink>
          <RouterLink
            to="/admin"
            class="text-sm font-medium text-ebm-cta hover:text-ebm-cta-hover"
            active-class="text-ebm-cta-hover"
          >
            後台
          </RouterLink>
          <RouterLink
            to="/legacy/account"
            class="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
          >
            舊版界面
          </RouterLink>

          <div class="flex items-center gap-2 pl-4 border-l border-ebm-border">
            <div class="h-8 w-8 rounded-full bg-ebm-accent flex items-center justify-center text-white text-sm font-bold">
              {{ auth.user?.displayName?.[0] ?? 'U' }}
            </div>
            <span class="text-sm text-ebm-text-muted hidden md:inline">{{ auth.user?.displayName }}</span>
            <button
              class="text-xs text-ebm-text-muted hover:text-ebm-error ml-2"
              @click="handleLogout"
            >
              登出
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer v-if="!inApp && !inAdmin" class="bg-ebm-primary text-white/70 mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center text-sm flex-wrap gap-3">
        <div>© 2026 EBM Technologies</div>
        <div class="text-xs text-white/50">Vue 3 · TypeScript · Tailwind CSS v4 · EBMECAPI v1</div>
      </div>
    </footer>
  </div>
</template>
