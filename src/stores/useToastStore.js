// import { defineStore } from 'pinia'

// export const useToastStore = defineStore('toast', {
//   state: () => ({
//     isOpen: false,
//     message: '',
//     type: 'success' // success, error, info
//   }),

//   actions: {
//     showToast(message, type = 'success') {
//       this.message = message
//       this.type = type
//       this.isOpen = true
//     },

//     hideToast() {
//       this.isOpen = false
//       this.message = ''
//     },

//     success(message) {
//       this.showToast(message, 'success')
//     },

//     error(message) {
//       this.showToast(message, 'error')
//     },

//     info(message) {
//       this.showToast(message, 'info')
//     }
//   }
// })


import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const isOpen = ref(false)
  const type = ref('success')
  const message = ref('')
  let timeoutId = null

  const showToast = (arg1, arg2) => {
    // Fermer le toast existant
    if (timeoutId) clearTimeout(timeoutId)

    // Cas 1: showToast({ type, message })
    if (typeof arg1 === 'object' && arg1 !== null) {
      type.value = arg1.type || 'success'
      message.value = arg1.message || ''
    }
    // Cas 2: showToast(type, message)
    else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
      type.value = arg1
      message.value = arg2
    }
    // Cas 3: showToast(message) par défaut
    else {
      type.value = 'success'
      message.value = arg1 || ''
    }

    isOpen.value = true

    // Auto-fermeture après 3 secondes
    timeoutId = setTimeout(() => {
      hideToast()
    }, 3000)
  }

  const hideToast = () => {
    isOpen.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return {
    isOpen,
    type,
    message,
    showToast,
    hideToast
  }
})
