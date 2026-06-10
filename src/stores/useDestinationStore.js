import { defineStore } from 'pinia'
import { apiDestination } from '@/services/apiDestination'

export const useDestinationStore = defineStore('destination', {
    state: () => ({
        destinations: [],
        meta: {
            total: 0,
            per_page: 15,
            current_page: 1,
            last_page: 1
        },
        currentDestination: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchDestinations(page = 1) {
            this.loading = true
            this.error = null
            try {
                const response = await apiDestination.getAll(page)
                
                // Adaptation robuste
                if (response.data && response.data.data) {
                    this.destinations = response.data.data
                    this.meta = response.data.meta || {
                        total: 0,
                        per_page: 15,
                        current_page: page,
                        last_page: 1
                    }
                } else if (Array.isArray(response.data)) {
                    this.destinations = response.data
                } else {
                    this.destinations = []
                }
                
                console.log('Destinations chargées:', this.destinations.length)
            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors du chargement'
                console.error(err)
            } finally {
                this.loading = false
            }
        },

        async fetchDestination(id) {
            this.loading = true
            this.error = null
            try {
                const response = await apiDestination.getById(id)
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
            this.error = null
            try {
                const response = await apiDestination.create(data)
                // 🔧 FIX : on recharge TOUJOURS la page 1 (pas besoin de meta)
                await this.fetchDestinations(1)
                return response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors de la création'
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateDestination(id, data) {
            this.loading = true
            this.error = null
            try {
                const response = await apiDestination.update(id, data)
                // 🔧 FIX : on recharge TOUJOURS la page 1
                await this.fetchDestinations(1)
                return response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors de la modification'
                throw err
            } finally {
                this.loading = false
            }
        },

        async deleteDestination(id) {
            this.loading = true
            this.error = null
            try {
                await apiDestination.delete(id)
                // 🔧 FIX : on recharge TOUJOURS la page 1
                await this.fetchDestinations(1)
            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors de la suppression'
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})