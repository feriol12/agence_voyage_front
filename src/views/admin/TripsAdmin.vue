<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">✈️ Voyages</h1>
      <AppButton variant="primary" @click="openCreateModal">
        + Nouveau voyage
      </AppButton>
    </div>

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
    <div v-if="tripStore.meta && tripStore.meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <button
        v-for="page in tripStore.meta.last_page"
        :key="page"
        @click="tripStore.fetchTrips(page)"
        class="px-3 py-1 rounded-lg border transition-colors"
        :class="page === tripStore.meta.current_page
          ? 'bg-[#0F3B5C] text-white border-[#0F3B5C]'
          : 'bg-white text-[#1E293B] border-[#CBD5E1] hover:bg-gray-50'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Modale -->
    <TripFormModal
      v-model:isOpen="isModalOpen"
      :trip="selectedTrip"
      :destinations="destinations"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTripStore } from '@/stores/useTripStore'
import { useDestinationStore } from '@/stores/useDestinationStore'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import TripFormModal from '@/components/trips/TripFormModal.vue'

const tripStore = useTripStore()
const destinationStore = useDestinationStore()
const isModalOpen = ref(false)
const selectedTrip = ref(null)
const destinations = ref([])

onMounted(async () => {
  await Promise.all([
    tripStore.fetchTrips(),
    destinationStore.fetchDestinations()
  ])
  destinations.value = destinationStore.destinations
})

const openCreateModal = () => {
  selectedTrip.value = null
  isModalOpen.value = true
}

const openEditModal = (trip) => {
  selectedTrip.value = trip
  isModalOpen.value = true
}

const confirmDelete = async (trip) => {
  if (confirm(`Supprimer le voyage "${trip.title}" ?`)) {
    const result = await tripStore.deleteTrip(trip.id)
    if (result.success) {
      tripStore.fetchTrips()
    } else {
      alert(result.message)
    }
  }
}

const onSaved = async (tripData) => {
  let result
  if (tripData.id) {
    result = await tripStore.updateTrip(tripData.id, tripData)
  } else {
    result = await tripStore.createTrip(tripData)
  }

  if (result.success) {
    tripStore.fetchTrips()
  } else {
    alert(result.message)
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
