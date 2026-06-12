<template>
  <button
    type="button"
    :class="switchClass"
    :disabled="disabled"
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:ring-offset-2"
    @click="$emit('toggle')"
  >
    <span
      :class="knobClass"
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'update:modelValue'])

const switchClass = computed(() => {
  return props.modelValue
    ? 'bg-[#27AE60]'  // Vert quand actif
    : 'bg-[#CBD5E1]'  // Gris quand inactif
})

const knobClass = computed(() => {
  return props.modelValue
    ? 'translate-x-5'  // Cercle à droite (actif)
    : 'translate-x-0'  // Cercle à gauche (inactif)
})
</script>