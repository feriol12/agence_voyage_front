<template>
  <AppModal
    :isOpen="isOpen"
    :title="isEditing ? 'Modifier le type de document' : 'Nouveau type de document'"
    size="md"
    @close="close"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nom -->
      <AppInput
        v-model="form.name"
        label="Nom du document"
        placeholder="Ex: Passeport"
        :required="true"
        :error="errors.name"
      />

      <!-- Code -->
      <AppInput
        v-model="form.code"
        label="Code unique"
        placeholder="Ex: PASSEPORT"
        :required="true"
        :error="errors.code"
        hint="Utilisé comme identifiant unique dans le système"
      />

      <!-- Description -->
      <AppInput
        v-model="form.description"
        label="Description"
        type="textarea"
        placeholder="Description du document..."
        :rows="3"
      />

      <!-- Destination -->
      <AppSelect
        v-model="form.destination_id"
        label="Destination associée"
        :options="destinationOptions"
        placeholder="Sélectionner une destination"
        hint="Laissez vide pour rendre ce document disponible pour toutes les destinations"
      />

      <!-- Obligatoire -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.is_mandatory"
          type="checkbox"
          class="h-4 w-4 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
        />
        <span class="text-sm text-[#1E293B]">Document obligatoire</span>
      </label>

      <!-- Validation admin -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.requires_validation"
          type="checkbox"
          class="h-4 w-4 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
        />
        <span class="text-sm text-[#1E293B]">Nécessite une validation admin</span>
      </label>

      <!-- Actif -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.is_active"
          type="checkbox"
          class="h-4 w-4 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
        />
        <span class="text-sm text-[#1E293B]">Actif</span>
      </label>

      <!-- Boutons -->
      <div class="flex justify-end gap-3 pt-2">
        <AppButton variant="outline" @click="close">Annuler</AppButton>
        <AppButton variant="primary" type="submit">
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import { useDocumentTypeStore } from '@/stores/useDocumentTypeStore'
import { useDestinationStore } from '@/stores/useDestinationStore'

const props = defineProps({
  isOpen: Boolean,
  documentType: { type: Object, default: null },
})

const emit = defineEmits(['update:isOpen', 'saved'])

const store = useDocumentTypeStore()
const destinationStore = useDestinationStore()

const isEditing = computed(() => !!props.documentType)

// Options pour le select des destinations
const destinationOptions = computed(() => {
  const options = [{ value: null, label: '🌍 Toutes les destinations' }]
  destinationStore.destinations.forEach((dest) => {
    options.push({
      value: dest.id,
      label: `📍 ${dest.name}`,
    })
  })
  return options
})

const errors = reactive({})

const form = ref({
  name: '',
  code: '',
  description: '',
  destination_id: null,
  is_mandatory: true,
  requires_validation: true,
  is_active: true,
})

const validate = () => {
  const newErrors = {}
  if (!form.value.name) newErrors.name = 'Le nom est requis'
  if (!form.value.code) newErrors.code = 'Le code est requis'
  if (form.value.code && !/^[A-Z_]+$/.test(form.value.code)) {
    newErrors.code =
      'Le code doit être en majuscules et underscores uniquement (ex: PASSEPORT, VISA)'
  }
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

const resetForm = () => {
  form.value = {
    name: '',
    code: '',
    description: '',
    destination_id: null,
    is_mandatory: true,
    requires_validation: true,
    is_active: true,
  }
  Object.keys(errors).forEach((key) => delete errors[key])
}

watch(
  () => props.documentType,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
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
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim().toUpperCase(),
      description: form.value.description || null,
      is_mandatory: form.value.is_mandatory,
      requires_validation: form.value.requires_validation,
      is_active: form.value.is_active,
    }

    // ✅ Si destination_id est une chaîne vide ou null, on ne l'envoie pas
    if (
      form.value.destination_id !== null &&
      form.value.destination_id !== '' &&
      form.value.destination_id !== undefined
    ) {
      payload.destination_id = Number(form.value.destination_id)
    }

    if (isEditing.value) {
      await store.updateDocumentType(props.documentType.id, payload)
    } else {
      await store.createDocumentType(payload)
    }
    emit('saved')
    close()
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Une erreur est survenue')
  }
}
// Charger les destinations pour le select
onMounted(() => {
  destinationStore.fetchDestinations()
})
</script>
