<script setup lang="ts">
/**
 * ProductList — EBM 六產品選購頁
 * 點卡片進入 ProductConfigView 配置模組
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmButton from '@/components/ui/EbmButton.vue'

const productStore = useProductStore()
const router = useRouter()

onMounted(() => {
  productStore.fetchAll()
})

function formatPrice(n: number): string {
  return 'NT$ ' + n.toLocaleString('en-US')
}

function goConfig(productId: string) {
  router.push(`/app/products/${productId}/configure`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <header class="mb-10">
      <div class="text-ebm-accent text-sm font-semibold uppercase tracking-widest mb-2">新購產品</div>
      <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">選擇您要購買的產品</h1>
      <p class="text-lg text-ebm-text-muted mt-2">
        每一款產品都有獨立的模組設定，下一步可依需求客製化配置。
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EbmCard v-for="p in productStore.products" :key="p.id" hoverable>
        <div class="flex items-start gap-4 mb-4">
          <div class="h-14 w-14 rounded-xl flex items-center justify-center text-white font-extrabold bg-ebm-gradient-accent flex-shrink-0">
            {{ p.logo }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-mono text-xs text-ebm-text-muted uppercase tracking-wider">{{ p.id }}</div>
            <h3 class="text-xl font-bold text-ebm-primary truncate">{{ p.name }}</h3>
            <div class="text-xs text-ebm-text-muted">{{ p.category }}</div>
          </div>
        </div>
        <p class="text-sm text-ebm-primary font-semibold mb-2">{{ p.taglineZh }}</p>
        <p class="text-sm text-ebm-text-muted leading-relaxed mb-5 min-h-[60px]">
          {{ p.description }}
        </p>
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-ebm-border">
          <span class="text-xs text-ebm-text-muted">{{ p.modules.length }} 個可選模組</span>
          <div class="text-right">
            <div class="text-xs text-ebm-text-muted">起始價</div>
            <div class="font-mono font-bold text-ebm-primary">{{ formatPrice(p.basePrice) }}</div>
          </div>
        </div>
        <EbmButton variant="primary" full-width @click="goConfig(p.id)">
          配置模組 →
        </EbmButton>
      </EbmCard>
    </div>
  </div>
</template>
