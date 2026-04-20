<script setup lang="ts">
/**
 * EbmModal — 對話框（Teleport + 背景遮罩）
 */
interface Props {
  open: boolean
  title?: string
  subtitle?: string
  maxWidth?: string // tailwind class, e.g. 'max-w-md'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'max-w-md',
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  close: []
}>()

function onBackdrop() {
  if (props.closeOnBackdrop) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150"
      leave-active-class="transition duration-150"
      enter-from-class="opacity-0" leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(11, 36, 71, 0.5)"
        @click.self="onBackdrop"
      >
        <div :class="['bg-white rounded-xl shadow-ebm-hover w-full', maxWidth]">
          <div v-if="title || $slots.header" class="px-6 py-5 border-b border-ebm-border flex justify-between items-center">
            <div>
              <slot name="header">
                <h3 class="text-lg font-bold text-ebm-primary">{{ title }}</h3>
                <p v-if="subtitle" class="text-xs text-ebm-text-muted mt-0.5">{{ subtitle }}</p>
              </slot>
            </div>
            <button
              class="text-ebm-text-muted hover:text-ebm-primary transition-colors"
              @click="emit('close')"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 max-h-[70vh] overflow-y-auto">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 bg-ebm-bg border-t border-ebm-border rounded-b-xl flex justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
