<script setup lang="ts">
/**
 * EbmCard — 基於 Ch05 Cards 的通用卡片容器
 */
interface Props {
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  padding: 'md',
})

const paddingClass = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border border-ebm-border transition-all',
      paddingClass[padding],
      hoverable && 'hover:shadow-ebm-hover hover:-translate-y-0.5 hover:border-transparent cursor-pointer',
      !hoverable && 'shadow-ebm',
    ]"
  >
    <slot />
  </div>
</template>
