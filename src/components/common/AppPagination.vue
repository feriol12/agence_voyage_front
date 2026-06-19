<template>
  <div class="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
    <!-- Sélecteur nombre d'éléments -->
    <div class="flex items-center gap-2 text-sm text-[#64748B]">
      <span>Afficher :</span>
      <select 
        :value="perPage" 
        @change="onPerPageChange"
        class="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-[#E67E22] focus:outline-none"
      >
        <option :value="4">4</option>
        <option :value="6">6</option>
        <option :value="9">9</option>
        <option :value="12">12</option>
        <option :value="15">15</option>
      </select>
    </div>
    
    <!-- Indicateur de page -->
    <div class="text-sm text-[#64748B]">
      Page {{ currentPage }} sur {{ lastPage }}
    </div>
    
    <!-- Boutons Précédent / Suivant -->
    <div class="flex gap-2">
      <button
        @click="goToPrev"
        :disabled="currentPage === 1"
        class="rounded border px-3 py-1 text-sm transition-all disabled:opacity-40"
        :class="currentPage === 1 
          ? 'border-gray-200 bg-gray-100 text-gray-400' 
          : 'border-gray-300 bg-white text-[#1E293B] hover:border-[#E67E22] hover:text-[#E67E22]'"
      >
         Précédent
      </button>
      
     <button
        @click="goToNext"
        :disabled="currentPage === lastPage"
        class="rounded border px-3 py-1 text-sm transition-all disabled:opacity-40"
        :class="currentPage === lastPage 
          ? 'border-gray-200 bg-gray-100 text-gray-400' 
          : 'border-gray-300 bg-white text-[#1E293B] hover:border-[#E67E22] hover:text-[#E67E22]'"
      >
        Suivant 
      </button> 
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true, default: 1 },
  lastPage: { type: Number, required: true, default: 1 },
  perPage: { type: Number, default: 9 }
})

const emit = defineEmits(['update:perPage', 'page-changed'])

const onPerPageChange = (event) => {
  const newValue = parseInt(event.target.value, 10)
  emit('update:perPage', newValue)
  emit('page-changed', 1, newValue)
}

const goToPrev = () => {
  if (props.currentPage > 1) {
    emit('page-changed', props.currentPage - 1, props.perPage)
  }
}

const goToNext = () => {
  if (props.currentPage < props.lastPage) {
    emit('page-changed', props.currentPage + 1, props.perPage)
  }
}
</script>