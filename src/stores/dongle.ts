import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userDongles } from '@/mocks/dongles'
import type { Dongle } from '@/types/models'

export const useDongleStore = defineStore('dongle', () => {
  const dongles = ref<Dongle[]>(userDongles)

  async function fetchAll() {
    await new Promise((r) => setTimeout(r, 200))
    return dongles.value
  }

  function findBySerial(serial: string): Dongle | undefined {
    return dongles.value.find((d) => d.serial === serial)
  }

  return { dongles, fetchAll, findBySerial }
})
