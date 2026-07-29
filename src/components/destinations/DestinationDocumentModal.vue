<template>
  <AppModal
    :isOpen="isOpen"
    :title="`🔍 Détail de la destination - ${destination?.name || ''}`"
    size="lg"
    @close="close"
  >
    <div v-if="loading" class="text-center py-8 text-gray-500">Chargement...</div>

    <div v-else>
      <!-- 🌍 Informations générales -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="text-sm font-medium text-[#1E293B] mb-2">🌍 Informations générales</h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="text-[#64748B]">Nom :</span>
            <span class="font-medium">{{ destination?.name }}</span>
          </div>
          <div>
            <span class="text-[#64748B]">Pays :</span>
            <span class="font-medium">{{ destination?.country }}</span>
          </div>
          <div>
            <span class="text-[#64748B]">Continent :</span>
            <span class="font-medium">{{ destination?.continent || 'Non défini' }}</span>
          </div>
          <div>
            <span class="text-[#64748B]">Statut :</span>
            <span :class="destination?.is_active ? 'text-[#27AE60]' : 'text-[#94A3B8]'">
              {{ destination?.is_active ? '✅ Actif' : '⛔ Inactif' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 📋 Documents assignés -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-[#1E293B]">
            📋 Documents assignés ({{ assignedDocuments.length }})
          </h4>
        </div>

        <div
          v-if="assignedDocuments.length === 0"
          class="text-sm text-[#64748B] p-4 bg-gray-50 rounded-lg"
        >
          Aucun document assigné à cette destination.
        </div>

        <div
          v-for="doc in assignedDocuments"
          :key="doc.id"
          class="flex items-center justify-between py-2 border-b border-gray-100"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm text-[#1E293B]">{{ doc.name }}</span>
            <span class="text-xs text-[#94A3B8]">({{ doc.code }})</span>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1 text-xs text-[#64748B]">
              <input
                type="checkbox"
                :checked="doc.pivot?.is_mandatory || false"
                @change="docStore.toggleMandatory(doc.id)"
                class="h-3.5 w-3.5 rounded border-[#CBD5E1] text-[#0F3B5C] focus:ring-[#E67E22]"
              />
              Obligatoire
            </label>
            <button
              @click="docStore.removeDocumentFromAssignment(doc.id)"
              class="text-red-400 hover:text-[#E74C3C] transition-colors"
              title="Retirer ce document"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- ➕ Ajouter un document -->
      <div class="mb-4 border-t border-gray-100 pt-4">
        <h4 class="text-sm font-medium text-[#1E293B] mb-3">➕ Ajouter un document</h4>
        <div class="flex gap-2">
          <select
            v-model="selectedNewDocument"
            class="flex-1 rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm focus:border-[#E67E22] focus:outline-none"
          >
            <option value="">Sélectionner un document</option>
            <option v-for="doc in docStore.availableDocuments" :key="doc.id" :value="doc.id">
              {{ doc.name }} ({{ doc.code }})
            </option>
          </select>
          <AppButton variant="primary" @click="addDocument" :disabled="!selectedNewDocument">
            ➕ Ajouter
          </AppButton>
        </div>
        <p v-if="docStore.availableDocuments.length === 0" class="text-xs text-[#64748B] mt-1">
          ✅ Tous les documents sont déjà assignés.
        </p>
      </div>

      <!-- Boutons -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <AppButton variant="outline" @click="close">Annuler</AppButton>
        <AppButton variant="primary" @click="save" :loading="saving"> 💾 Enregistrer </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useDestinationDocumentStore } from '@/stores/useDestinationDocumentStore'

const props = defineProps({
  isOpen: Boolean,
  destination: { type: Object, default: null },
})

const emit = defineEmits(['update:isOpen', 'saved'])

const docStore = useDestinationDocumentStore()
const loading = ref(false)
const saving = ref(false)
const selectedNewDocument = ref('')

const assignedDocuments = computed(() => docStore.assignedDocuments || [])

const loadData = async () => {
  if (!props.destination) return
  loading.value = true
  try {
    await docStore.fetchDocumentsByDestination(props.destination.id)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const addDocument = () => {
  if (!selectedNewDocument.value) return
  docStore.addDocumentToAssignment(selectedNewDocument.value)
  selectedNewDocument.value = ''
}

const save = async () => {
  if (!props.destination) return
  saving.value = true
  try {
    await docStore.syncDocuments(props.destination.id)
    emit('saved')
    close()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const close = () => {
  emit('update:isOpen', false)
  selectedNewDocument.value = ''
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.destination) {
      loadData()
    }
  },
  { immediate: true },
)
</script>
