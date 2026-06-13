<template>
  <AppModal
    :isOpen="isOpen"
    :title="tripDate ? 'Modifier la date' : 'Ajouter une date'"
    size="md"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
          <input
            type="date"
            v-model="form.start_date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            :class="{ 'border-red-500': errors.start_date }"
            required
          />
          <p v-if="errors.start_date" class="text-xs text-red-500 mt-1">{{ errors.start_date }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
          <input
            type="date"
            v-model="form.end_date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            :class="{ 'border-red-500': errors.end_date }"
            required
          />
          <p v-if="errors.end_date" class="text-xs text-red-500 mt-1">{{ errors.end_date }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
          <input
            type="number"
            step="0.01"
            v-model.number="form.price"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            :class="{ 'border-red-500': errors.price }"
            placeholder="0.00"
            required
          />
          <p v-if="errors.price" class="text-xs text-red-500 mt-1">{{ errors.price }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Places disponibles *</label>
          <input
            type="number"
            v-model.number="form.places_available"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
            :class="{ 'border-red-500': errors.places_available }"
            placeholder="0"
            required
          />
          <p v-if="errors.places_available" class="text-xs text-red-500 mt-1">{{ errors.places_available }}</p>
        </div>
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
import { useTripDateStore } from '@/stores/useTripDateStore'
import { useToastStore } from '@/stores/useToastStore'

const props = defineProps({
  isOpen: Boolean,
  tripId: {
    type: Number,
    default: null
  },
  tripDate: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:isOpen', 'saved'])

const store = useTripDateStore()
const toastStore = useToastStore()
const saving = ref(false)
const errors = ref({})

const form = ref({
  start_date: '',
  end_date: '',
  price: 0,
  places_available: 0
})

// ✅ 1. DÉFINIR resetForm AVANT le watch
const resetForm = () => {
  form.value = {
    start_date: '',
    end_date: '',
    price: 0,
    places_available: 0
  }
  errors.value = {}
}

// ✅ 2. DÉFINIR la fonction pour remplir le formulaire
const fillForm = (tripDateData) => {
  if (tripDateData) {
    form.value = {
      start_date: tripDateData.start_date?.split('T')[0] || '',
      end_date: tripDateData.end_date?.split('T')[0] || '',
      price: tripDateData.price,
      places_available: tripDateData.places_available
    }
  } else {
    resetForm()
  }
}

// ✅ 3. DÉFINIR la validation
const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.start_date) {
    errors.value.start_date = 'La date de début est requise'
    isValid = false
  }

  if (!form.value.end_date) {
    errors.value.end_date = 'La date de fin est requise'
    isValid = false
  }

  if (form.value.start_date && form.value.end_date) {
    if (new Date(form.value.end_date) <= new Date(form.value.start_date)) {
      errors.value.end_date = 'La date de fin doit être postérieure à la date de début'
      isValid = false
    }
  }

  if (form.value.price <= 0) {
    errors.value.price = 'Le prix doit être supérieur à 0'
    isValid = false
  }

  if (form.value.places_available < 0) {
    errors.value.places_available = 'Le nombre de places doit être positif ou nul'
    isValid = false
  }

  return isValid
}

// ✅ 4. WATCH (maintenant resetForm existe)
watch(() => props.tripDate, (newDate) => {
  fillForm(newDate)
}, { immediate: true })

// ✅ 5. AUTRES FONCTIONS
const handleClose = () => {
  emit('update:isOpen', false)
  resetForm()
}

const handleSubmit = async () => {

  console.log('=== handleSubmit appelé ===')
  console.log('props.tripDate:', props.tripDate)
  console.log('props.tripId:', props.tripId)
  console.log('form.value:', form.value)
  if (!validateForm()) {
    console.log('Validation échouée')
    return
  }

  saving.value = true

  let result
  if (props.tripDate) {
         console.log('🟡 MODIFICATION en cours...')
    result = await store.updateDate(props.tripId, props.tripDate.id, form.value)
  } else {
    console.log('🟢 CRÉATION en cours...')
    result = await store.createDate(props.tripId, form.value)
  }

  if (result.success) {
    toastStore.showToast('success', props.tripDate ? 'Date modifiée avec succès' : 'Date ajoutée avec succès')
    emit('saved')
    handleClose()
  } else {
    toastStore.showToast('error', result.message || 'Une erreur est survenue')
  }

  saving.value = false
}
</script>
