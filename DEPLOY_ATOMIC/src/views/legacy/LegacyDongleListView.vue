<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LegacyLayout from '@/layouts/LegacyLayout.vue'
import { useAuthStore } from '@/stores/auth_v2'

interface Order {
  id: string
  label: string
  product: string
  productName: string
  date: string
  description: string
  modules: Array<{ id: string; name: string; desc: string; qty: number }>
}

interface Dongle {
  id: string
  status: string
  latestOrder?: Order
  burnedFeatures?: Order
}

const dongles = ref<Dongle[]>([
  {
    id: '8000001',
    status: '在購物車',
    latestOrder: {
      id: '10605',
      label: '00010605(新購-以日計費，已付款，尚未燒錄)',
      product: 'PROD001',
      productName: 'EBM PACS',
      date: '2026/4/8 下午 02:43:02',
      description: '購買日數:90天',
      modules: [
        { id: 'DI001', name: 'CR Connection', desc: '允許一臺CR儀器傳入影像', qty: 1 },
        { id: 'DI003', name: 'CT Connection', desc: '允許一臺CT傳入影像', qty: 1 },
        { id: 'SI004', name: '5,000 Studies', desc: '可以在線儲存5000個檢查', qty: 1 },
      ]
    },
    burnedFeatures: {
      id: '4',
      label: '00000004(新購-以日計費，已付款，已燒錄)',
      product: 'PROD001',
      productName: 'EBM PACS',
      date: '2012/10/24 下午 02:50:25',
      description: '到期日:2013/01/29，升級日數:90天',
      modules: [
        { id: 'DI012', name: 'Multi-modality Connection', desc: '允許一臺任何種類的儀器傳入影像', qty: 20 },
        { id: 'SI004', name: '5,000 Studies', desc: '可以在線儲存5000個檢查', qty: 20 },
      ]
    }
  }
])

const expandedLatest = ref<Set<string>>(new Set())
const expandedBurned = ref<Set<string>>(new Set())
const expandedAll = ref<Set<string>>(new Set())

function toggleLatest(id: string) {
  if (expandedLatest.value.has(id)) expandedLatest.value.delete(id)
  else expandedLatest.value.add(id)
  expandedLatest.value = new Set(expandedLatest.value)
}

function toggleBurned(id: string) {
  if (expandedBurned.value.has(id)) expandedBurned.value.delete(id)
  else expandedBurned.value.add(id)
  expandedBurned.value = new Set(expandedBurned.value)
}

function toggleAll(id: string) {
  if (expandedAll.value.has(id)) expandedAll.value.delete(id)
  else expandedAll.value.add(id)
  expandedAll.value = new Set(expandedAll.value)
}
</script>

