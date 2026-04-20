<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth_v2'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmInput from '@/components/ui/EbmInput.vue'
import EbmButton from '@/components/ui/EbmButton.vue'

const auth = useAuthStore()

const displayName = ref(auth.user?.displayName ?? '')
const email = ref(auth.user?.email ?? '')
const phone = ref(auth.user?.phone ?? '')
const language = ref<'zh-TW' | 'en-US'>(auth.user?.language ?? 'zh-TW')
const saving = ref(false)
const saved = ref(false)

watch(
  () => auth.user,
  (u) => {
    if (u) {
      displayName.value = u.displayName
      email.value = u.email
      phone.value = u.phone
      language.value = u.language
    }
  },
  { immediate: true },
)

async function save() {
  saving.value = true
  await new Promise((r) => setTimeout(r, 500))
  if (auth.user) {
    auth.user.displayName = displayName.value
    auth.user.email = email.value
    auth.user.phone = phone.value
    auth.user.language = language.value
  }
  saving.value = false
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

const fmt = (n: number) => 'NT$ ' + n.toLocaleString()
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <header class="mb-8">
      <div class="text-ebm-accent text-sm font-semibold uppercase tracking-widest mb-1">帳戶</div>
      <h1 class="text-3xl font-extrabold text-ebm-primary tracking-tight">帳戶設定</h1>
    </header>

    <div class="space-y-6">
      <EbmCard>
        <h3 class="text-lg font-bold text-ebm-primary mb-4">基本資料</h3>
        <div class="space-y-4 max-w-md">
          <EbmInput
            label="使用者帳號"
            :model-value="auth.user?.userId"
            readonly
            helper="帳號無法修改"
          />
          <EbmInput v-model="displayName" label="顯示名稱" required />
          <EbmInput v-model="email" type="email" label="Email 信箱" required />
          <EbmInput v-model="phone" label="聯絡電話" />
          <div>
            <label class="block text-sm font-semibold text-ebm-primary mb-1.5">使用語系</label>
            <div class="relative">
              <select
                v-model="language"
                class="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-ebm-border text-sm focus:outline-none focus:border-ebm-accent focus:ring-4 focus:ring-ebm-accent/15"
              >
                <option value="zh-TW">繁體中文（zh_TW）</option>
                <option value="en-US">English (en_US)</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <EbmButton variant="primary" :loading="saving" @click="save">
              {{ saving ? '儲存中...' : '儲存變更' }}
            </EbmButton>
            <span v-if="saved" class="text-sm text-ebm-success">已儲存</span>
          </div>
        </div>
      </EbmCard>

      <EbmCard>
        <h3 class="text-lg font-bold text-ebm-primary mb-4">儲值金</h3>
        <div class="flex justify-between items-center">
          <div>
            <div class="text-xs text-ebm-text-muted uppercase tracking-wider">目前餘額</div>
            <div class="text-3xl font-black text-ebm-primary font-mono mt-1">
              {{ fmt(auth.user?.prepaidBalance ?? 0) }}
            </div>
          </div>
          <EbmButton variant="secondary">加值</EbmButton>
        </div>
      </EbmCard>
    </div>
  </div>
</template>
