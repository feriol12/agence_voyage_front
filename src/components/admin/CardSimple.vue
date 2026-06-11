<template>
  <div :class="[
    'bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200',
    paddingClasses,
    borderClasses,
    customClass
  ]">
    <!-- En-tête optionnel -->
    <div v-if="$slots.header || title" :class="['border-b border-gray-100 dark:border-gray-700', headerPaddingClasses]">
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
          <slot name="header-actions" />
        </div>
      </slot>
    </div>

    <!-- Contenu principal -->
    <div :class="contentPaddingClasses">
      <slot />
    </div>

    <!-- Pied de page optionnel -->
    <div v-if="$slots.footer" :class="['border-t border-gray-100 dark:border-gray-700', footerPaddingClasses]">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Variantes de style
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'gradient'].includes(value)
  },
  // Padding
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  // Titre (si pas de slot header)
  title: {
    type: String,
    default: ''
  },
  // Bordure
  bordered: {
    type: Boolean,
    default: true
  },
  // Classes personnalisées
  customClass: {
    type: String,
    default: ''
  }
})

// Classes de padding
const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6'
}

const paddingClasses = computed(() => paddingMap[props.padding] || paddingMap.md)
const headerPaddingClasses = computed(() => props.padding === 'none' ? 'px-4 py-3' : `${paddingMap[props.padding]} pb-0`)
const contentPaddingClasses = computed(() => props.padding === 'none' ? 'p-4' : paddingMap[props.padding])
const footerPaddingClasses = computed(() => props.padding === 'none' ? 'px-4 py-3' : `${paddingMap[props.padding]} pt-0`)

// Classes de bordure
const borderClasses = computed(() => {
  if (!props.bordered) return ''

  const variantMap = {
    default: 'border border-gray-200 dark:border-gray-700',
    primary: 'border border-blue-200 dark:border-blue-800',
    success: 'border border-green-200 dark:border-green-800',
    warning: 'border border-yellow-200 dark:border-yellow-800',
    danger: 'border border-red-200 dark:border-red-800',
    gradient: 'border border-gray-200 dark:border-gray-700'
  }
  return variantMap[props.variant] || variantMap.default
})

// Classes de fond pour la variante
const bgClass = computed(() => {
  const variantMap = {
    default: 'bg-white dark:bg-gray-800',
    primary: 'bg-blue-50 dark:bg-blue-900/20',
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    danger: 'bg-red-50 dark:bg-red-900/20',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
  }
  return variantMap[props.variant] || variantMap.default
})
</script>
