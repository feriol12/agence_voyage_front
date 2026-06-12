<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="toastStore.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div class="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <!-- Bandeau coloré en haut -->
            <div :class="topBarClass" class="h-1.5 w-full"></div>
            
            <!-- Contenu -->
            <div class="p-6 text-center">
              <!-- Icône animée -->
              <div class="mb-4 inline-flex items-center justify-center">
                <div :class="iconBgClass" class="rounded-full p-3">
                  <span class="text-3xl">{{ icon }}</span>
                </div>
              </div>
              
              <!-- Titre -->
              <h3 class="mb-2 text-xl font-semibold" :class="titleClass">
                {{ modalTitle }}
              </h3>
              
              <!-- Message -->
              <p class="text-sm text-[#64748B]">
                {{ toastStore.message }}
              </p>
              
              <!-- Bouton -->
              <button
                @click="toastStore.hideToast()"
                :class="buttonClass"
                class="mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {{ buttonText }}
              </button>
            </div>
            
            <!-- Bouton fermeture en haut à droite -->
            <button
              @click="toastStore.hideToast()"
              class="absolute right-3 top-3 rounded-full p-1 text-[#94A3B8] transition-colors hover:bg-gray-100 hover:text-[#1E293B]"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/useToastStore'

const toastStore = useToastStore()

// Titre selon le type
const modalTitle = computed(() => {
  const titles = {
    success: 'Opération réussie',
    error: 'Une erreur est survenue',
    info: 'Information'
  }
  return titles[toastStore.type] || 'Information'
})

// Icône selon le type
const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'i'
  }
  return icons[toastStore.type] || '✓'
})

// Couleur de la barre du haut
const topBarClass = computed(() => {
  const classes = {
    success: 'bg-[#27AE60]',
    error: 'bg-[#E74C3C]',
    info: 'bg-[#3498DB]'
  }
  return classes[toastStore.type] || classes.success
})

// Couleur de l'icône (fond)
const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-[#27AE60]/10',
    error: 'bg-[#E74C3C]/10',
    info: 'bg-[#3498DB]/10'
  }
  return classes[toastStore.type] || classes.success
})

// Couleur du titre
const titleClass = computed(() => {
  const classes = {
    success: 'text-[#27AE60]',
    error: 'text-[#E74C3C]',
    info: 'text-[#3498DB]'
  }
  return classes[toastStore.type] || classes.success
})

// Couleur du bouton
const buttonClass = computed(() => {
  const classes = {
    success: 'bg-[#27AE60] text-white hover:bg-[#219A52] focus:ring-[#27AE60]/50',
    error: 'bg-[#E74C3C] text-white hover:bg-[#C0392B] focus:ring-[#E74C3C]/50',
    info: 'bg-[#3498DB] text-white hover:bg-[#2980B9] focus:ring-[#3498DB]/50'
  }
  return classes[toastStore.type] || classes.success
})

// Texte du bouton
const buttonText = computed(() => {
  const texts = {
    success: 'Fermer',
    error: 'Compris',
    info: 'OK'
  }
  return texts[toastStore.type] || 'Fermer'
})
</script>