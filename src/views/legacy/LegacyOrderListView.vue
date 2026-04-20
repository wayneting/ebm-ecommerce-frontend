<script setup lang="ts">
import { ref } from 'vue'
import LegacyLayout from '@/layouts/LegacyLayout.vue'

const orders = ref([
  {
    id: '00010605',
    date: '2026/04/08 14:43:02',
    currency: 'NT',
    total: 1620,
    payment: '匯款',
    status: '已付款',
    dongleId: '8000001'
  }
])

function formatNum(n: number) {
  return n.toLocaleString()
}
</script>

<template>
  <LegacyLayout>
    <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">訂單列表</h2>

    <table class="w-full text-sm border-collapse border border-[#ccc]">
      <thead>
        <tr class="bg-[#f2f2f2]">
          <th class="border border-[#ccc] p-2 text-left">訂單編號</th>
          <th class="border border-[#ccc] p-2 text-left">訂購日期</th>
          <th colspan="2" class="border border-[#ccc] p-2 text-left">總價</th>
          <th class="border border-[#ccc] p-2 text-left">付款方式</th>
          <th class="border border-[#ccc] p-2 text-left">訂單狀態</th>
          <th class="border border-[#ccc] p-2 text-left">關聯Dongle</th>
          <th class="border border-[#ccc] p-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td class="border border-[#ccc] p-2">{{ o.id }}</td>
          <td class="border border-[#ccc] p-2">{{ o.date }}</td>
          <td class="border border-[#ccc] p-2 w-8">{{ o.currency }}</td>
          <td class="border border-[#ccc] p-2 text-right">{{ formatNum(o.total) }}</td>
          <td class="border border-[#ccc] p-2">{{ o.payment }}</td>
          <td class="border border-[#ccc] p-2">{{ o.status }}</td>
          <td class="border border-[#ccc] p-2">{{ o.dongleId }}</td>
          <td class="border border-[#ccc] p-2 text-center text-blue-700">
            <a href="#" class="hover:underline">查看內容</a>
          </td>
        </tr>
      </tbody>
    </table>
  </LegacyLayout>
</template>

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
转换
