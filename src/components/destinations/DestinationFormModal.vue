<template>
  <AppModal
    :isOpen="isOpen"
    :title="isEditing ? 'Modifier la destination' : 'Nouvelle destination'"
    size="lg"
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

      <!-- Continent -->
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

      <!-- ✅ ImageUploader (remplace l'ancien champ file) -->
      <!-- Images existantes -->
      <div v-if="isEditing && existingImages.length > 0" class="mt-2">
        <label class="block text-sm font-medium text-[#1E293B] mb-2"> Images actuelles </label>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="(img, index) in existingImages"
            :key="'existing-' + index"
            class="relative h-20 w-20 rounded-lg overflow-hidden border border-[#E2E8F0] group"
          >
            <img :src="img" class="h-full w-full object-cover" />
            <button
              @click="removeExistingImage(index)"
              class="absolute -top-1 -right-1 rounded-full bg-[#E74C3C] p-0.5 text-white hover:bg-[#C0392B] transition-colors opacity-0 group-hover:opacity-100"
              type="button"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Upload de nouvelles images -->
      <ImageUploader
        v-model="imageFiles"
        label="Ajouter des images"
        hint="Formats acceptés : JPG, PNG, GIF (max 2 Mo par image)"
        accept="image/*"
        :max-size="2"
        :max-files="10"
      />

      <!-- Visa requis -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.visa_required"
          type="checkbox"
          class="h-4 w-4 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
        />
        <span class="text-sm text-[#1E293B]">Visa requis</span>
      </label>

      <!-- Active -->
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
        <AppButton variant="outline" @click="close">Annuler</AppButton>
        <AppButton variant="primary" type="submit" :disabled="store.loading">
          {{ store.loading ? 'Envoi en cours...' : isEditing ? 'Mettre à jour' : 'Créer' }}
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
import ImageUploader from '@/components/common/ImageUploader.vue'
import { useDestinationStore } from '@/stores/useDestinationStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'

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

// ✅ Images existantes (URLs)
const existingImages = ref([])

// ✅ URLs des images à supprimer
const imagesToDelete = ref([])

// ✅ Nouvelles images (fichiers)
const imageFiles = ref([])
const imagePreviews = ref([]) // URLs d'aperçu (y compris existantes)

const form = ref({
  name: '',
  country: '',
  continent: '',
  description: '',
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

const resetForm = () => {
  form.value = {
    name: '',
    country: '',
    continent: '',
    description: '',
    visa_required: false,
    is_active: true,
  }
  // ✅ Réinitialiser les images
  existingImages.value = []
  imagesToDelete.value = []
  imageFiles.value = []
  Object.keys(errors).forEach((key) => delete errors[key])
}

watch(
  () => props.destination,
  (newVal) => {
    if (newVal) {
      // Remplir les champs textes
      form.value = {
        name: newVal.name || '',
        country: newVal.country || '',
        continent: newVal.continent || '',
        description: newVal.description || '',
        visa_required: newVal.visa_required || false,
        is_active: newVal.is_active ?? true,
      }

      // ✅ Récupérer les images existantes
      existingImages.value = newVal.images || []

      // ✅ Réinitialiser les listes de suppression et nouvelles images
      imagesToDelete.value = []
      imageFiles.value = []
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

  // Désactiver le bouton (optionnel, mais recommandé)
  // store.loading est déjà géré, on peut le réutiliser

  try {
    const payload = {
      name: form.value.name.trim(),
      country: form.value.country.trim(),
      continent: form.value.continent || null,
      description: form.value.description || null,
      visa_required: form.value.visa_required,
      is_active: form.value.is_active,
    }

    // ✅ Ajouter les nouvelles images (fichiers)
    if (imageFiles.value.length > 0) {
      payload.images = imageFiles.value
    }

    // ✅ Ajouter les images à supprimer (URLs)
    if (imagesToDelete.value.length > 0) {
      payload.images_to_delete = imagesToDelete.value
    }

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
// ✅ Supprimer une image existante (avant envoi)
const removeExistingImage = (index) => {
  const removed = existingImages.value.splice(index, 1)[0]
  imagesToDelete.value.push(removed)
}

// ✅ Supprimer une nouvelle image (avant envoi)
const removeNewImage = (index) => {
  imageFiles.value.splice(index, 1)
}
</script>
