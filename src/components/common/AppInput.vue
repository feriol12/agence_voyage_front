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

    <!-- Input / Textarea / Select -->
    <component 
      :is="tag"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="inputClass"
      @input="handleInput"
      @blur="handleBlur"
    >
      <option v-if="tag === 'select' && placeholder" value="">{{ placeholder }}</option>
      <slot />
    </component>

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
  // Valeur du champ
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  
  // Label
  label: {
    type: String,
    default: ''
  },
  
  // Type de champ (text, email, password, number, tel, url, textarea, select, checkbox, radio)
  type: {
    type: String,
    default: 'text'
  },
  
  // Placeholder
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
  },
  
  // Pour textarea : nombre de lignes
  rows: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// ID unique pour l'accessibilité
const id = useId()

// Détermine le tag HTML à utiliser
const tag = computed(() => {
  if (props.type === 'textarea') return 'textarea'
  if (props.type === 'select') return 'select'
  return 'input'
})

// Classes du label
const labelClass = computed(() => {
  const classes = {
    default: 'text-[#1E293B]',
    filled: 'text-[#1E293B]',
    flushed: 'text-[#1E293B]'
  }
  return classes[props.variant]
})

// Classes de l'input
const inputClass = computed(() => {
  // Taille
  const sizes = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  }

  // Style de base
  const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed'
  
  // Variant
  const variants = {
    default: 'border border-[#CBD5E1] bg-white focus:border-[#E67E22] focus:ring-[#E67E22]/20',
    filled: 'border-0 bg-[#F1F5F9] focus:bg-white focus:ring-2 focus:ring-[#E67E22]',
    flushed: 'border-0 border-b border-[#CBD5E1] rounded-none bg-transparent focus:border-[#E67E22] focus:ring-0'
  }

  // État erreur
  const errorClass = props.error 
    ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20' 
    : ''

  return `${baseClasses} ${sizes[props.size]} ${variants[props.variant]} ${errorClass}`
})

// Gestion des événements
const handleInput = (event) => {
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