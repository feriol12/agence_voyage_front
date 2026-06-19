<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">🌍 Destinations</h1>
      <AppButton variant="primary" @click="openCreateModal"> + Nouvelle destination </AppButton>
    </div>
    <!-- Barre de recherche moderne -->
    <SearchBar
      :search-query="store.searchQuery"
      :loading="store.loading"
      :active-continent="store.activeContinent"
      :active-status="store.activeStatus"
      @search="onSearch"
      @reset="onResetSearch"
      @filter-continent="onFilterContinent"
      @filter-status="onFilterStatus"
      @reset-filters="onResetAllFilters"
    />

    <!-- État chargement -->
    <div v-if="store.loading" class="text-center py-8 text-gray-500">Chargement...</div>

    <!-- État erreur -->
    <div v-else-if="store.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ store.error }}
      <AppButton variant="outline" @click="store.fetchDestinations()" class="ml-4">
        Réessayer
      </AppButton>
    </div>

    <!-- Aucune donnée -->
    <div v-else-if="store.destinations.length === 0" class="text-center py-8 text-gray-500">
      Aucune destination. Créez-en une !
    </div>

    <!-- Liste des destinations -->
    <div class="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AppCard v-for="dest in store.destinations" :key="dest.id" class="overflow-hidden">
        <!-- Image en haut -->
        <div class="relative w-full h-44 bg-gray-100 overflow-hidden">
          <img
            v-if="dest.image_url"
            :src="dest.image_url"
            :alt="dest.name"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center text-[#94A3B8]"
          >
            <PhotoIcon class="h-12 w-12" />
            <span class="mt-1 text-xs font-medium">Aucune image</span>
          </div>
        </div>
        <div class="flex items-start justify-between gap-1">
          <h3 class="font-semibold text-sm sm:text-base text-[#1E293B] truncate">
            {{ dest.name }}
          </h3>
          <div class="flex flex-col items-end gap-0.5">
            <AppSwitch
              :modelValue="dest.is_active"
              @toggle="toggleActive(dest)"
              class="scale-75 sm:scale-100"
            />
            <span
              class="text-[10px] sm:text-xs"
              :class="dest.is_active ? 'text-[#27AE60]' : 'text-[#94A3B8]'"
            >
              {{ dest.is_active ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-[#64748B] mt-1 truncate">{{ dest.country }}</p>
        <p v-if="dest.continent" class="text-[10px] sm:text-xs text-[#94A3B8]">
          {{ dest.continent }}
        </p>

        <div class="mt-2 flex flex-wrap gap-1">
          <AppBadge
            :variant="dest.visa_required ? 'warning' : 'success'"
            class="text-[10px] sm:text-xs px-1.5 py-0.5"
          >
            {{ dest.visa_required ? 'Visa requis' : 'Visa non requis' }}
          </AppBadge>
        </div>

        <p v-if="dest.description" class="text-xs text-[#64748B] mt-2 line-clamp-2 hidden sm:block">
          {{ dest.description }}
        </p>

        <div class="mt-3 flex justify-end gap-3 border-t border-gray-100 pt-2">
          <button
            @click="openEditModal(dest)"
            class="flex items-center gap-1 text-xs sm:text-sm text-[#64748B] transition-colors hover:text-[#0F3B5C]"
          >
            <PencilSquareIcon class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span class="hidden sm:inline">Modifier</span>
          </button>
          <button
            @click="confirmDelete(dest)"
            class="flex items-center gap-1 text-xs sm:text-sm text-[#64748B] transition-colors hover:text-[#E74C3C]"
          >
            <TrashIcon class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span class="hidden sm:inline">Supprimer</span>
          </button>
        </div>
      </AppCard>
    </div>

    <!-- Pagination avec le nouveau composant -->
    <AppPagination
      :current-page="store.meta.current_page"
      :last-page="store.meta.last_page"
      :per-page="perPage"
      @update:per-page="onPerPageChange"
      @page-changed="onPageChanged"
    />

    <!-- Modale -->
    <DestinationFormModal
      v-model:isOpen="isModalOpen"
      :destination="selectedDestination"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDestinationStore } from '@/stores/useDestinationStore'
import { useConfirmStore } from '@/stores/useConfirmStore'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppSwitch from '@/components/common/AppSwitch.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import DestinationFormModal from '@/components/destinations/DestinationFormModal.vue'
import SearchBar from '@/components/common/SearchBar.vue'
// import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { PhotoIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const store = useDestinationStore()
const confirmStore = useConfirmStore()
const isModalOpen = ref(false)
const selectedDestination = ref(null)
const perPage = ref(store.meta.per_page || 9)

const onFilterContinent = (continent) => {
  store.filterByContinent(continent)
}

const onFilterStatus = (status) => {
  store.filterByStatus(status)
}

const onResetAllFilters = () => {
  store.resetFilters()
}

const onSearch = (search) => {
  store.searchDestinations(search)
}

const onResetSearch = () => {
  store.resetSearch()
}

// Navigation
const onPageChanged = (page, perPageValue) => {
  console.log('onPageChanged reçu:', page, perPageValue) // Debug
  // Nettoie avant d'envoyer
  const cleanPage = parseInt(page, 10) || 1
  const cleanPerPage = parseInt(perPageValue, 10) || 9
  store.fetchDestinations(cleanPage, cleanPerPage)
}

const onPerPageChange = (newPerPage) => {
  console.log('onPerPageChange reçu:', newPerPage) // Debug
  const cleanPerPage = parseInt(newPerPage, 10) || 9
  perPage.value = cleanPerPage
  store.fetchDestinations(1, cleanPerPage)
}

const openCreateModal = () => {
  selectedDestination.value = null
  isModalOpen.value = true
}

const openEditModal = (dest) => {
  selectedDestination.value = dest
  isModalOpen.value = true
}

const toggleActive = async (dest) => {
  await store.toggleActive(dest.id, !dest.is_active)
}

const confirmDelete = (dest) => {
  confirmStore.showConfirm({
    title: 'Supprimer la destination',
    message: `Êtes-vous sûr de vouloir supprimer "${dest.name}" ? Cette action est irréversible.`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    confirmVariant: 'danger',
    onConfirm: async () => {
      await store.deleteDestination(dest.id)
    },
  })
}

const onSaved = () => {
  isModalOpen.value = false
  store.fetchDestinations(store.meta.current_page, perPage.value)
}

// Responsive
const handleResize = () => {
  const width = window.innerWidth
  let newPerPage = 9
  if (width < 640) newPerPage = 6
  else if (width < 1024) newPerPage = 9
  else newPerPage = 12

  if (newPerPage !== perPage.value) {
    perPage.value = newPerPage
    store.setPerPage(newPerPage)
  }
}

onMounted(() => {
  store.fetchDestinations(1, perPage.value)
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
