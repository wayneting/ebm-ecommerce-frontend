<script setup lang="ts">
import { computed, useId } from 'vue'

/**
 * EbmInput — 基於 Ch04 Form Controls 的通用輸入元件
 * 支援 label / helper / error / required / disabled
 * 支援 v-model（自動雙向綁定）
 */
interface Props {
  modelValue?: string | number
  label?: string
  helper?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = useId()
const hasError = computed(() => !!props.error)

const inputClass = computed(() => [
  'w-full px-4 py-2.5 rounded-lg border text-sm transition-all',
  'focus:outline-none focus:ring-4',
  hasError.value
    ? 'border-ebm-error focus:ring-ebm-error/15'
    : 'border-ebm-border focus:border-ebm-accent focus:ring-ebm-accent/15',
  props.disabled && 'bg-ebm-bg text-ebm-text-muted cursor-not-allowed',
  props.readonly && 'bg-ebm-bg',
])

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-semibold text-ebm-primary mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-ebm-error">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :class="inputClass"
      @input="onInput"
    >

    <p
      v-if="error"
      class="text-xs text-ebm-error mt-1.5 flex items-center gap-1"
    >
      <svg
        class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="helper" class="text-xs text-ebm-text-muted mt-1.5">
      {{ helper }}
    </p>
  </div>
</template>
