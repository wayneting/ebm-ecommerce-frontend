<script setup lang="ts">
import { ref } from 'vue'
import EbmButton from '@/components/ui/EbmButton.vue'
import EbmCard from '@/components/ui/EbmCard.vue'
import EbmInput from '@/components/ui/EbmInput.vue'

const userID = ref('ebm_admin')
const email = ref('')
const emailError = ref('')

function validateEmail() {
  if (!email.value) {
    emailError.value = 'Email 是必填'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Email 格式不正確'
  } else {
    emailError.value = ''
  }
}

const loading = ref(false)
async function simulateLoading() {
  loading.value = true
  await new Promise((r) => setTimeout(r, 1500))
  loading.value = false
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="mb-10">
      <div class="text-ebm-accent text-sm font-semibold uppercase tracking-widest mb-2">
        Vue 3 Components
      </div>
      <h1 class="text-4xl font-extrabold text-ebm-primary tracking-tight mb-3">
        EBM UI Kit · 快速測試頁
      </h1>
      <p class="text-lg text-ebm-text-muted">
        這一頁示範 3 個核心 Vue 元件（EbmButton / EbmCard / EbmInput）。
        完整 11 章設計規範請看
        <a
          href="/components.html"
          target="_blank"
          class="text-ebm-accent font-semibold hover:underline"
        >components.html</a>（和此專案並排放的 Living Styleguide）。
      </p>
    </div>

    <!-- EbmButton -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-ebm-primary mb-4">EbmButton</h2>
      <EbmCard>
        <div class="space-y-5">
          <div>
            <div class="text-xs text-ebm-text-muted uppercase tracking-wider mb-2">Variants</div>
            <div class="flex flex-wrap gap-3">
              <EbmButton variant="primary">Primary</EbmButton>
              <EbmButton variant="secondary">Secondary</EbmButton>
              <EbmButton variant="ghost">Ghost</EbmButton>
            </div>
          </div>
          <div>
            <div class="text-xs text-ebm-text-muted uppercase tracking-wider mb-2">Sizes</div>
            <div class="flex flex-wrap items-center gap-3">
              <EbmButton size="sm">Small</EbmButton>
              <EbmButton size="md">Medium</EbmButton>
              <EbmButton size="lg">Large</EbmButton>
            </div>
          </div>
          <div>
            <div class="text-xs text-ebm-text-muted uppercase tracking-wider mb-2">States</div>
            <div class="flex flex-wrap gap-3">
              <EbmButton>Default</EbmButton>
              <EbmButton disabled>Disabled</EbmButton>
              <EbmButton :loading="loading" @click="simulateLoading">
                {{ loading ? '處理中' : '點我 Loading' }}
              </EbmButton>
            </div>
          </div>
        </div>
      </EbmCard>
    </section>

    <!-- EbmCard -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-ebm-primary mb-4">EbmCard</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EbmCard>
          <div class="text-sm text-ebm-text-muted uppercase tracking-wider">Default</div>
          <div class="text-xl font-bold text-ebm-primary mt-2">靜態卡片</div>
          <p class="text-sm text-ebm-text-muted mt-2">
            一般資訊展示用，有淺淺的 shadow-ebm。
          </p>
        </EbmCard>
        <EbmCard hoverable>
          <div class="text-sm text-ebm-text-muted uppercase tracking-wider">Hoverable</div>
          <div class="text-xl font-bold text-ebm-primary mt-2">互動卡片</div>
          <p class="text-sm text-ebm-text-muted mt-2">
            滑過會浮起（-translate-y-0.5）+ 陰影加深。
          </p>
        </EbmCard>
      </div>
    </section>

    <!-- EbmInput -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-ebm-primary mb-4">EbmInput</h2>
      <EbmCard>
        <div class="space-y-6 max-w-md">
          <EbmInput
            v-model="userID"
            label="使用者帳號"
            helper="請輸入員工帳號或 Email"
            required
          />
          <EbmInput
            v-model="email"
            type="email"
            label="電子郵件"
            required
            :error="emailError"
            helper="我們會寄驗證信到此信箱"
            placeholder="you@hospital.com"
            @blur="validateEmail"
          />
          <EbmInput
            label="唯讀範例"
            model-value="PROD001"
            readonly
          />
          <EbmInput
            label="停用範例"
            disabled
            placeholder="無法編輯"
          />
        </div>
      </EbmCard>
    </section>

    <!-- Component → Skill mapping -->
    <section>
      <EbmCard>
        <h3 class="text-lg font-bold text-ebm-primary mb-2">💡 開發備忘</h3>
        <ul class="text-sm text-ebm-text-muted space-y-1.5 list-disc list-inside">
          <li>新元件命名一律以 <code class="font-mono text-ebm-primary">Ebm</code> 開頭</li>
          <li>tokens 在 <code class="font-mono text-ebm-primary">src/assets/main.css</code> 用 <code class="font-mono text-ebm-primary">@theme</code>（Tailwind v4 CSS-first）</li>
          <li>design 規範變動 → 先改 components.html → 再同步進 Vue 元件</li>
          <li>元件要支援 Vue 3 Composition + TypeScript，禁用 Options API</li>
        </ul>
      </EbmCard>
    </section>
  </div>
</template>
