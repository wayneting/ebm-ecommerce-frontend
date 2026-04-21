import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiClient } from '@/api/client'
import { mapProduct } from '@/api/mappers'
import type { Product } from '@/types/models'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const selectedProductId = ref<string | null>(null)
  const loading = ref(false)

  const selectedProduct = computed(() =>
    selectedProductId.value
      ? products.value.find((p) => p.id === selectedProductId.value) ?? null
      : null,
  )

  function select(productId: string) {
    selectedProductId.value = productId
  }

  async function fetchAll(): Promise<Product[]> {
    loading.value = true
    try {
      const raw = await apiClient.post<{ Items?: unknown[] }>(
        '/api/admin/products/list',
      )
      products.value = (raw?.Items ?? []).map(mapProduct)
      return products.value
    } catch (err) {
      console.error('Backend API failed, using fallback mock data:', err)
      // Provide dummy data so the user can test UI even when backend is down
      const mockData = await import('./mockProducts.json')
      products.value = mockData.default as Product[]
      return products.value
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string): Promise<Product | null> {
    const raw = await apiClient.post<Record<string, unknown>>(
      '/api/admin/products/detail',
      { Id: id },
    )
    return raw ? mapProduct(raw) : null
  }

  return {
    products,
    selectedProductId,
    selectedProduct,
    loading,
    select,
    fetchAll,
    fetchById,
  }
})
