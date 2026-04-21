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
      products.value = [
        {
          id: 'PROD001',
          name: 'EBM PACS Server',
          category: 'Medical Imaging',
          taglineZh: '高穩定醫療影像伺服器',
          description: '企業級 PACS 系統核心，提供影像儲存與調閱服務。',
          logo: 'EB',
          basePrice: 50000,
          modules: [
            { id: 'BA001', name: 'Server Basic (Windows)', description: '系統核心授權', category: 'basic', priceType: 'fixed', price: 20000, isNecessary: true, isOnlyOne: true },
            { id: 'BA002', name: 'Server Basic (Linux)', description: '系統核心授權', category: 'basic', priceType: 'fixed', price: 20000, isNecessary: true, isOnlyOne: true },
            { id: 'DI001', name: 'DICOM Store SCP', description: '接收儀器影像', category: 'device', priceType: 'fixed', price: 10000, isNecessary: false, isOnlyOne: false, dependModuleIds: ['BA001', 'BA002'] },
            { id: 'DI002', name: 'DICOM Query/Retrieve', description: '查詢與調閱', category: 'device', priceType: 'fixed', price: 15000, isNecessary: false, isOnlyOne: false, associatedModuleIds: ['DI001'] },
          ]
        }
      ]
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
