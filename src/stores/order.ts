import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userOrders } from '@/mocks/orders'
import type { Order } from '@/types/models'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>(userOrders)

  async function fetchAll() {
    await new Promise((r) => setTimeout(r, 200))
    return orders.value
  }

  function findById(id: string): Order | undefined {
    return orders.value.find((o) => o.id === id)
  }

  function prependOrder(order: Order) {
    orders.value.unshift(order)
  }

  return { orders, fetchAll, findById, prependOrder }
})
