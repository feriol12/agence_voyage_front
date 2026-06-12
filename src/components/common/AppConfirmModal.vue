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
      <div v-if="confirmStore.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div class="relative mx-4 w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
            <!-- Contenu compact -->
            <div class="p-5 text-center">
              <!-- Icône rouge -->
              <div class="mb-3 inline-flex items-center justify-center">
                <div class="rounded-full bg-red-50 p-2.5">
                  <svg class="h-6 w-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              
              <!-- Titre -->
              <h3 class="mb-1 text-base font-semibold text-[#1E293B]">
                {{ confirmStore.title || 'Confirmer la suppression' }}
              </h3>
              
              <!-- Message -->
              <p class="text-xs text-[#64748B]">
                {{ confirmStore.message || 'Êtes-vous sûr de vouloir supprimer cet élément ?' }}
              </p>
              
              <!-- Boutons -->
              <div class="mt-5 flex gap-2">
                <button
                  @click="confirmStore.hideConfirm()"
                  class="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#64748B] transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E2E8F0]/50"
                >
                  {{ confirmStore.cancelText }}
                </button>
                <button
                  @click="confirmStore.confirm()"
                  class="flex-1 rounded-lg bg-[#E74C3C] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#E74C3C]/50"
                >
                  {{ confirmStore.confirmText }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useConfirmStore } from '@/stores/useConfirmStore'

const confirmStore = useConfirmStore()
</script>