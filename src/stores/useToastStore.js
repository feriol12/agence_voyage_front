import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    isOpen: false,
    message: '',
    type: 'success' // success, error, info
  }),

  actions: {
    showToast(message, type = 'success') {
      this.message = message
      this.type = type
      this.isOpen = true
    },

    hideToast() {
      this.isOpen = false
      this.message = ''
    },

    success(message) {
      this.showToast(message, 'success')
    },

    error(message) {
      this.showToast(message, 'error')
    },

    info(message) {
      this.showToast(message, 'info')
    }
  }
})