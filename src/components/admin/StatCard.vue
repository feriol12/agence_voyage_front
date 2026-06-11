<template>
  <CardSimple :variant="variant" :padding="'md'" :bordered="true" :custom-class="customClass">
    <div class="flex items-center justify-between">
      <!-- Gauche : icône -->
      <div :class="[
        'w-12 h-12 rounded-full flex items-center justify-center',
        iconBgClass
      ]">
        <component :is="icon" :class="['w-6 h-6', iconColorClass]" />
      </div>

      <!-- Droite : valeur et label -->
      <div class="text-right">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
      </div>
    </div>

    <!-- Footer optionnel (tendance) -->
    <div v-if="trend" class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between text-xs">
        <div :class="trendClass">
          <span v-if="trend > 0">↑ {{ trend }}%</span>
          <span v-else-if="trend < 0">↓ {{ Math.abs(trend) }}%</span>
          <span v-else>= 0%</span>
          <span class="text-gray-500 ml-1">par rapport au mois dernier</span>
        </div>
      </div>
    </div>
  </CardSimple>
</template>

<script setup>
import { computed } from 'vue'
import CardSimple from '@/components/admin/CardSimple.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: [Object, String],
    required: true
  },
  variant: {
    type: String,
    default: 'default'
  },
  trend: {
    type: Number,
    default: null
  },
  customClass: {
    type: String,
    default: ''
  }
})

// Classes pour l'icône
const iconBgMap = {
  default: 'bg-gray-100 dark:bg-gray-700',
  primary: 'bg-blue-100 dark:bg-blue-900/30',
  success: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  danger: 'bg-red-100 dark:bg-red-900/30',
  gradient: 'bg-white/20'
}

const iconBgClass = computed(() => iconBgMap[props.variant] || iconBgMap.default)

const iconColorMap = {
  default: 'text-gray-600 dark:text-gray-300',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  gradient: 'text-white'
}

const iconColorClass = computed(() => iconColorMap[props.variant] || iconColorMap.default)

const trendClass = computed(() => {
  if (props.trend > 0) return 'text-green-600'
  if (props.trend < 0) return 'text-red-600'
  return 'text-gray-500'
})
</script>
