import { defineStore } from 'pinia'

export const useConfirmStore = defineStore('confirm', {
  state: () => ({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    confirmVariant: 'danger', // danger, primary, success
    onConfirm: null
  }),

  actions: {
    showConfirm({ title, message, confirmText = 'Supprimer', cancelText = 'Annuler', confirmVariant = 'danger', onConfirm }) {
      this.title = title
      this.message = message
      this.confirmText = confirmText
      this.cancelText = cancelText
      this.confirmVariant = confirmVariant
      this.onConfirm = onConfirm
      this.isOpen = true
    },

    hideConfirm() {
      this.isOpen = false
      this.onConfirm = null
    },

    confirm() {
      if (this.onConfirm) {
        this.onConfirm()
      }
      this.hideConfirm()
    }
  }
})