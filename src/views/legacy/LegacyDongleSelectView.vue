<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LegacyLayout from '@/layouts/LegacyLayout.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.productId as string

const dongles = ref([
  {
    id: '8000001',
    status: '在購物車',
    latestLabel: '00010605(新購-以日計費，已付款，尚未燒錄)',
    burnedLabel: '00000004(新購-以日計費，已付款，已燒錄)'
  }
])

const expandedLatest = ref<Set<string>>(new Set())
const expandedBurned = ref<Set<string>>(new Set())

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

function goConfig(dongleId: string) {
  router.push(`/legacy/products/${productId}/configure?serial=${dongleId}`)
}
</script>

<template>
  <LegacyLayout>
    <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">選擇Dongle</h2>

    <h3 class="text-base font-bold text-black mb-4">請由列表中選擇要新購/升級的Dongle</h3>

    <table class="w-full text-sm border-collapse border border-[#ccc]">
      <thead>
        <tr class="bg-[#f2f2f2]">
          <th class="border border-[#ccc] p-2">新購/升級產品</th>
          <th class="border border-[#ccc] p-2">序號</th>
          <th class="border border-[#ccc] p-2">狀態</th>
          <th class="border border-[#ccc] p-2">最近訂單</th>
          <th class="border border-[#ccc] p-2">目前燒錄</th>
          <th class="border border-[#ccc] p-2">訂單紀錄</th>
          <th class="border border-[#ccc] p-2">備註</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="d in dongles" :key="d.id">
          <tr>
            <td class="border border-[#ccc] p-2 text-center">
               <button 
                 class="px-2 py-0.5 bg-[#efefef] border border-[#767676] rounded-sm text-xs cursor-pointer hover:bg-[#e5e5e5]"
                 @click="goConfig(d.id)"
               >
                 選擇
               </button>
            </td>
            <td class="border border-[#ccc] p-2 text-center">{{ d.id }}</td>
            <td class="border border-[#ccc] p-2 text-center">{{ d.status }}</td>
            <td class="border border-[#ccc] p-2 text-center text-blue-700">
               <a href="javascript:void(0)" @click="toggleLatest(d.id)">顯示最近訂單</a>
            </td>
            <td class="border border-[#ccc] p-2 text-center text-blue-700">
               <a href="javascript:void(0)" @click="toggleBurned(d.id)">顯示目前已燒錄功能</a>
            </td>
            <td class="border border-[#ccc] p-2 text-center text-blue-700">
               <a href="javascript:void(0)">顯示所有關聯訂單</a>
            </td>
            <td class="border border-[#ccc] p-2 text-center">
               <button class="px-2 py-0.5 bg-[#efefef] border border-[#767676] rounded-sm text-xs">編輯</button>
            </td>
          </tr>

          <!-- Expandable Rows (Simplified Replica) -->
          <tr v-if="expandedLatest.has(d.id)">
            <td colspan="1"></td>
            <td colspan="6" class="p-4 bg-[#f9f9f9] border border-[#ccc]">
              <div class="font-bold mb-1">最近的訂單</div>
              <div class="text-xs text-blue-700 underline">{{ d.latestLabel }}</div>
            </td>
          </tr>
          <tr v-if="expandedBurned.has(d.id)">
            <td colspan="1"></td>
            <td colspan="6" class="p-4 bg-[#f9f9f9] border border-[#ccc]">
              <div class="font-bold mb-1">目前已燒錄</div>
              <div class="text-xs text-blue-700 underline">{{ d.burnedLabel }}</div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="mt-4">
       <button 
         class="px-2 py-1 bg-[#efefef] border border-[#767676] rounded-sm text-sm"
         @click="goConfig('EvaluationDongle')"
       >
         價格試算(不實際購買)
       </button>
    </div>
  </LegacyLayout>
</template>

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
