<script setup lang="ts">
/**
 * EbmBadge — 語意化狀態標籤
 */
type Variant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary'

interface Props {
  variant?: Variant
  dot?: boolean
  pulse?: boolean // dot 是否閃動
}

withDefaults(defineProps<Props>(), { variant: 'neutral', dot: false, pulse: false })

const variantClass: Record<Variant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error:   'bg-red-100 text-red-800',
  info:    'bg-sky-100 text-sky-800',
  neutral: 'bg-slate-100 text-slate-600',
  primary: 'bg-blue-100 text-blue-800',
}
const dotColor: Record<Variant, string> = {
  success: 'bg-ebm-success',
  warning: 'bg-ebm-warning',
  error:   'bg-ebm-error',
  info:    'bg-ebm-info',
  neutral: 'bg-ebm-text-muted',
  primary: 'bg-ebm-primary',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClass[variant],
    ]"
  >
    <span
      v-if="dot"
      :class="['h-1.5 w-1.5 rounded-full', dotColor[variant], pulse && 'animate-pulse']"
    />
    <slot />
  </span>
</template>
