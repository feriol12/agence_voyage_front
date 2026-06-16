<template>
  <AppModal
    :isOpen="isOpen"
    :title="`📅 Dates du voyage : ${trip?.title}`"
    size="lg"
    @close="handleClose"
  >
    <div class="flex flex-col h-full" style="max-height: 80vh;">
      <!-- Bouton ajouter (fixe en haut) -->
      <div class="flex justify-end pb-4 border-b border-gray-200">
        <AppButton variant="primary" size="sm" @click="openCreateForm">
          + Ajouter une date
        </AppButton>
      </div>

      <!-- Zone défilante pour la liste des dates -->
      <div class="flex-1 overflow-y-auto py-4" style="max-height: 400px;">
        <!-- État chargement -->
        <div v-if="store.loading" class="text-center py-8 text-gray-500">
          Chargement des dates...
        </div>

        <!-- Aucune donnée -->
        <div v-else-if="store.dates.length === 0" class="text-center py-8 text-gray-500">
          Aucune date pour ce voyage. Cliquez sur "Ajouter une date".
        </div>

        <!-- Liste des dates -->
        <div v-else class="space-y-3">
          <div
            v-for="date in store.dates"
            :key="date.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <!-- Infos de la date -->
            <div class="flex-1">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="font-medium text-[#1E293B]">
                  {{ formatDate(date.start_date) }} → {{ formatDate(date.end_date) }}
                </span>
                <AppBadge :variant="date.places_available > 0 ? 'success' : 'danger'">
                  {{ date.places_available }} places
                </AppBadge>
              </div>
              <div class="flex gap-4 mt-1 text-sm text-[#64748B]">
                <span>💰 {{ formatPrice(date.price) }}</span>
                <span>📅 Départ: {{ formatDate(date.start_date) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="openEditForm(date)"
                class="p-2 text-[#64748B] hover:text-[#0F3B5C] transition-colors"
                title="Modifier"
              >
                ✏️
              </button>
              <button
                @click="confirmDelete(date)"
                class="p-2 text-[#64748B] hover:text-[#E74C3C] transition-colors"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale du formulaire (ajout/modification) -->
    <TripDateFormModal
      v-model:isOpen="isFormModalOpen"
      :trip-id="trip?.id"
      :trip-date="selectedDate"
      @saved="onDateSaved"
    />
  </AppModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import TripDateFormModal from './TripDateFormModal.vue'
import { useTripDateStore } from '@/stores/useTripDateStore'
import { useToastStore } from '@/stores/useToastStore'
import { useConfirmStore } from '@/stores/useConfirmStore'

const props = defineProps({
  isOpen: Boolean,
  trip: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:isOpen', 'saved'])

const store = useTripDateStore()
const toastStore = useToastStore()
const confirmStore = useConfirmStore()

const isFormModalOpen = ref(false)
const selectedDate = ref(null)

// Charger les dates quand la modale s'ouvre
watch(() => props.isOpen, async (newValue) => {
  if (newValue && props.trip?.id) {
    await store.fetchDates(props.trip.id)
  } else if (!newValue) {
    store.reset()
  }
})

const handleClose = () => {
  emit('update:isOpen', false)
  store.reset()
}

const openCreateForm = () => {
  selectedDate.value = null
  isFormModalOpen.value = true
}

const openEditForm = (date) => {
  selectedDate.value = date
  isFormModalOpen.value = true
}

const onDateSaved = async () => {
  isFormModalOpen.value = false
  await store.fetchDates(props.trip.id)
  emit('saved')
}

// const confirmDelete = (date) => {
//   confirmStore.showConfirm({
//     title: 'Supprimer la date',
//     message: `Voulez-vous vraiment supprimer la date du ${formatDate(date.start_date)} au ${formatDate(date.end_date)} ?`,
//     confirmText: 'Supprimer',
//     cancelText: 'Annuler',
//     confirmVariant: 'danger',
//     onConfirm: async () => {
//       const result = await store.deleteDate(props.trip.id, date.id)
//       if (result.success) {
//         toastStore.showToast('success', 'Date supprimée avec succès')
//         await store.fetchDates(props.trip.id)
//         emit('saved')
//       } else {
//         toastStore.showToast('error', result.message || 'Erreur lors de la suppression')
//       }
//     }
//   })
// }

const confirmDelete = (date) => {
  // ✅ 1. Fermer la modale des dates
  handleClose()

  // ✅ 2. Petit délai pour que la modale se ferme proprement
  setTimeout(() => {
    confirmStore.showConfirm({
      title: 'Supprimer la date',
      message: `Voulez-vous vraiment supprimer la date du ${formatDate(date.start_date)} au ${formatDate(date.end_date)} ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmVariant: 'danger',
      onConfirm: async () => {
        // ✅ 3. Supprimer la date
        const result = await store.deleteDate(props.trip.id, date.id)

        if (result.success) {
          toastStore.showToast('success', 'Date supprimée avec succès')
          // ✅ 4. Rouvrir la modale des dates avec les données mises à jour
          emit('update:isOpen', true) // ← rouvrir
          await store.fetchDates(props.trip.id)
        } else {
          toastStore.showToast('error', result.message || 'Erreur lors de la suppression')
        }
      }
    })
  }, 200)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>
