<script setup lang="ts">
/**
 * AdminLayout — 左側 sidebar + 頂部 breadcrumb + 主內容 slot。
 */
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface Props {
  breadcrumb?: string[]
}

withDefaults(defineProps<Props>(), { breadcrumb: () => [] })

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { to: '/admin', label: '儀表板' },
  { to: '/admin/products', label: '產品管理' },
  { to: '/admin/orders', label: '訂單管理' },
  { to: '/admin/users', label: '使用者' },
]

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

function goCustomer() {
  router.push('/app')
}
</script>

<template>
  <div class="min-h-screen flex bg-ebm-bg">
    <aside class="w-56 bg-ebm-primary text-white/80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div class="px-5 py-6 border-b border-white/10">
        <div class="text-lg font-extrabold text-white">EBM · Admin</div>
        <div class="text-xs text-white/50 mt-0.5">{{ auth.user?.displayName }}</div>
      </div>

      <nav class="py-3 text-sm">
        <RouterLink
          v-for="n in navItems"
          :key="n.to"
          :to="n.to"
          class="flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 transition-colors"
          :class="isActive(n.to) ? 'bg-white/5 border-l-2 border-ebm-cta text-white' : ''"
        >
          {{ n.label }}
        </RouterLink>

        <div class="border-t border-white/10 mt-3 pt-3">
          <button
            class="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 text-sm text-white/70 hover:text-white transition-colors"
            @click="goCustomer"
          >
            返回客戶端
          </button>
        </div>
      </nav>
    </aside>

    <div class="flex-1 min-w-0">
      <div class="bg-white border-b border-ebm-border px-6 py-3 sticky top-0 z-10">
        <nav class="flex items-center gap-2 text-sm">
          <RouterLink to="/admin" class="text-ebm-text-muted hover:text-ebm-primary">後台</RouterLink>
          <template v-for="(b, idx) in breadcrumb" :key="idx">
            <span class="text-ebm-border">/</span>
            <span :class="idx === breadcrumb.length - 1 ? 'text-ebm-primary font-semibold' : 'text-ebm-text-muted'">
              {{ b }}
            </span>
          </template>
        </nav>
      </div>

      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>
