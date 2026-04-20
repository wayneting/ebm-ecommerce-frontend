<script setup lang="ts">
/**
 * EbmButton — 基於 cpq-design-language skill 的 Ch03 Buttons 規範實作
 *
 * 4 variants × 5 states × 3 sizes
 * 支援 loading（自動 disabled + spinner）
 */
interface Props {
  variant?: 'primary' | 'secondary' | 'outline-white' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  fullWidth: false,
})

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'bg-ebm-cta text-white hover:bg-ebm-cta-hover hover:shadow-ebm-cta hover:-translate-y-px',
  secondary:
    'border-2 border-ebm-border text-ebm-primary bg-transparent hover:border-ebm-primary',
  'outline-white':
    'border-2 border-white text-white bg-transparent hover:bg-white hover:text-ebm-primary',
  ghost: 'text-ebm-text-muted hover:bg-ebm-bg hover:text-ebm-primary',
}

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-4 py-2 text-xs rounded-md',
  md: 'px-6 py-3 text-sm rounded-lg',
  lg: 'px-8 py-4 text-base rounded-lg',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'font-semibold transition-all inline-flex items-center justify-center gap-2',
      variantClass[variant],
      sizeClass[size],
      fullWidth && 'w-full',
      (disabled || loading) && 'opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
      loading && 'cursor-wait',
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor" stroke-opacity="0.3" stroke-width="3"
      />
      <path
        d="M12 2a10 10 0 0110 10"
        stroke="currentColor" stroke-width="3" stroke-linecap="round"
      />
    </svg>
    <slot />
  </button>
</template>
