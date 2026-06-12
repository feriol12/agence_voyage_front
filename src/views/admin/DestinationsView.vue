<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">🌍 Destinations</h1>
      <AppButton variant="primary" @click="openCreateModal">
        + Nouvelle destination
      </AppButton>
    </div>
    
    <!-- État chargement -->
    <div v-if="store.loading" class="text-center py-8 text-gray-500">
      Chargement...
    </div>
    
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
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AppCard v-for="dest in store.destinations" :key="dest.id">
        <div class="flex items-start justify-between">
          <h3 class="font-semibold text-lg text-[#1E293B]">{{ dest.name }}</h3>
          <div class="flex flex-col items-end gap-1">
            <AppSwitch :modelValue="dest.is_active" @toggle="toggleActive(dest)" />
            <span class="text-xs" :class="dest.is_active ? 'text-[#27AE60]' : 'text-[#94A3B8]'">
              {{ dest.is_active ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>
        
        <p class="text-sm text-[#64748B] mt-1">{{ dest.country }}</p>
        <p v-if="dest.continent" class="text-xs text-[#94A3B8]">{{ dest.continent }}</p>
        
        <div class="mt-3 flex flex-wrap gap-2">
          <AppBadge :variant="dest.visa_required ? 'warning' : 'success'">
            {{ dest.visa_required ? 'Visa requis' : 'Visa non requis' }}
          </AppBadge>
        </div>
        
        <p v-if="dest.description" class="text-sm text-[#64748B] mt-3 line-clamp-2">
          {{ dest.description }}
        </p>
        
        <div class="mt-3 flex justify-end gap-3 border-t border-gray-100 pt-3">
          <button @click="openEditModal(dest)" class="text-sm text-[#64748B] hover:text-[#0F3B5C] transition-colors">
            ✏️ Modifier
          </button>
          <button @click="confirmDelete(dest)" class="text-sm text-[#64748B] hover:text-[#E74C3C] transition-colors">
            🗑️ Supprimer
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

const store = useDestinationStore()
const confirmStore = useConfirmStore()
const isModalOpen = ref(false)
const selectedDestination = ref(null)
const perPage = ref(store.meta.per_page || 9)

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
    }
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