<template>
  <div class="mb-8 space-y-4">
    <!-- Barre de recherche -->
    <div class="relative">
      <MagnifyingGlassIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />

      <input
        v-model="localSearch"
        type="text"
        placeholder="Rechercher un voyage (titre ou référence)..."
        class="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-11 pr-12 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#E67E22] focus:outline-none focus:ring-2 focus:ring-[#E67E22]/20 transition-all duration-200"
        @input="handleAutoSearch"
      />

      <button
        v-if="localSearch.length > 0"
        @click="handleClear"
        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#94A3B8] transition-all hover:bg-gray-100 hover:text-[#E74C3C]"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Badge résultat -->
    <div v-if="searchQuery && !loading" class="flex items-center gap-2 text-sm">
      <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E67E22]/10 text-[#E67E22]">🔍</span>
      <span class="text-[#64748B]">Résultats pour : <span class="font-medium text-[#1E293B]">"{{ searchQuery }}"</span></span>
    </div>

    <!-- Filtres -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mr-1">Filtrer</span>

      <!-- Filtre Statut -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          @click="handleStatusFilter(filter.value)"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
          :class="activeStatus === filter.value
            ? 'bg-[#E67E22] text-white shadow-sm'
            : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'"
        >
          <component :is="filter.icon" class="h-3.5 w-3.5" />
          {{ filter.label }}
        </button>
      </div>

      <span class="mx-1 h-4 w-px bg-[#E2E8F0]"></span>

      <!-- Filtre Actif/Inactif -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="filter in activeFilters"
          :key="filter.value"
          @click="handleActiveFilter(filter.value)"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
          :class="activeStatusFilter === filter.value
            ? 'bg-[#E67E22] text-white shadow-sm'
            : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'"
        >
          <component :is="filter.icon" class="h-3.5 w-3.5" />
          {{ filter.label }}
        </button>
      </div>

      <button
        @click="handleResetAll"
        class="ml-2 text-xs text-[#94A3B8] hover:text-[#E74C3C] transition-colors"
      >
        ✕ Réinitialiser
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon, GlobeAltIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  searchQuery: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  activeStatus: { type: String, default: '' },
  activeStatusFilter: { type: String, default: '' }
})

const emit = defineEmits(['search', 'reset', 'filterStatus', 'filterActive', 'resetFilters'])

// Recherche
const localSearch = ref(props.searchQuery)

// ✅ WATCH pour émettre automatiquement quand la recherche change
watch(localSearch, (newValue) => {
  console.log('🔵 watch localSearch:', newValue)
  emit('update:search-query', newValue)
  emit('search', newValue)
})

const handleAutoSearch = () => {
  console.log('🔵 handleAutoSearch:', localSearch.value)
  // Le watch va déjà émettre, mais on garde pour la compatibilité
}

const handleClear = () => {
  localSearch.value = ''
  // Le watch va émettre avec ''
}

// Filtres pour status
const statusFilters = [
  { label: 'Tous', value: '', icon: GlobeAltIcon },
  { label: 'Disponible', value: 'disponible', icon: CheckCircleIcon },
  { label: 'Complet', value: 'complet', icon: XCircleIcon },
  { label: 'Fermé', value: 'ferme', icon: XCircleIcon }
]

// Filtres pour is_active
const activeFilters = [
  { label: 'Tous', value: '', icon: GlobeAltIcon },
  { label: 'Actifs', value: '1', icon: CheckCircleIcon },
  { label: 'Inactifs', value: '0', icon: XCircleIcon }
]

const activeStatus = ref(props.activeStatus)
const activeStatusFilter = ref(props.activeStatusFilter)

const handleStatusFilter = (value) => {
  console.log('🔵 handleStatusFilter:', value)
  activeStatus.value = value
  emit('filterStatus', value)
}

const handleActiveFilter = (value) => {
  console.log('🔵 handleActiveFilter:', value)
  activeStatusFilter.value = value
  emit('filterActive', value)
}

const handleResetAll = () => {
  console.log('🔵 handleResetAll')
  activeStatus.value = ''
  activeStatusFilter.value = ''
  localSearch.value = ''
  emit('resetFilters')
  // Le watch va émettre search avec ''
}

// Synchronisation avec les props
watch(() => props.activeStatus, (newVal) => { activeStatus.value = newVal })
watch(() => props.activeStatusFilter, (newVal) => { activeStatusFilter.value = newVal })
watch(() => props.searchQuery, (newVal) => { localSearch.value = newVal })
</script>
