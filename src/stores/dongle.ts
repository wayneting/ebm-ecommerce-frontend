import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/api/client'
import { mapDongle } from '@/api/mappers'
import type { Dongle } from '@/types/models'

export const useDongleStore = defineStore('dongle', () => {
  const dongles = ref<Dongle[]>([])
  const loading = ref(false)

  async function fetchAll(): Promise<Dongle[]> {
    loading.value = true
    try {
      const raw = await apiClient.post<{ Items?: unknown[] }>(
        '/api/warehouse/list',
      )
      dongles.value = (raw?.Items ?? []).map(mapDongle)
      return dongles.value
    } finally {
      loading.value = false
    }
  }

  function findBySerial(serial: string): Dongle | undefined {
    return dongles.value.find((d) => d.serial === serial)
  }

  return { dongles, loading, fetchAll, findBySerial }
})
