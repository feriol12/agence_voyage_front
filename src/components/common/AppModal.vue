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
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Overlay (fond noir transparent) -->
        <div class="fixed inset-0 bg-black/50" @click="handleOutsideClick" />

        <!-- Conteneur centré -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
          >
            <div
              v-if="isOpen"
              class="relative w-full rounded-xl bg-white shadow-2xl"
              :class="maxWidthClass"
            >
              <!-- Header avec titre et bouton fermeture -->
              <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 class="text-lg font-semibold text-[#1E293B]">
                  {{ title }}
                </h3>
                <button
                  @click="close"
                  class="rounded-lg p-1 text-[#94A3B8] transition-colors hover:bg-gray-100 hover:text-[#1E293B]"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Contenu principal (slot) -->
              <div class="px-6 py-4">
                <slot />
              </div>

              <!-- Footer avec boutons d'action -->
              <div class="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  v-if="showCancelButton"
                  @click="close"
                  class="rounded-lg px-4 py-2 text-sm font-medium text-[#64748B] transition-colors hover:bg-gray-100"
                >
                  {{ cancelText }}
                </button>
                <button
                  v-if="showConfirmButton"
                  @click="confirm"
                  class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  :class="confirmButtonClass"
                >
                  {{ confirmText }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: 'Confirmer',
  },
  cancelText: {
    type: String,
    default: 'Annuler',
  },
  confirmButtonVariant: {
    type: String,
    default: 'primary',
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close', 'confirm', 'update:isOpen'])

const maxWidthClass = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  return sizes[props.size] || 'max-w-lg'
})

const confirmButtonClass = computed(() => {
  const variants = {
    primary: 'bg-[#0F3B5C] text-white hover:bg-[#0A2A42]',
    danger: 'bg-[#E74C3C] text-white hover:bg-[#C0392B]',
    success: 'bg-[#27AE60] text-white hover:bg-[#1E8449]',
  }
  return variants[props.confirmButtonVariant] || variants.primary
})

const close = () => {
  emit('update:isOpen', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
}

const handleOutsideClick = () => {
  if (props.closeOnOutsideClick) {
    close()
  }
}

// Fermeture avec la touche ESC
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          close()
        }
      }
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }
)
</script>