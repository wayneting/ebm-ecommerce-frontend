import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { products as seedProducts, findProductById } from '@/mocks/products'
import type { Product } from '@/types/models'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>(seedProducts)
  const selectedProductId = ref<string | null>(null)

  const selectedProduct = computed(() =>
    selectedProductId.value ? findProductById(selectedProductId.value) ?? null : null,
  )

  function select(productId: string) {
    selectedProductId.value = productId
  }

  async function fetchAll() {
    // Mock：資料已在 seedProducts
    await new Promise((r) => setTimeout(r, 200))
    return products.value
  }

  async function fetchById(id: string) {
    await new Promise((r) => setTimeout(r, 150))
    return findProductById(id) ?? null
  }

  return { products, selectedProductId, selectedProduct, select, fetchAll, fetchById }
})
