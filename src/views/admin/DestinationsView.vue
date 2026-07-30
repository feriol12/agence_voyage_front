<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">🌍 Destinations</h1>
      <AppButton variant="primary" @click="openCreateModal"> + Nouvelle destination </AppButton>
    </div>

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

    <div v-if="store.loading" class="text-center py-8 text-gray-500">Chargement...</div>

    <div v-else-if="store.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ store.error }}
      <AppButton variant="outline" @click="store.fetchDestinations()" class="ml-4">
        Réessayer
      </AppButton>
    </div>

    <div v-else-if="store.destinations.length === 0" class="text-center py-8 text-gray-500">
      Aucune destination. Créez-en une !
    </div>

    <!-- Liste des destinations -->
    <div class="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AppCard v-for="dest in store.destinations" :key="dest.id" class="overflow-hidden flex flex-col">
        <!-- Carrousel avec ratio carré sur mobile -->
        <ImageCarousel :images="dest.images || []" :interval="4000" />

        <!-- Contenu compact -->
        <div class="p-2 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-semibold text-xs sm:text-base text-[#1E293B] truncate">
              {{ dest.name }}
            </h3>
            <p class="text-[10px] sm:text-sm text-[#64748B] mt-0.5 truncate">{{ dest.country }}</p>
            <p v-if="dest.continent" class="text-[9px] sm:text-xs text-[#94A3B8]">
              {{ dest.continent }}
            </p>
          </div>

          <div class="mt-1 flex flex-wrap gap-1">
            <AppBadge
              :variant="dest.visa_required ? 'warning' : 'success'"
              class="text-[8px] sm:text-xs px-1 py-0.5"
            >
              {{ dest.visa_required ? 'Visa requis' : 'Visa non requis' }}
            </AppBadge>
          </div>

          <div class="mt-1.5 flex items-center justify-between border-t border-gray-100 pt-1.5">
            <button
              @click="openDocumentModal(dest)"
              class="flex items-center gap-0.5 text-[10px] sm:text-sm text-[#0F3B5C] hover:text-[#E67E22] transition-colors"
            >
              <span>Détail</span>
            </button>

            <div class="flex gap-1.5 sm:gap-3">
              <button
                @click="openEditModal(dest)"
                class="flex items-center gap-0.5 text-[10px] sm:text-sm text-[#64748B] hover:text-[#E67E22] transition-colors"
              >
                <PencilSquareIcon class="h-3 w-3 sm:h-4 sm:w-4" />
                <span class="hidden sm:inline">Modifier</span>
              </button>
              <button
                @click="confirmDelete(dest)"
                class="flex items-center gap-0.5 text-[10px] sm:text-sm text-[#64748B] hover:text-[#E74C3C] transition-colors"
              >
                <TrashIcon class="h-3 w-3 sm:h-4 sm:w-4" />
                <span class="hidden sm:inline">Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <AppPagination
      :current-page="store.meta.current_page"
      :last-page="store.meta.last_page"
      :per-page="perPage"
      @update:per-page="onPerPageChange"
      @page-changed="onPageChanged"
    />

    <DestinationFormModal
      v-model:isOpen="isModalOpen"
      :destination="selectedDestination"
      @saved="onSaved"
    />

    <DestinationDocumentModal
      v-model:isOpen="isDocumentModalOpen"
      :destination="selectedDestinationForDocs"
      @saved="onDocumentSaved"
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
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import DestinationDocumentModal from '@/components/destinations/DestinationDocumentModal.vue'
import ImageCarousel from '@/components/common/ImageCarousel.vue'

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

const isDocumentModalOpen = ref(false)
const selectedDestinationForDocs = ref(null)

const openDocumentModal = (dest) => {
  selectedDestinationForDocs.value = dest
  isDocumentModalOpen.value = true
}

const onDocumentSaved = () => {
  store.fetchDestinations()
}

const onPageChanged = (page, perPageValue) => {
  const cleanPage = parseInt(page, 10) || 1
  const cleanPerPage = parseInt(perPageValue, 10) || 9
  store.fetchDestinations(cleanPage, cleanPerPage)
}

const onPerPageChange = (newPerPage) => {
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