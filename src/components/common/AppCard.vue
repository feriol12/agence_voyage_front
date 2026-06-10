<template>
  <div
    class="rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
    :class="[
      { 'cursor-pointer hover:scale-[1.02]': clickable },
      paddingClass
    ]"
    @click="clickable && $emit('click')"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  clickable: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['click'])

const paddingClass = computed(() => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  }
  return paddings[props.padding]
})
</script>