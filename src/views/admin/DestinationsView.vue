<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[#1E293B]">🌍 Destinations</h1>
      <AppButton variant="primary" @click="openCreateModal">
        + Nouvelle destination
      </AppButton>
    </div>
    
    <!-- État chargement -->
    <div v-if="store.loading" class="text-center py-8 text-gray-500">
      Chargement...
    </div>
    
    <!-- État erreur -->
    <div v-else-if="store.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ store.error }}
      <AppButton variant="outline" @click="store.fetchDestinations()" class="ml-4">
        Réessayer
      </AppButton>
    </div>
    
    <!-- Aucune donnée -->
    <div v-else-if="store.destinations.length === 0" class="text-center py-8 text-gray-500">
      Aucune destination. Créez-en une !
    </div>
    
    <!-- Liste des destinations avec AppCard -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AppCard v-for="dest in store.destinations" :key="dest.id">
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-lg text-[#1E293B]">{{ dest.name }}</h3>
          <div class="flex gap-2">
            <button 
              @click="openEditModal(dest)" 
              class="text-[#64748B] hover:text-[#0F3B5C] transition-colors"
            >
              ✏️
            </button>
            <button 
              @click="confirmDelete(dest)" 
              class="text-[#64748B] hover:text-[#E74C3C] transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>
        <p class="text-sm text-[#64748B] mt-1">{{ dest.country }}</p>
        <p v-if="dest.continent" class="text-xs text-[#94A3B8]">{{ dest.continent }}</p>
        
        <div class="mt-3 flex flex-wrap gap-2">
          <AppBadge :variant="dest.visa_required ? 'warning' : 'success'">
            {{ dest.visa_required ? 'Visa requis' : 'Visa non requis' }}
          </AppBadge>
          <AppBadge :variant="dest.is_active ? 'success' : 'gray'">
            {{ dest.is_active ? 'Active' : 'Inactive' }}
          </AppBadge>
        </div>
        
        <p v-if="dest.description" class="text-sm text-[#64748B] mt-3 line-clamp-2">
          {{ dest.description }}
        </p>
      </AppCard>
    </div>
    
    <!-- Pagination -->
    <div v-if="store.meta && store.meta.last_page > 1" class="mt-6 flex justify-center gap-2">
      <button 
        v-for="page in store.meta.last_page" 
        :key="page" 
        @click="store.fetchDestinations(page)"
        class="px-3 py-1 rounded-lg border transition-colors"
        :class="page === store.meta.current_page 
          ? 'bg-[#0F3B5C] text-white border-[#0F3B5C]' 
          : 'bg-white text-[#1E293B] border-[#CBD5E1] hover:bg-gray-50'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Modale -->
    <DestinationFormModal
      v-model:isOpen="isModalOpen"
      :destination="selectedDestination"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDestinationStore } from '@/stores/useDestinationStore'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import DestinationFormModal from '@/components/destinations/DestinationFormModal.vue'

const store = useDestinationStore()
const isModalOpen = ref(false)
const selectedDestination = ref(null)

onMounted(() => {
  store.fetchDestinations()
})

const openCreateModal = () => {
  selectedDestination.value = null
  isModalOpen.value = true
}

const openEditModal = (dest) => {
  selectedDestination.value = dest
  isModalOpen.value = true
}

const confirmDelete = async (dest) => {
  if (confirm(`Supprimer "${dest.name}" ?`)) {
    await store.deleteDestination(dest.id)
  }
}

const onSaved = () => {
  isModalOpen.value = false
  store.fetchDestinations()
}
</script>