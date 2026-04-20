<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import EbmInput from '@/components/ui/EbmInput.vue'
import EbmButton from '@/components/ui/EbmButton.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const userId = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await auth.login(userId.value, password.value)
    
    // 登入成功後跳轉。優先去當初被擋下的頁面，或首頁。
    const redirectPath = (route.query.redirect as string) || '/app'
    router.push(redirectPath)
  } catch (e: any) {
    error.value = '登入失敗，請檢查帳號密碼'
  }
}
</script>

<template>
  <div class="min-h-screen bg-ebm-background flex items-center justify-center p-6 bg-gradient-to-br from-ebm-background to-blue-50">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-ebm-border overflow-hidden animate-in fade-in zoom-in duration-500">
      <!-- Header / Logo Area -->
      <div class="bg-ebm-primary p-8 text-center">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">EBM Technologies</h1>
        <p class="text-blue-100 mt-2 font-medium">電子商務平台管理系統</p>
      </div>

      <!-- Form Area -->
      <form class="p-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="p-3 bg-ebm-error/10 border border-ebm-error/20 text-ebm-error text-sm rounded-lg text-center font-medium">
          {{ error }}
        </div>

        <div class="space-y-4">
          <EbmInput
            v-model="userId"
            label="使用者帳號"
            placeholder="請輸入 UserID"
            required
            autocomplete="username"
          />

          <EbmInput
            v-model="password"
            label="登入密碼"
            type="password"
            placeholder="請輸入密碼"
            required
            autocomplete="current-password"
          />
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer text-ebm-text-muted hover:text-ebm-primary transition-colors">
            <input type="checkbox" class="rounded border-ebm-border text-ebm-primary focus:ring-ebm-primary" />
            記住我
          </label>
          <a href="#" class="text-ebm-primary font-semibold hover:underline">忘記密碼？</a>
        </div>

        <EbmButton
          type="submit"
          variant="primary"
          class="w-full h-12 text-lg shadow-lg shadow-ebm-primary/20"
          :loading="auth.loading"
        >
          立即登入
        </EbmButton>

        <div class="pt-6 border-t border-ebm-border text-center">
          <p class="text-xs text-ebm-text-muted leading-relaxed">
            此系統為商之器科技內部專用，<br />
            登入即代表您同意相關安全與隱私條款。
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 微過渡動畫 */
.animate-in {
  animation: animate-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
