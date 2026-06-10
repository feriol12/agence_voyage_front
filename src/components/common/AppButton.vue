<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'outline'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClass = computed(() => {
  const variants = {
    primary: 'bg-[#0F3B5C] text-white hover:bg-[#0A2A42] focus:ring-[#0F3B5C]',
    secondary: 'bg-[#E67E22] text-white hover:bg-[#D35400] focus:ring-[#E67E22]',
    danger: 'bg-[#E74C3C] text-white hover:bg-[#C0392B] focus:ring-[#E74C3C]',
    success: 'bg-[#27AE60] text-white hover:bg-[#1E8449] focus:ring-[#27AE60]',
    outline: 'border border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-gray-50 focus:ring-[#CBD5E1]'
  }
  return variants[props.variant]
})
</script>