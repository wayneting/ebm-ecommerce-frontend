<script setup lang="ts">
import { computed } from 'vue'
import LegacyLayout from '@/layouts/LegacyLayout.vue'
import { useAuthStore } from '@/stores/auth_v2'

const auth = useAuthStore()

const user = computed(() => auth.user)

function formatMoney(n?: number) {
  return 'NT ' + (n || 0).toLocaleString()
}
</script>

<template>
  <LegacyLayout>
    <h2 class="text-[1.5em] font-bold text-black border-b border-[#ccc] pb-1 mb-4 italic">帳戶設定</h2>

    <div class="mb-4">
      <input 
        type="button" 
        value="修改帳號資訊" 
        class="px-2 py-1 bg-[#efefef] border border-[#767676] rounded-sm text-sm cursor-pointer hover:bg-[#e5e5e5]"
      >
      <span class="mx-1 text-[#ccc]">|</span>
      <input 
        type="button" 
        value="變更密碼" 
        class="px-2 py-1 bg-[#efefef] border border-[#767676] rounded-sm text-sm cursor-pointer hover:bg-[#e5e5e5]"
      >
      <span class="mx-1 text-[#ccc]">|</span>
      <input 
        type="button" 
        value="自訂產品套裝" 
        class="px-2 py-1 bg-[#efefef] border border-[#767676] rounded-sm text-sm cursor-pointer hover:bg-[#e5e5e5]"
      >
    </div>

    <fieldset class="border border-[#ccc] p-4 rounded-sm">
      <legend class="px-2 font-bold text-sm">帳號資訊</legend>
      <table class="w-full text-sm border-collapse">
        <tbody>
          <tr>
            <th class="w-[150px] text-left py-2 pr-4 font-bold border-b border-[#eee]">
              <label>帳號</label>
            </th>
            <td class="py-2 border-b border-[#eee]">{{ user?.userId || '---' }}</td>
          </tr>
          <tr>
            <th class="text-left py-2 pr-4 font-bold border-b border-[#eee]">
              <label>顯示名稱</label>
            </th>
            <td class="py-2 border-b border-[#eee]">{{ user?.displayName || '---' }}</td>
          </tr>
          <tr>
            <th class="text-left py-2 pr-4 font-bold border-b border-[#eee]">
              <label>聯絡電話</label>
            </th>
            <td class="py-2 border-b border-[#eee]">{{ user?.phone || '---' }}</td>
          </tr>
          <tr>
            <th class="text-left py-2 pr-4 font-bold border-b border-[#eee]">
              <label>Email信箱</label>
            </th>
            <td class="py-2 border-b border-[#eee]">
              <a :href="`mailto:${user?.email}`" class="text-blue-700 hover:underline">
                {{ user?.email || '---' }}
              </a>
            </td>
          </tr>
          <tr>
            <th class="text-left py-2 pr-4 font-bold border-b border-[#eee]">
              <label>儲值金額</label>
            </th>
            <td class="py-2 border-b border-[#eee]">{{ formatMoney(user?.prepaidBalance) }}</td>
          </tr>
          <tr>
            <th class="text-left py-2 pr-4 font-bold border-b border-[#eee]">
              <label>使用語系</label>
            </th>
            <td class="py-2 border-b border-[#eee]">
              {{ user?.language === 'zh-TW' ? '繁體中文(zh_TW)' : 'English(en_US)' }}
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  </LegacyLayout>
</template>

<style scoped>
/* 模擬舊版 ASP.NET FieldSet 與 Table 樣式 */
fieldset {
  margin-top: 1em;
}
th {
  background-color: #f9f9f9;
  padding: 8px;
}
td {
  padding: 8px;
}
</style>
