<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">✈️ Voyages</h1>
      <AppButton variant="primary" @click="openCreateModal">
        + Nouveau voyage
      </AppButton>
    </div>


      <!-- 🔥 FILTRES TRIPS -->
   <!-- 🔥 FILTRES TRIPS -->
<TripFilters
  v-model:search-query="searchQuery"
  v-model:active-status="activeStatus"
  v-model:active-status-filter="activeStatusFilter"
  :loading="tripStore.loading"
  @search="onSearch"
  @filterStatus="onFilterStatus"
  @filterActive="onFilterActive"
/>


    <!-- État chargement -->
    <div v-if="tripStore.loading" class="text-center py-8 text-gray-500">
      Chargement...
    </div>

    <!-- État erreur -->
    <div v-else-if="tripStore.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ tripStore.error }}
      <AppButton variant="outline" @click="tripStore.fetchTrips()" class="ml-4">
        Réessayer
      </AppButton>
    </div>

    <!-- Aucune donnée -->
    <div v-else-if="tripStore.trips.length === 0" class="text-center py-8 text-gray-500">
      Aucun voyage. Créez-en un !
    </div>

    <!-- Liste des voyages -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AppCard v-for="trip in tripStore.trips" :key="trip.id">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-lg text-[#1E293B]">{{ trip.title }}</h3>
            <p class="text-sm text-[#64748B]">Destination ID: {{ trip.destination_id}} ||{{ trip.destination.name }}</p>
            <p class="text-xs text-[#94A3B8] mt-1">Réf: {{ trip.reference }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="openEditModal(trip)"
              class="text-[#64748B] hover:text-[#0F3B5C] transition-colors"
            >
              ✏️
            </button>
            <button
              @click="confirmDelete(trip)"
              class="text-[#64748B] hover:text-[#E74C3C] transition-colors"
            >
              🗑️
            </button>
            <button
              @click="openDateModal(trip)"
              class="text-[#64748B] hover:text-[#0F3B5C] transition-colors"
              title="Gérer les dates"
            >
            📅
          </button>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <AppBadge :variant="statusVariant(trip.status)">
            {{ statusLabel(trip.status) }}
          </AppBadge>
          <AppBadge :variant="trip.is_active ? 'success' : 'gray'">
            {{ trip.is_active ? 'Actif' : 'Inactif' }}
          </AppBadge>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="text-[#64748B]">Durée:</span>
            <span class="font-medium ml-1">{{ trip.duration_days }} jours</span>
          </div>
          <div>
            <span class="text-[#64748B]">Places:</span>
            <span class="font-medium ml-1">{{ trip.capacity }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-[#64748B]">Prix:</span>
            <span class="font-bold text-[#0F3B5C] ml-1">{{ formatPrice(trip.base_price) }}</span>
          </div>
        </div>

        <p v-if="trip.description" class="text-sm text-[#64748B] mt-3 line-clamp-2">
          {{ trip.description }}
        </p>
      </AppCard>
    </div>




   
   <!-- Pagination -->
<AppPagination
  v-if="tripStore.meta && tripStore.meta.last_page > 1"
  :current-page="tripStore.meta.current_page"
  :last-page="tripStore.meta.last_page"
  :per-page="perPage"
  @page-changed="onPageChanged"
  @update:per-page="onPerPageChanged"
/>




    <!-- Modale -->
    <TripFormModal
      v-model:isOpen="isModalOpen"
      :trip="selectedTrip"
      :destinations="destinations"
      @saved="onSaved"
    />
  </div>

  <!-- Modale des dates -->
<TripDateModal
  v-model:isOpen="isDateModalOpen"
  :trip="selectedTripForDates"
  @saved="onDateSaved"
/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTripStore } from '@/stores/useTripStore'
import { useDestinationStore } from '@/stores/useDestinationStore'
import { useToastStore } from '@/stores/useToastStore'
import { useConfirmStore } from '@/stores/useConfirmStore'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import TripFormModal from '@/components/trips/TripFormModal.vue'
import TripDateModal from '@/components/trips/TripDateModal.vue'
import TripFilters from '@/components/trips/TripFilters.vue'
import AppPagination from '@/components/common/AppPagination.vue'

const tripStore = useTripStore()
const destinationStore = useDestinationStore()
const toastStore = useToastStore()
const confirmStore = useConfirmStore()

// États des modales
const isModalOpen = ref(false)
const selectedTrip = ref(null)
const destinations = ref([])
const isDateModalOpen = ref(false)
const selectedTripForDates = ref(null)

// 🔥 État pour le nombre d'éléments par page
const perPage = ref(3)

// 🔥 États des filtres
const searchQuery = ref('')
const activeStatus = ref('')
const activeStatusFilter = ref('')

// 🔥 Appliquer les filtres
const applyFilters = () => {

   console.log('🔵 applyFilters - searchQuery:', searchQuery.value)
  console.log('🔵 applyFilters - activeStatus:', activeStatus.value)
  console.log('🔵 applyFilters - activeStatusFilter:', activeStatusFilter.value)

  tripStore.fetchTrips({
    page: 1,
    search: searchQuery.value,
    status: activeStatus.value,
    is_active: activeStatusFilter.value
  })
}
// 🔥 Méthodes pour chaque filtre
const onSearch = (value) => {
  console.log('🔵 onSearch:', value)
  searchQuery.value = value
  applyFilters()
}

const onFilterStatus = (value) => {
  console.log('🔵 onFilterStatus:', value)
  activeStatus.value = value
  applyFilters()
}

const onFilterActive = (value) => {
  console.log('🔵 onFilterActive:', value)
  activeStatusFilter.value = value
  applyFilters()
}


// 🔥 Pagination avec filtres
const goToPage = (page) => {
  tripStore.fetchTrips({
    page: page,
    search: searchQuery.value,
    status: activeStatus.value,
    is_active: activeStatusFilter.value
  })
}


// 🔥 Changement de page
const onPageChanged = (page, perPageValue) => {
  console.log('🔵 onPageChanged:', { page, perPage: perPageValue })

  // Mettre à jour perPage si nécessaire
  if (perPageValue !== perPage.value) {
    perPage.value = perPageValue
  }

  tripStore.fetchTrips({
    page: page,
    per_page: perPageValue,
    search: searchQuery.value,
    status: activeStatus.value,
    is_active: activeStatusFilter.value
  })
}

// 🔥 Changement du nombre d'éléments par page
const onPerPageChanged = (newPerPage) => {
  console.log('🔵 onPerPageChanged:', newPerPage)
  perPage.value = newPerPage
  // La pagination sera mise à jour automatiquement via @page-changed
}
// 🔥 UN SEUL onMounted (fusionner les deux)
onMounted(async () => {
  await Promise.all([
    tripStore.fetchTrips({
      page: 1,
      per_page: perPage.value
    }),
    destinationStore.fetchDestinations()
  ])
  destinations.value = destinationStore.destinations
})

// Modales
const openDateModal = (trip) => {
  selectedTripForDates.value = trip
  isDateModalOpen.value = true
}

const onDateSaved = () => {
  // Rafraîchir la liste des voyages si besoin
  // applyFilters()
}

const openCreateModal = () => {
  selectedTrip.value = null
  isModalOpen.value = true
}

const openEditModal = (trip) => {
  selectedTrip.value = trip
  isModalOpen.value = true
}

const confirmDelete = (trip) => {
  confirmStore.showConfirm({
    title: 'Supprimer le voyage',
    message: `Voulez-vous vraiment supprimer "${trip.title}" ? Cette action est irréversible.`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      const result = await tripStore.deleteTrip(trip.id)
      if (result.success) {
        toastStore.showToast('success', 'Voyage supprimé avec succès')
        applyFilters()  // ← utilise applyFilters au lieu de fetchTrips()
      } else {
        toastStore.showToast('error', 'Erreur lors de la suppression du voyage')
      }
    }
  })
}

const onSaved = async (tripData) => {
  let result
  if (tripData.id) {
    result = await tripStore.updateTrip(tripData.id, tripData)
  } else {
    result = await tripStore.createTrip(tripData)
  }

  if (result.success) {
    const successMessage = tripData.id ? 'Voyage modifié avec succès' : 'Voyage créé avec succès'
    toastStore.showToast('success', successMessage)
    applyFilters()  // ← utilise applyFilters au lieu de fetchTrips()
  } else {
    toastStore.showToast('error', 'Une erreur est survenue')
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

const statusVariant = (status) => {
  const variants = {
    'disponible': 'success',
    'complet': 'warning',
    'ferme': 'danger'
  }
  return variants[status] || 'gray'
}

const statusLabel = (status) => {
  const labels = {
    'disponible': 'Disponible',
    'complet': 'Complet',
    'ferme': 'Fermé'
  }
  return labels[status] || status
}
</script>



