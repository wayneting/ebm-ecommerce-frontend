<script setup lang="ts">
import { ref, computed } from 'vue'
import LegacyLayout from '@/layouts/LegacyLayout.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const expandedItems = ref<Set<string>>(new Set())

function toggleDetails(key: string) {
  if (expandedItems.value.has(key)) expandedItems.value.delete(key)
  else expandedItems.value.add(key)
  expandedItems.value = new Set(expandedItems.value)
}

function formatNum(n: number) {
  return n.toLocaleString()
}

function remove(key: string) {
  if (confirm('確定要將此項移出購物車嗎?')) {
    cartStore.remove(key)
  }
}
</script>

<template>
  <LegacyLayout>
    <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">購物車-訂購清單</h2>

    <div v-if="cartStore.items.length === 0" class="p-10 text-center text-gray-500 italic">
      您的購物車目前是空的。
    </div>

    <table v-else class="w-full text-sm border-collapse border border-[#ccc]">
      <thead>
        <tr class="bg-[#f2f2f2]">
          <th class="border border-[#ccc] p-2"></th>
          <th colspan="2" class="border border-[#ccc] p-2 text-left">產品</th>
          <th class="border border-[#ccc] p-2 text-left">序號</th>
          <th class="border border-[#ccc] p-2 text-left">類型</th>
          <th colspan="2" class="border border-[#ccc] p-2 text-right">價格</th>
          <th class="border border-[#ccc] p-2 text-left">說明</th>
          <th class="border border-[#ccc] p-2"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in cartStore.items" :key="item.cartItemId">
          <tr>
            <td class="border border-[#ccc] p-2 text-center text-blue-700 text-xs">
              <a href="javascript:void(0)" @click="toggleDetails(item.cartItemId)">顯示細節</a>
              |
              <router-link :to="`/legacy/products/${item.productId}/configure`" class="hover:underline">編輯</router-link>
            </td>
            <td class="border border-[#ccc] p-2 font-mono">{{ item.productId }}</td>
            <td class="border border-[#ccc] p-2">{{ item.productName }}</td>
            <td class="border border-[#ccc] p-2 font-mono">{{ item.serialNumber || '---' }}</td>
            <td class="border border-[#ccc] p-2">
              {{ item.purchaseType === 'buyout' ? '新購 - 買斷' : '新購 - 以日計費' }}
            </td>
            <td class="border border-[#ccc] p-2 w-8">NT</td>
            <td class="border border-[#ccc] p-2 text-right font-bold">{{ formatNum(item.totalPrice) }}</td>
            <td class="border border-[#ccc] p-2 text-xs">
              <div v-if="item.purchaseType === 'subscription'">
                購買日數: {{ item.duration }}天
              </div>
            </td>
            <td class="border border-[#ccc] p-2 text-center">
              <input 
                type="button" 
                value="移除" 
                class="px-2 py-0.5 bg-[#efefef] border border-[#767676] rounded-sm text-xs cursor-pointer"
                @click="remove(item.cartItemId)"
              >
            </td>
          </tr>

          <!-- Nested Details -->
          <tr v-show="expandedItems.has(item.cartItemId)">
            <td></td>
            <td colspan="7" class="p-4 border border-[#ccc] bg-[#f9f9f9]">
              <table class="w-full text-xs border-collapse border border-[#ddd] bg-white">
                <thead>
                  <tr class="bg-[#eee]">
                    <th class="p-1 border border-[#ddd] text-left">ID</th>
                    <th class="p-1 border border-[#ddd] text-left">名稱</th>
                    <th class="p-1 border border-[#ddd] text-left">敘述</th>
                    <th class="p-1 border border-[#ddd] text-right">數量</th>
                    <th colspan="2" class="p-1 border border-[#ddd] text-right">單價</th>
                    <th colspan="2" class="p-1 border border-[#ddd] text-right">小計</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sel in item.moduleSelections.filter(s => s.selected || s.isNecessary)" :key="sel.moduleId">
                    <td class="p-1 border border-[#ddd] font-mono">{{ sel.moduleId }}</td>
                    <td class="p-1 border border-[#ddd]">{{ sel.moduleName }}</td>
                    <td class="p-1 border border-[#ddd] text-gray-500">{{ sel.moduleDescription }}</td>
                    <td class="p-1 border border-[#ddd] text-right">{{ sel.quantity }}</td>
                    <td class="p-1 border-y border-[#ddd] w-4 uppercase">NT</td>
                    <td class="p-1 border border-[#ddd] text-right">{{ formatNum(sel.unitPrice || 0) }}</td>
                    <td class="p-1 border-y border-[#ddd] w-4 uppercase">NT</td>
                    <td class="p-1 border border-[#ddd] text-right font-bold">{{ formatNum((sel.unitPrice || 0) * (sel.quantity || 1)) }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-if="cartStore.items.length > 0" class="mt-4 flex justify-between items-center bg-[#f2f2f2] p-4 border border-[#ccc]">
       <div class="text-sm font-bold">總金額</div>
       <div class="text-xl font-bold flex items-baseline gap-2">
         <span class="text-sm">NT</span>
         <span>{{ formatNum(cartStore.totalPrice) }}</span>
       </div>
    </div>

    <div v-if="cartStore.items.length > 0" class="mt-4 text-right">
       <router-link to="/legacy/checkout" class="px-6 py-2 bg-blue-700 text-white font-bold hover:bg-blue-800 rounded-sm">
         確認訂單 →
       </router-link>
    </div>
  </LegacyLayout>
</template>

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
转换
