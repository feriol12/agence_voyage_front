<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="badgeClass"
  >
    <span v-if="dot" class="mr-1.5 h-2 w-2 rounded-full" :class="dotClass" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'gray',
    validator: (value) => ['success', 'warning', 'danger', 'info', 'purple', 'gray'].includes(value)
  },
  dot: {
    type: Boolean,
    default: false
  }
})

const badgeClass = computed(() => {
  const variants = {
    success: 'bg-[#27AE60]/10 text-[#27AE60]',
    warning: 'bg-[#F39C12]/10 text-[#F39C12]',
    danger: 'bg-[#E74C3C]/10 text-[#E74C3C]',
    info: 'bg-[#3498DB]/10 text-[#3498DB]',
    purple: 'bg-[#8E44AD]/10 text-[#8E44AD]',
    gray: 'bg-[#F1F5F9] text-[#64748B]'
  }
  return variants[props.variant]
})

const dotClass = computed(() => {
  const dots = {
    success: 'bg-[#27AE60]',
    warning: 'bg-[#F39C12]',
    danger: 'bg-[#E74C3C]',
    info: 'bg-[#3498DB]',
    purple: 'bg-[#8E44AD]',
    gray: 'bg-[#64748B]'
  }
  return dots[props.variant]
})
</script>