<template>
  <AppModal
    :isOpen="isOpen"
    :title="trip ? 'Modifier le voyage' : 'Nouveau voyage'"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Destination -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
        <select
          v-model="form.destination_id"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          required
        >
          <option value="">Sélectionner une destination</option>
          <option v-for="dest in destinations" :key="dest.id" :value="dest.id">
            {{ dest.name }} ({{ dest.country }})
          </option>
        </select>
      </div>

      <!-- Titre -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
        <input
          type="text"
          v-model="form.title"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          required
        />
      </div>

      <!-- Référence -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Référence *</label>
        <input
          type="text"
          v-model="form.reference"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          placeholder="EX: VOY-2024-001"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Durée (jours) *</label>
          <input
            type="number"
            v-model.number="form.duration_days"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Capacité max *</label>
          <input
            type="number"
            v-model.number="form.capacity"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prix de base (€) *</label>
          <input
            type="number"
            step="0.01"
            v-model.number="form.base_price"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            v-model="form.status"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          >
            <option value="disponible">Disponible</option>
            <option value="complet">Complet</option>
            <option value="ferme">Fermé</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
        ></textarea>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          v-model="form.is_active"
          class="w-4 h-4 text-[#0F3B5C] rounded focus:ring-[#0F3B5C]"
        />
        <label for="is_active" class="text-sm text-gray-700">Voyage actif</label>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <AppButton type="button" variant="outline" @click="handleClose">
          Annuler
        </AppButton>
        <AppButton type="submit" variant="primary" :disabled="saving">
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  isOpen: Boolean,
  trip: {
    type: Object,
    default: null
  },
  destinations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:isOpen', 'saved'])

const saving = ref(false)

// ✅ FORMULAIRE - Défini AVANT le watch
const form = ref({
  destination_id: '',
  title: '',
  reference: '',
  description: '',
  duration_days: 1,
  capacity: 1,
  base_price: 0,
  status: 'disponible',
  is_active: true
})

// ✅ RESET FORM - Défini AVANT le watch
const resetForm = () => {
  form.value = {
    destination_id: '',
    title: '',
    reference: '',
    description: '',
    duration_days: 1,
    capacity: 1,
    base_price: 0,
    status: 'disponible',
    is_active: true
  }
}

// ✅ WATCH - Maintenant resetForm existe
watch(() => props.trip, (newTrip) => {
  if (newTrip) {
    form.value = {
      destination_id: newTrip.destination_id,
      title: newTrip.title,
      reference: newTrip.reference,
      description: newTrip.description || '',
      duration_days: newTrip.duration_days,
      capacity: newTrip.capacity,
      base_price: newTrip.base_price,
      status: newTrip.status,
      is_active: newTrip.is_active
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:isOpen', false)
  resetForm()
}

const handleSubmit = async () => {
  saving.value = true
  emit('saved', { ...form.value, id: props.trip?.id })
  saving.value = false
  handleClose()
}
</script>
