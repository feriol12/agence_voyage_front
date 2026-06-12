import { defineStore } from 'pinia'
import { apiDestination } from '@/services/apiDestination'
import { useToastStore } from './useToastStore'

export const useDestinationStore = defineStore('destination', {
  state: () => ({
    destinations: [],
    meta: {
      total: 0,
      per_page: 15,
      current_page: 1,
      last_page: 1,
    },
    currentDestination: null,
    loading: false,
    error: null,
  }),

  actions: {
  async fetchDestinations(page = 1, perPage = null) {
    this.loading = true
    this.error = null
    try {
        const currentPerPage = perPage || this.meta.per_page
        const cleanPage = parseInt(page, 10) || 1
        const cleanPerPage = parseInt(currentPerPage, 10) || 9

        const response = await apiDestination.getAll(cleanPage, cleanPerPage)

        this.destinations = response.data.data || []
        this.meta = {
            total: response.data.meta?.total || 0,
            per_page: response.data.meta?.per_page || cleanPerPage,
            current_page: response.data.meta?.current_page || cleanPage,
            last_page: response.data.meta?.last_page || 1
        }

        console.log('Store meta mis à jour:', this.meta) // Debug

    } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement'
        console.error(err)
    } finally {
        this.loading = false
    }
},

    async setPerPage(perPage) {
        this.meta.per_page = perPage
        await this.fetchDestinations(1, perPage)
    },

    async fetchDestination(id) {
      this.loading = true
      this.error = null
      try {
        const response = await apiDestination.getById(id) // ← getById (pas getByIdAdmin)
        this.currentDestination = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async createDestination(data) {
      this.loading = true
      const toastStore = useToastStore()
      try {
        const response = await apiDestination.create(data)
        await this.fetchDestinations(1)
        // toastStore.success('Destination créée avec succès')
        toastStore.showToast('success', 'Destination créée avec succès')
        return response.data
      } catch (err) {
        const message = err.response?.data?.message || 'Erreur lors de la création'
        // toastStore.error(message)
        toastStore.showToast('error', message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateDestination(id, data) {
      this.loading = true
      const toastStore = useToastStore()
      try {
        const response = await apiDestination.update(id, data)
        await this.fetchDestinations(1)
        // toastStore.success('Destination modifiée avec succès')
        toastStore.showToast('success', 'Destination modifiée avec succès')
        return response.data
      } catch (err) {
        const message = err.response?.data?.message || 'Erreur lors de la modification'
        toastStore.showToast('error', message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteDestination(id) {
      this.loading = true
      const toastStore = useToastStore()
      try {
        await apiDestination.delete(id)
        await this.fetchDestinations(1)
        toastStore.showToast('success', 'Destination supprimée avec succès')
      } catch (err) {
        const message = err.response?.data?.message || 'Erreur lors de la suppression'
        toastStore.showToast('error', message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async toggleActive(id, isActive) {
      this.loading = true
      const toastStore = useToastStore()
      try {
        // ⭐ Envoyer uniquement is_active
        await apiDestination.update(id, { is_active: isActive })
        await this.fetchDestinations(this.meta.current_page)
        toastStore.showToast('success', `Destination ${isActive ? 'activée' : 'désactivée'} avec succès`)
      } catch (err) {
        const message = err.response?.data?.message || 'Erreur lors du changement de statut'
        toastStore.showToast('error', message)
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
