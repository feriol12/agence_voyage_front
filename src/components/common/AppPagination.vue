<template>
  <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
    <!-- Sélecteur nombre d'éléments -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-[#64748B]">Afficher :</span>
      <select 
        :value="perPage" 
        @change="onPerPageChange"
        class="rounded-lg border border-[#CBD5E1] px-2 py-1 text-sm focus:border-[#E67E22] focus:outline-none"
      >
        <option :value="6">6</option>
        <option :value="9">9</option>
        <option :value="12">12</option>
        <option :value="15">15</option>
        <option :value="24">24</option>
      </select>
    </div>
    
    <!-- Indicateur de page -->
    <div class="text-sm text-[#64748B]">
      Page {{ currentPage }} sur {{ lastPage }}
    </div>
    
    <!-- Boutons de navigation -->
    <div class="flex gap-2">
      <!-- Page précédente -->
      <button
        @click="goToPrev"
        :disabled="currentPage === 1"
        class="flex items-center gap-1 rounded-lg px-4 py-1.5 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="currentPage === 1 
          ? 'bg-gray-100 text-gray-400 border border-gray-200' 
          : 'bg-white text-[#1E293B] border border-[#CBD5E1] hover:bg-[#E67E22] hover:text-white hover:border-[#E67E22]'"
      >
         Précédent
      </button>
      
      <!-- Page suivante -->
      <button
        @click="goToNext"
        :disabled="currentPage === lastPage"
        class="flex items-center gap-1 rounded-lg px-4 py-1.5 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="currentPage === lastPage 
          ? 'bg-gray-100 text-gray-400 border border-gray-200' 
          : 'bg-white text-[#1E293B] border border-[#CBD5E1] hover:bg-[#E67E22] hover:text-white hover:border-[#E67E22]'"
      >
        Suivant 
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  lastPage: {
    type: Number,
    required: true,
    default: 1
  },
  perPage: {
    type: Number,
    default: 9
  }
})

const emit = defineEmits(['update:perPage', 'page-changed'])

const onPerPageChange = (event) => {
  const newValue = parseInt(event.target.value, 10)
  emit('update:perPage', newValue)
  emit('page-changed', 1, newValue)
}

const goToPrev = () => {
  if (props.currentPage > 1) {
    const newPage = props.currentPage - 1
    console.log('Précédent -> page:', newPage) // Debug
    emit('page-changed', newPage, props.perPage)
  }
}

const goToNext = () => {
  if (props.currentPage < props.lastPage) {
    const newPage = props.currentPage + 1
    console.log('Suivant -> page:', newPage) // Debug
    emit('page-changed', newPage, props.perPage)
  }
}
</script>



