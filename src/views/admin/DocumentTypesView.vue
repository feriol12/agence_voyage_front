<template>
  <div class="p-6">
    <!-- En-tête -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#1E293B]">📋 Types de documents</h1>
        <p class="text-sm text-[#64748B] mt-1">Gérez les documents requis pour chaque destination</p>
      </div>
      <AppButton variant="primary" @click="openCreateModal">
        + Nouveau type
      </AppButton>
    </div>

    <!-- État chargement -->
    <div v-if="store.loading" class="text-center py-8 text-gray-500">
      Chargement...
    </div>

    <!-- État erreur -->
    <div v-else-if="store.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ store.error }}
      <AppButton variant="outline" @click="store.fetchDocumentTypes()" class="ml-4">
        Réessayer
      </AppButton>
    </div>

    <!-- Aucune donnée -->
    <div v-else-if="store.documentTypes.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
      <div class="text-6xl mb-4">📄</div>
      <h3 class="text-lg font-semibold text-[#1E293B]">Aucun type de document</h3>
      <p class="text-sm text-[#64748B] mt-1">Commencez par créer votre premier type de document</p>
      <AppButton variant="primary" class="mt-4" @click="openCreateModal">
        + Créer un type
      </AppButton>
    </div>

    <!-- Liste des types -->
    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase tracking-wider">Nom</th>
              <th class="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase tracking-wider">Code</th>
              <th class="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase tracking-wider">Destination</th>
              <th class="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase tracking-wider">Obligatoire</th>
              <th class="text-left px-6 py-3 text-xs font-medium text-[#64748B] uppercase tracking-wider">Statut</th>
              <th class="text-right px-6 py-3 text-xs font-medium text-[#64748B] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="type in store.documentTypes"
              :key="type.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 text-sm font-medium text-[#1E293B]">{{ type.name }}</td>
              <td class="px-6 py-4 text-sm text-[#64748B] font-mono">{{ type.code }}</td>
              <td class="px-6 py-4 text-sm text-[#64748B]">
                {{ type.destination ? type.destination.name : '🌍 Toutes' }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="type.is_mandatory ? 'bg-[#27AE60]/10 text-[#27AE60]' : 'bg-gray-100 text-[#64748B]'"
                  class="text-xs px-2 py-1 rounded-full"
                >
                  {{ type.is_mandatory ? 'Obligatoire' : 'Optionnel' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="type.is_active ? 'bg-[#27AE60]/10 text-[#27AE60]' : 'bg-gray-100 text-[#64748B]'"
                  class="text-xs px-2 py-1 rounded-full"
                >
                  {{ type.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="toggleActive(type)"
                    class="p-1.5 rounded-lg text-[#64748B] hover:bg-gray-100 transition-colors"
                    :title="type.is_active ? 'Désactiver' : 'Activer'"
                  >
                    <svg v-if="type.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    @click="openEditModal(type)"
                    class="p-1.5 rounded-lg text-[#64748B] hover:bg-gray-100 hover:text-[#0F3B5C] transition-colors"
                    title="Modifier"
                  >
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(type)"
                    class="p-1.5 rounded-lg text-[#64748B] hover:bg-red-50 hover:text-[#E74C3C] transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modale formulaire -->
    <DocumentTypeFormModal
      v-model:isOpen="isModalOpen"
      :document-type="selectedDocumentType"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDocumentTypeStore } from '@/stores/useDocumentTypeStore'
import { useConfirmStore } from '@/stores/useConfirmStore'
import AppButton from '@/components/common/AppButton.vue'
import DocumentTypeFormModal from '@/components/document-types/DocumentTypeFormModal.vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const store = useDocumentTypeStore()
const confirmStore = useConfirmStore()

const isModalOpen = ref(false)
const selectedDocumentType = ref(null)

onMounted(() => {
    store.fetchDocumentTypes()
})

const openCreateModal = () => {
    selectedDocumentType.value = null
    isModalOpen.value = true
}

const openEditModal = (type) => {
    selectedDocumentType.value = type
    isModalOpen.value = true
}

const toggleActive = async (type) => {
    await store.updateDocumentType(type.id, {
        ...type,
        is_active: !type.is_active
    })
}

const confirmDelete = (type) => {
    confirmStore.showConfirm({
        title: 'Supprimer le type de document',
        message: `Êtes-vous sûr de vouloir supprimer "${type.name}" ? Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        confirmVariant: 'danger',
        onConfirm: async () => {
            await store.deleteDocumentType(type.id)
        }
    })
}

const onSaved = () => {
    isModalOpen.value = false
    store.fetchDocumentTypes()
}
</script>