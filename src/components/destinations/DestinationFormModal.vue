<template>
  <AppModal
    :isOpen="isOpen"
    :title="isEditing ? 'Modifier la destination' : 'Nouvelle destination'"
    size="md"
    @close="close"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nom -->
      <AppInput
        v-model="form.name"
        label="Nom"
        placeholder="Ex: Japon"
        :required="true"
        :error="errors.name"
      />

      <!-- Pays -->
      <AppInput
        v-model="form.country"
        label="Pays"
        placeholder="Ex: Japon"
        :required="true"
        :error="errors.country"
      />

      <!-- Continent (select avec AppSelect uniquement) -->
      <AppSelect
        v-model="form.continent"
        label="Continent"
        :options="continentOptions"
        placeholder="Sélectionner un continent"
        :error="errors.continent"
        hint="Choisissez le continent où se situe la destination"
      />

      <!-- Description -->
      <AppInput
        v-model="form.description"
        label="Description"
        type="textarea"
        placeholder="Description de la destination..."
        :rows="3"
      />

      <!-- Image -->
      <AppInput
        v-model="imageFile"
        label="Image de la destination"
        type="file"
        accept="image/*"
        hint="Formats acceptés : JPG, PNG, GIF (max 2 Mo)"
        @fileChange="handleImageChange"
      />

      <!-- Aperçu -->
      <div v-if="imagePreview" class="mt-2">
        <img
          :src="imagePreview"
          class="h-20 w-20 object-cover rounded-lg border border-[#E2E8F0]"
        />
      </div>
      <div v-else-if="form.image_url" class="mt-2">
        <img
          :src="form.image_url"
          class="h-20 w-20 object-cover rounded-lg border border-[#E2E8F0]"
        />
      </div>

      <!-- Visa requis (checkbox) -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.visa_required"
          type="checkbox"
          class="h-4 w-4 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
        />
        <span class="text-sm text-[#1E293B]">Visa requis</span>
      </label>

      <!-- Active (checkbox) -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.is_active"
          type="checkbox"
          class="h-4 w-4 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
        />
        <span class="text-sm text-[#1E293B]">Active</span>
      </label>

      <!-- Boutons -->
      <div class="flex justify-end gap-3 pt-2">
        <AppButton variant="outline" @click="close"> Annuler </AppButton>
        <AppButton variant="primary" type="submit">
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import { useDestinationStore } from '@/stores/useDestinationStore'

const props = defineProps({
  isOpen: Boolean,
  destination: { type: Object, default: null },
})

const emit = defineEmits(['update:isOpen', 'saved'])
const store = useDestinationStore()

const isEditing = computed(() => !!props.destination)

const continentOptions = [
  { value: 'Afrique', label: '🌍 Afrique' },
  { value: 'Asie', label: '🌏 Asie' },
  { value: 'Europe', label: '🌎 Europe' },
  { value: 'Amérique', label: '🌎 Amérique' },
  { value: 'Océanie', label: '🌏 Océanie' },
]

const errors = reactive({})

// ✅ AJOUT : variables pour l'image
const imageFile = ref(null)
const imagePreview = ref('')

const form = ref({
  name: '',
  country: '',
  continent: '',
  description: '',
  image_url: '',
  visa_required: false,
  is_active: true,
})

const validate = () => {
  const newErrors = {}
  if (!form.value.name) newErrors.name = 'Le nom est requis'
  if (!form.value.country) newErrors.country = 'Le pays est requis'
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

// ✅ AJOUT : gestion de l'image
const handleImageChange = (file) => {
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    country: '',
    continent: '',
    description: '',
    image_url: '',
    visa_required: false,
    is_active: true,
  }
  imageFile.value = null
  imagePreview.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

watch(
  () => props.destination,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
      if (newVal.image_url) {
        imagePreview.value = newVal.image_url
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

const close = () => {
  emit('update:isOpen', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    // ✅ Forcer les booléens
    const payload = {
      name: form.value.name,
      country: form.value.country,
      continent: form.value.continent || null,
      description: form.value.description || null,
      visa_required: Boolean(form.value.visa_required), // ← FORCE
      is_active: Boolean(form.value.is_active),         // ← FORCE
    }

    if (imageFile.value) {
      payload.image = imageFile.value
    }

    console.log('📦 Payload nettoyé:', payload)

    if (isEditing.value) {
      await store.updateDestination(props.destination.id, payload)
    } else {
      await store.createDestination(payload)
    }
    emit('saved')
    close()
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Une erreur est survenue')
  }
}
</script>
