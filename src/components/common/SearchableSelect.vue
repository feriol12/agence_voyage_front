<template>
  <div class="relative" v-click-outside="closeDropdown">
    <!-- Champ de recherche -->
    <input
      ref="inputRef"
      type="text"
      v-model="searchTerm"
      @focus="openDropdown"
      @input="onInput"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C] disabled:bg-gray-100 disabled:cursor-not-allowed"
    />

    <!-- Dropdown des résultats -->
    <div
      v-if="isOpen && filteredOptions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        @click="selectOption(option)"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
        :class="{ 'bg-[#0F3B5C]/10': selectedValue === option.value }"
      >
        <div class="flex flex-col">
          <span class="font-medium text-[#1E293B]">{{ option.label }}</span>
          <span v-if="option.subtitle" class="text-xs text-[#64748B]">{{ option.subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <div
      v-if="isOpen && searchTerm && filteredOptions.length === 0"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-center text-gray-500 text-sm"
    >
      Aucun résultat trouvé
    </div>

    <!-- Indicateur de chargement -->
    <div
      v-if="loading"
      class="absolute right-3 top-2.5"
    >
      <div class="animate-spin h-4 w-4 border-2 border-[#0F3B5C] border-t-transparent rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Rechercher...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const inputRef = ref(null)
const isOpen = ref(false)
const searchTerm = ref('')
const selectedValue = ref(props.modelValue)

// Trouver le libellé de l'option sélectionnée
const selectedLabel = computed(() => {
  if (!selectedValue.value) return ''
  const option = props.options.find(opt => opt.value === selectedValue.value)
  return option ? option.label : ''
})

// Mettre à jour searchTerm quand la valeur sélectionnée change
watch(selectedLabel, (newLabel) => {
  if (newLabel && !isOpen.value) {
    searchTerm.value = newLabel
  }
}, { immediate: true })

// Filtrer les options
const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.options

  const term = searchTerm.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(term) ||
    (opt.subtitle && opt.subtitle.toLowerCase().includes(term))
  )
})

// Ouvrir le dropdown
const openDropdown = () => {
  if (props.disabled) return
  isOpen.value = true
  if (!selectedLabel.value) {
    searchTerm.value = ''
  }
}

// Fermer le dropdown
const closeDropdown = () => {
  isOpen.value = false
  // Restaurer le libellé sélectionné
  if (selectedValue.value) {
    searchTerm.value = selectedLabel.value
  } else {
    searchTerm.value = ''
  }
}

// Sélectionner une option
const selectOption = (option) => {
  selectedValue.value = option.value
  searchTerm.value = option.label
  isOpen.value = false
  emit('update:modelValue', option.value)
}

// Gérer la frappe (déclencher la recherche)
const onInput = () => {
  emit('search', searchTerm.value)
}

// Exposer la méthode de fermeture (pour utilisation parent)
defineExpose({
  closeDropdown
})
</script>

<!-- Directive v-click-outside -->
<script>
// Directive pour fermer au clic en dehors
export const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
}
</script>
