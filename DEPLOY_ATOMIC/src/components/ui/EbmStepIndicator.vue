<script setup lang="ts">
/**
 * EbmStepIndicator — 水平步驟指示器
 * 搬自 components.html Ch06.4（IPQN Step Indicator）
 */
export interface Step {
  id: string | number
  title: string
  description?: string
}

interface Props {
  steps: Step[]
  currentIndex: number // 0-based, 最後完成的步驟 index（current = 進行中）
}

const props = defineProps<Props>()

function statusOf(idx: number): 'completed' | 'active' | 'upcoming' {
  if (idx < props.currentIndex) return 'completed'
  if (idx === props.currentIndex) return 'active'
  return 'upcoming'
}
</script>

<template>
  <div class="flex items-start justify-between max-w-3xl mx-auto">
    <template v-for="(step, idx) in steps" :key="step.id">
      <!-- Step node -->
      <div class="flex flex-col items-center flex-1 min-w-0">
        <div
          v-if="statusOf(idx) === 'completed'"
          class="h-10 w-10 rounded-full flex items-center justify-center text-white bg-ebm-success"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div
          v-else-if="statusOf(idx) === 'active'"
          class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold bg-ebm-cta"
          style="box-shadow: 0 0 0 4px rgba(247,110,17,0.2)"
        >
          {{ idx + 1 }}
        </div>
        <div
          v-else
          class="h-10 w-10 rounded-full flex items-center justify-center font-bold bg-ebm-bg border-2 border-ebm-border text-ebm-text-muted"
        >
          {{ idx + 1 }}
        </div>
        <div
          :class="[
            'text-sm font-semibold mt-3 text-center',
            statusOf(idx) === 'upcoming' ? 'text-ebm-text-muted' : 'text-ebm-primary',
          ]"
        >
          {{ step.title }}
        </div>
        <div
          v-if="step.description"
          :class="[
            'text-xs mt-0.5 text-center',
            statusOf(idx) === 'active' ? 'text-ebm-cta font-semibold' : 'text-ebm-text-muted',
          ]"
        >
          {{ step.description }}
        </div>
      </div>

      <!-- Line -->
      <div
        v-if="idx < steps.length - 1"
        :class="[
          'flex-1 h-0.5 mt-5 mx-2',
          idx < currentIndex ? 'bg-ebm-success' : 'bg-ebm-border',
        ]"
      />
    </template>
  </div>
</template>
