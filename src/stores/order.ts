import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/api/client'
import { mapOrder } from '@/api/mappers'
import type { Order } from '@/types/models'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)

  async function fetchAll(): Promise<Order[]> {
    loading.value = true
    try {
      const raw = await apiClient.post<{ Items?: unknown[] }>('/api/orders/list')
      orders.value = (raw?.Items ?? []).map(mapOrder)
      return orders.value
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string): Promise<Order | null> {
    const raw = await apiClient.post<Record<string, unknown>>('/api/orders/detail', {
      Id: id,
    })
    return raw ? mapOrder(raw) : null
  }

  async function cancel(id: string): Promise<boolean> {
    const raw = await apiClient.post<{ Success?: boolean }>('/api/orders/cancel', {
      Id: id,
    })
    return Boolean(raw?.Success)
  }

  function findById(id: string): Order | undefined {
    return orders.value.find((o) => o.id === id)
  }

  function prependOrder(order: Order) {
    orders.value.unshift(order)
  }

  return { orders, loading, fetchAll, fetchById, cancel, findById, prependOrder }
})
