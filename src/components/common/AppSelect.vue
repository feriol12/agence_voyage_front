<template>
  <div class="w-full">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="id"
      class="mb-1.5 block text-sm font-medium"
      :class="labelClass"
    >
      {{ label }}
      <span v-if="required" class="text-[#E74C3C] ml-0.5">*</span>
    </label>

    <!-- Select -->
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :class="selectClass"
      @change="handleChange"
      @blur="handleBlur"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Message d'erreur -->
    <p v-if="error" class="mt-1 text-xs text-[#E74C3C] animate-fadeIn">
      {{ error }}
    </p>

    <!-- Message d'aide -->
    <p v-if="hint && !error" class="mt-1 text-xs text-[#94A3B8]">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  // Valeur du select
  modelValue: {
    type: [String, Number],
    default: ''
  },
  
  // Label
  label: {
    type: String,
    default: ''
  },
  
  // Liste des options [{ value: 'fr', label: 'France' }, ...]
  options: {
    type: Array,
    required: true,
    validator: (value) => value.every(opt => 'value' in opt && 'label' in opt)
  },
  
  // Placeholder (option vide par défaut)
  placeholder: {
    type: String,
    default: ''
  },
  
  // Message d'erreur
  error: {
    type: String,
    default: ''
  },
  
  // Message d'aide
  hint: {
    type: String,
    default: ''
  },
  
  // Rendu requis
  required: {
    type: Boolean,
    default: false
  },
  
  // Désactivé
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Variation de taille (sm, md, lg)
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Variation de style (default, filled, flushed)
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'filled', 'flushed'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// ID unique pour l'accessibilité
const id = useId()

// Classes du label
const labelClass = computed(() => {
  const classes = {
    default: 'text-[#1E293B]',
    filled: 'text-[#1E293B]',
    flushed: 'text-[#1E293B]'
  }
  return classes[props.variant]
})

// Classes du select
const selectClass = computed(() => {
  // Tailles
  const sizes = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  }

  // Style de base
  const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-no-repeat'
  
  // Flèche personnalisée (down arrow)
  const arrowClass = "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 20 20\\'%3E%3Cpath stroke=\\'%2364748B\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'m6 8 4 4 4-4\\' /%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] pr-8"

  // Variants
  const variants = {
    default: `border border-[#CBD5E1] bg-white focus:border-[#E67E22] focus:ring-[#E67E22]/20 ${arrowClass}`,
    filled: `border-0 bg-[#F1F5F9] focus:bg-white focus:ring-2 focus:ring-[#E67E22] ${arrowClass}`,
    flushed: `border-0 border-b border-[#CBD5E1] rounded-none bg-transparent focus:border-[#E67E22] focus:ring-0 ${arrowClass}`
  }

  // État erreur
  const errorClass = props.error 
    ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20' 
    : ''

  return `${baseClasses} ${sizes[props.size]} ${variants[props.variant]} ${errorClass}`
})

// Gestion des événements
const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>