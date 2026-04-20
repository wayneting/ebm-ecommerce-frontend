<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useProductStore } from '@/stores/product'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmBadge from '@/components/ui/EbmBadge.vue'
import EbmModal from '@/components/ui/EbmModal.vue'
import type { Product } from '@/types/models'

const productStore = useProductStore()
onMounted(() => productStore.fetchAll())

const search = ref('')
const viewing = ref<Product | null>(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return productStore.products
  return productStore.products.filter((p) =>
    p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.taglineZh.includes(q),
  )
})

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()
</script>

<template>
  <AdminLayout :breadcrumb="['產品管理']">
    <div class="flex justify-between items-end mb-6 flex-wrap gap-3">
      <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">產品管理</h1>
      <div class="flex gap-2">
        <EbmButton variant="secondary" size="sm">匯出 CSV</EbmButton>
        <EbmButton variant="primary" size="sm">+ 新增產品</EbmButton>
      </div>
    </div>

    <EbmCard padding="sm">
      <div class="px-4 py-3 border-b border-ebm-border">
        <input
          v-model="search"
          type="text"
          placeholder="搜尋產品 ID、名稱..."
          class="w-full max-w-md px-4 py-2 rounded-lg border border-ebm-border text-sm focus:outline-none focus:border-ebm-accent"
        >
      </div>
      <table class="w-full text-sm">
        <thead class="bg-ebm-bg text-xs uppercase tracking-wider text-ebm-text-muted">
          <tr>
            <th class="px-5 py-3 text-left font-semibold">產品</th>
            <th class="px-5 py-3 text-left font-semibold">ID</th>
            <th class="px-5 py-3 text-left font-semibold">模組數</th>
            <th class="px-5 py-3 text-right font-semibold">起始價</th>
            <th class="px-5 py-3 text-left font-semibold">狀態</th>
            <th class="px-5 py-3 text-right font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ebm-border">
          <tr v-for="p in filtered" :key="p.id" class="hover:bg-ebm-bg">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-ebm-gradient-accent">
                  {{ p.logo }}
                </div>
                <div>
                  <div class="font-semibold text-ebm-primary">{{ p.name }}</div>
                  <div class="text-xs text-ebm-text-muted">{{ p.category }}</div>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 font-mono text-xs text-ebm-text-muted">{{ p.id }}</td>
            <td class="px-5 py-3"><span class="px-2 py-0.5 rounded-md bg-ebm-bg text-xs">{{ p.modules.length }} 個</span></td>
            <td class="px-5 py-3 text-right font-mono font-semibold">{{ fmt(p.basePrice) }}</td>
            <td class="px-5 py-3"><EbmBadge variant="success" dot>上架中</EbmBadge></td>
            <td class="px-5 py-3 text-right">
              <div class="flex gap-1 justify-end">
                <button class="h-8 px-2 rounded-md hover:bg-ebm-bg text-xs text-ebm-accent"
                  @click="viewing = p">模組</button>
                <button class="h-8 px-2 rounded-md hover:bg-ebm-bg text-xs text-ebm-text-muted">編輯</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </EbmCard>

    <!-- Modules modal -->
    <EbmModal :open="!!viewing" :title="viewing ? `${viewing.name} 模組清單` : ''"
      :subtitle="viewing?.id" max-width="max-w-2xl" @close="viewing = null"
    >
      <table v-if="viewing" class="w-full text-sm">
        <thead class="text-xs text-ebm-text-muted uppercase tracking-wider">
          <tr class="border-b border-ebm-border">
            <th class="py-2 text-left font-semibold">ID</th>
            <th class="py-2 text-left font-semibold">模組名稱</th>
            <th class="py-2 text-left font-semibold">計價</th>
            <th class="py-2 text-right font-semibold">單價</th>
            <th class="py-2 text-center font-semibold">必選</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ebm-border">
          <tr v-for="m in viewing.modules" :key="m.id">
            <td class="py-2 font-mono text-xs text-ebm-text-muted">{{ m.id }}</td>
            <td class="py-2">{{ m.name }}</td>
            <td class="py-2 text-xs">
              {{ m.priceType === 'fixed' ? '一次性' : m.priceType === 'per-unit' ? `每 ${m.unit}` : `每${m.unit}` }}
            </td>
            <td class="py-2 text-right font-mono">{{ fmt(m.price) }}</td>
            <td class="py-2 text-center">
              <span v-if="m.isNecessary" class="text-ebm-cta">●</span>
              <span v-else class="text-ebm-text-muted">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </EbmModal>
  </AdminLayout>
</template>
