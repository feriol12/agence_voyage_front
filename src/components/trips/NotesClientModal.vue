<template>
  <AppModal
    :isOpen="isOpen"
    title="📝 Modifier les notes"
    size="md"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          v-model="localNotes"
          rows="4"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0F3B5C] focus:border-[#0F3B5C]"
          placeholder="Informations supplémentaires sur le client (allergies, besoins particuliers...)"
        ></textarea>
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
  notes: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:isOpen', 'saved'])

const saving = ref(false)
const localNotes = ref('')

watch(() => props.notes, (newValue) => {
  localNotes.value = newValue || ''
}, { immediate: true })

const handleClose = () => {
  emit('update:isOpen', false)
}

const handleSubmit = () => {
  emit('saved', localNotes.value)
}
</script>
