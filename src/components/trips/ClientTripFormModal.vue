<template>
  <AppModal
    :isOpen="isOpen"
    title="➕ Nouvelle inscription"
    size="md"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Sélection du client avec recherche -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
        <SearchableSelect
          v-model="form.user_id"
          :options="clientOptions"
          placeholder="🔍 Rechercher un client par nom ou email..."
          :loading="clientsLoading"
        />
      </div>

      <!-- Sélection du voyage avec recherche -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Voyage *</label>
        <SearchableSelect
          v-model="form.trip_id"
          :options="tripOptions"
          placeholder="🔍 Rechercher un voyage..."
          @update:model-value="onTripChange"
        />
      </div>

      <!-- Sélection de la date (garde le select car peu d'options) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date de départ *</label>
        <select
          v-model="form.trip_date_id"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          :disabled="!form.trip_id"
          required
        >
          <option value="">Sélectionner une date</option>
          <option v-for="date in availableDates" :key="date.id" :value="date.id">
            {{ formatDate(date.start_date) }} → {{ formatDate(date.end_date) }}
            ({{ date.places_available }} places, {{ formatPrice(date.price) }})
          </option>
        </select>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
        <textarea
          v-model="form.notes"
          rows="2"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          placeholder="Allergies, besoins particuliers..."
        ></textarea>
      </div>

      <!-- Boutons -->
      <div class="flex justify-end gap-3 pt-4">
        <AppButton type="button" variant="outline" @click="handleClose">
          Annuler
        </AppButton>
        <AppButton type="submit" variant="primary" :disabled="saving">
          {{ saving ? 'Inscription...' : 'Inscrire le client' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { useClientTripStore } from '@/stores/useClientTripStore'
import { useUserStore } from '@/stores/useUserStore'
import { useTripStore } from '@/stores/useTripStore'
import { useToastStore } from '@/stores/useToastStore'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['update:isOpen', 'saved'])

const store = useClientTripStore()
const userStore = useUserStore()
const tripStore = useTripStore()
const toastStore = useToastStore()

const saving = ref(false)
const clientsLoading = ref(false)
const availableDates = ref([])

const form = ref({
  user_id: '',
  trip_id: '',
  trip_date_id: '',
  notes: ''
})

// Options pour les selects
const clientOptions = computed(() => {
  return userStore.users.map(user => ({
    value: user.id,
    label: user.name,
    subtitle: user.email
  }))
})

const tripOptions = computed(() => {
  return tripStore.trips.map(trip => ({
    value: trip.id,
    label: trip.title,
    subtitle: trip.reference
  }))
})

// Charger les clients et voyages
onMounted(async () => {
  // Récupérer les clients
  clientsLoading.value = true
  await userStore.fetchUsers({ role: 'client' })
  clientsLoading.value = false

  // Récupérer les voyages
  await tripStore.fetchTrips()
})

// Quand le voyage change, charger ses dates
const onTripChange = async () => {
  form.value.trip_date_id = ''

  if (form.value.trip_id) {
    const selectedTrip = tripStore.trips.find(t => t.id === form.value.trip_id)
    if (selectedTrip && selectedTrip.trip_dates) {
      availableDates.value = selectedTrip.trip_dates
    } else {
      availableDates.value = []
    }
  } else {
    availableDates.value = []
  }
}

// Réinitialiser le formulaire quand la modale se ferme
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    user_id: '',
    trip_id: '',
    trip_date_id: '',
    notes: ''
  }
  availableDates.value = []
}

const handleClose = () => {
  emit('update:isOpen', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!form.value.user_id || !form.value.trip_id || !form.value.trip_date_id) {
    toastStore.showToast('error', 'Veuillez remplir tous les champs obligatoires')
    return
  }

  saving.value = true

  const result = await store.createClientTrip({
    user_id: form.value.user_id,
    trip_id: form.value.trip_id,
    trip_date_id: form.value.trip_date_id,
    notes: form.value.notes
  })

  if (result.success) {
    toastStore.showToast('success', 'Client inscrit avec succès')
    emit('saved')
    handleClose()
  } else {
    toastStore.showToast('error', result.message || 'Erreur lors de l\'inscription')
  }

  saving.value = false
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>
