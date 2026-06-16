<template>
  <div class="p-6">
    <!-- En-tête -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">📋 Inscriptions clients</h1>
      <AppButton variant="primary" @click="openCreateModal">
        + Nouvelle inscription
      </AppButton>
    </div>

    <!-- Filtres -->
    <div class="mb-6 flex flex-wrap gap-3 items-center">
      <select v-model="filters.status" class="px-3 py-2 border rounded-lg" @change="applyFilters">
        <option value="">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="confirmed">Confirmé</option>
        <option value="cancelled">Annulé</option>
        <option value="completed">Terminé</option>
      </select>

      <button @click="resetFilters" class="text-sm text-[#64748B] hover:text-[#0F3B5C]">
        Réinitialiser
      </button>
    </div>

    <!-- État chargement -->
    <div v-if="store.loading" class="text-center py-8 text-gray-500">
      Chargement...
    </div>

    <!-- État erreur -->
    <div v-else-if="store.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ store.error }}
      <AppButton variant="outline" @click="fetchData" class="ml-4">
        Réessayer
      </AppButton>
    </div>

    <!-- Liste des inscriptions -->
    <div v-else-if="store.clientTrips.length === 0" class="text-center py-8 text-gray-500">
      Aucune inscription. Cliquez sur "Nouvelle inscription".
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="inscription in store.clientTrips"
        :key="inscription.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <!-- En-tête de la carte -->
        <div class="p-4 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-3">
              <span class="font-semibold text-[#1E293B]">#{{ inscription.id }}</span>
              <AppBadge :variant="getStatusVariant(inscription.status)">
                {{ getStatusLabel(inscription.status) }}
              </AppBadge>
            </div>
            <div class="flex gap-2">
              <button
                @click="openEditNotes(inscription)"
                class="text-[#64748B] hover:text-[#0F3B5C] transition-colors"
                title="Modifier les notes"
              >
                📝
              </button>
              <button
                @click="confirmDelete(inscription)"
                class="text-[#64748B] hover:text-[#E74C3C] transition-colors"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Corps de la carte -->
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Client -->
            <div>
              <p class="text-xs text-[#94A3B8]">Client</p>
              <p class="font-medium text-[#1E293B]">{{ inscription.client?.name || '-' }}</p>
              <p class="text-sm text-[#64748B]">{{ inscription.client?.email }}</p>
            </div>

            <!-- Voyage -->
            <div>
              <p class="text-xs text-[#94A3B8]">Voyage</p>
              <p class="font-medium text-[#1E293B]">{{ inscription.trip?.title || '-' }}</p>
              <p class="text-sm text-[#64748B]">Destination: {{ inscription.trip?.destination_id }}</p>
            </div>

            <!-- Dates -->
            <div>
              <p class="text-xs text-[#94A3B8]">Dates du voyage</p>
              <p class="text-sm text-[#1E293B]">
                {{ formatDate(inscription.trip_date?.start_date) }} → {{ formatDate(inscription.trip_date?.end_date) }}
              </p>
              <p class="text-sm text-[#64748B]">
                💰 {{ formatPrice(inscription.trip_date?.price) }}
              </p>
            </div>

            <!-- Statut (selecteur) -->
            <div>
              <p class="text-xs text-[#94A3B8]">Changer le statut</p>
              <select
                :value="inscription.status"
                @change="updateStatus(inscription.id, $event.target.value)"
                class="mt-1 px-2 py-1 text-sm border rounded-lg"
              >
                <option value="pending">🟡 En attente</option>
                <option value="confirmed">🟢 Confirmé</option>
                <option value="cancelled">🔴 Annulé</option>
                <option value="completed">⚪ Terminé</option>
              </select>
            </div>

            <!-- Notes -->
            <div class="md:col-span-2">
              <p class="text-xs text-[#94A3B8]">Notes</p>
              <p class="text-sm text-[#64748B] italic" v-if="!inscription.notes">
                Aucune note
              </p>
              <p class="text-sm text-[#1E293B]" v-else>
                {{ inscription.notes }}
              </p>
            </div>

            <!-- Assignation -->
            <div class="md:col-span-2 text-xs text-[#94A3B8] border-t pt-3 mt-2">
              Inscrit par {{ inscription.assigned_by?.name }} le {{ formatDateTime(inscription.assigned_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="store.meta && store.meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <button
        v-for="page in store.meta.last_page"
        :key="page"
        @click="goToPage(page)"
        class="px-3 py-1 rounded-lg border transition-colors"
        :class="page === store.meta.current_page
          ? 'bg-[#0F3B5C] text-white border-[#0F3B5C]'
          : 'bg-white text-[#1E293B] border-[#CBD5E1] hover:bg-gray-50'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Modale d'ajout (à créer) -->
    <ClientTripFormModal
      v-model:isOpen="isModalOpen"
      @saved="onSaved"
    />

    <!-- Modale d'édition des notes (à créer) -->
    <NotesClientModal
      v-model:isOpen="isNotesModalOpen"
      :trip-id="selectedTripId"
      :notes="selectedNotes"
      @saved="onNotesSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useClientTripStore } from '@/stores/useClientTripStore'
import { useToastStore } from '@/stores/useToastStore'
import { useConfirmStore } from '@/stores/useConfirmStore'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import ClientTripFormModal from '@/components/trips/ClientTripFormModal.vue'
import NotesClientModal from '@/components/trips/NotesClientModal.vue'

const store = useClientTripStore()
const toastStore = useToastStore()
const confirmStore = useConfirmStore()

// État local
const isModalOpen = ref(false)
const isNotesModalOpen = ref(false)
const selectedTripId = ref(null)
const selectedNotes = ref('')

// Filtres
const filters = reactive({
  status: ''
})

// Charger les données
const fetchData = async () => {
  const params = {}
  if (filters.status) params.status = filters.status

  await store.fetchClientTrips(params)
}

const applyFilters = () => {
  fetchData()
}

const resetFilters = () => {
  filters.status = ''
  fetchData()
}

const goToPage = (page) => {
  store.fetchClientTrips({ page, ...filters })
}

// Ouvrir modale d'ajout
const openCreateModal = () => {
  isModalOpen.value = true
}

// Mettre à jour le statut
const updateStatus = async (id, status) => {
  const result = await store.updateClientTripStatus(id, status)
  if (result.success) {
    toastStore.showToast('success', 'Statut mis à jour')
    fetchData()
  } else {
    toastStore.showToast('error', result.message)
  }
}

// Ouvrir modale d'édition des notes
const openEditNotes = (inscription) => {
  selectedTripId.value = inscription.id
  selectedNotes.value = inscription.notes || ''
  isNotesModalOpen.value = true
}

// Sauvegarde des notes
const onNotesSaved = async (notes) => {
  const result = await store.updateClientTripNotes(selectedTripId.value, notes)
  if (result.success) {
    toastStore.showToast('success', 'Notes mises à jour')
    fetchData()
  } else {
    toastStore.showToast('error', result.message)
  }
  isNotesModalOpen.value = false
}

// Confirmation de suppression
const confirmDelete = (inscription) => {
  confirmStore.showConfirm({
    title: 'Supprimer l\'inscription',
    message: `Voulez-vous vraiment supprimer l'inscription de "${inscription.client?.name}" pour "${inscription.trip?.title}" ?`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    confirmVariant: 'danger',
    onConfirm: async () => {
      const result = await store.deleteClientTrip(inscription.id)
      if (result.success) {
        toastStore.showToast('success', 'Inscription supprimée')
        fetchData()
      } else {
        toastStore.showToast('error', result.message)
      }
    }
  })
}

// Rafraîchir après ajout
const onSaved = () => {
  isModalOpen.value = false
  fetchData()
}

// Formater les dates
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('fr-FR')
}

const formatPrice = (price) => {
  if (!price) return '-'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

// Statut
const getStatusVariant = (status) => {
  const variants = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'info'
  }
  return variants[status] || 'gray'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé'
  }
  return labels[status] || status
}

onMounted(() => {
  fetchData()
})
</script>