<template>
  <LegacyLayout>
    <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">Dongle列表</h2>

    <table class="legacy-table w-full text-sm border-collapse border border-[#ccc]">
      <thead>
        <tr class="bg-[#f2f2f2]">
          <th class="border border-[#ccc] p-2">新購/升級產品</th>
          <th class="border border-[#ccc] p-2">序號</th>
          <th class="border border-[#ccc] p-2">狀態</th>
          <th class="border border-[#ccc] p-2">最近訂單</th>
          <th class="border border-[#ccc] p-2">目前燒錄</th>
          <th class="border border-[#ccc] p-2">訂單紀錄</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="d in dongles" :key="d.id">
          <tr>
            <td class="border border-[#ccc] p-2 text-center">已在購物車</td>
            <td class="border border-[#ccc] p-2 text-center">{{ d.id }}</td>
            <td class="border border-[#ccc] p-2 text-center">{{ d.status }}</td>
            <td class="border border-[#ccc] p-2 text-center text-blue-700">
              <a href="javascript:void(0)" class="hover:underline" @click="toggleLatest(d.id)">顯示最近訂單</a>
            </td>
            <td class="border border-[#ccc] p-2 text-center text-blue-700">
              <a href="javascript:void(0)" class="hover:underline" @click="toggleBurned(d.id)">顯示目前已燒錄功能</a>
            </td>
            <td class="border border-[#ccc] p-2 text-center text-blue-700">
              <a href="javascript:void(0)" class="hover:underline" @click="toggleAll(d.id)">顯示所有關聯訂單</a>
            </td>
          </tr>

          <!-- Nested Table: Latest Order -->
          <tr v-if="expandedLatest.has(d.id) && d.latestOrder" class="bg-[#fdfdfd]">
            <td colspan="1"></td>
            <td colspan="5" class="p-4 border border-[#ccc]">
              <div class="font-bold text-black mb-2">最近的訂單</div>
              <table class="w-full text-xs border-collapse border border-[#ddd]">
                <tr class="border-b border-[#ddd]">
                  <th class="w-24 text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">關聯訂單</th>
                  <td colspan="4" class="p-2 text-blue-700 underline">{{ d.latestOrder.label }}</td>
                </tr>
                <tr class="border-b border-[#ddd]">
                  <th class="text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">產品</th>
                  <td class="p-2">{{ d.latestOrder.product }}</td>
                  <td class="p-2">{{ d.latestOrder.productName }}</td>
                  <th class="text-left p-2 bg-[#f9f9f9] border-x border-[#ddd]">訂單日期</th>
                  <td class="p-2">{{ d.latestOrder.date }}</td>
                </tr>
                <tr class="border-b border-[#ddd]">
                  <th class="text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">說明</th>
                  <td colspan="4" class="p-2">{{ d.latestOrder.description }}</td>
                </tr>
                <tr class="border-b border-[#ddd]">
                  <th class="text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">功能清單</th>
                  <td colspan="4" class="p-2">
                    <table class="w-full text-[10px] border border-[#eee]">
                      <thead>
                        <tr class="bg-[#eee]">
                          <th colspan="2" class="p-1 text-left border-r border-white">功能</th>
                          <th class="p-1 text-left border-r border-white">敘述</th>
                          <th class="p-1 text-left">數量</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="m in d.latestOrder.modules" :key="m.id" class="border-b border-[#eee]">
                          <td class="p-1 border-r border-[#eee]">{{ m.id }}</td>
                          <td class="p-1 border-r border-[#eee]">{{ m.name }}</td>
                          <td class="p-1 border-r border-[#eee]">{{ m.desc }}</td>
                          <td class="p-1">{{ m.qty }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Nested Table: Burned Features -->
          <tr v-if="expandedBurned.has(d.id) && d.burnedFeatures" class="bg-[#fdfdfd]">
            <td colspan="1"></td>
            <td colspan="5" class="p-4 border border-[#ccc]">
              <div class="font-bold text-black mb-2">目前已燒錄</div>
              <table class="w-full text-xs border-collapse border border-[#ddd]">
                <!-- Similar logic to Latest Order table -->
                <tr class="border-b border-[#ddd]">
                  <th class="w-24 text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">關聯訂單</th>
                  <td colspan="4" class="p-2 text-blue-700 underline">{{ d.burnedFeatures.label }}</td>
                </tr>
                <tr class="border-b border-[#ddd]">
                  <th class="text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">產品</th>
                  <td class="p-2 font-mono">{{ d.burnedFeatures.product }}</td>
                  <td class="p-2">{{ d.burnedFeatures.productName }}</td>
                  <th class="text-left p-2 bg-[#f9f9f9] border-x border-[#ddd]">訂單日期</th>
                  <td class="p-2">{{ d.burnedFeatures.date }}</td>
                </tr>
                <tr class="border-b border-[#ddd]">
                  <th class="text-left p-2 bg-[#f9f9f9] border-r border-[#ddd]">功能清單</th>
                  <td colspan="4" class="p-2">
                    <table class="w-full text-[10px] border border-[#eee]">
                      <thead>
                        <tr class="bg-[#eee]">
                          <th colspan="2" class="p-1 text-left">功能</th>
                          <th class="p-1 text-left">敘述</th>
                          <th class="p-1 text-left">數量</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="m in d.burnedFeatures.modules" :key="m.id" class="border-b border-[#eee]">
                          <td class="p-1">{{ m.id }}</td>
                          <td class="p-1">{{ m.name }}</td>
                          <td class="p-1">{{ m.desc }}</td>
                          <td class="p-1">{{ m.qty }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </LegacyLayout>
</template>

<style scoped>
.legacy-table th {
  font-weight: bold;
}
</style>
