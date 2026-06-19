import { defineStore } from 'pinia'
import { apiDestination } from '@/services/apiDestination'
import { useToastStore } from './useToastStore'

// ✅ Normaliseur pour les métadonnées (corrige les tableaux)
const normalizeMeta = (meta, defaults) => {
    const extract = (value, fallback) => {
        if (value === undefined || value === null) return fallback
        if (Array.isArray(value)) return value.length > 0 ? Number(value[0]) : fallback
        return Number(value)
    }
    
    return {
        total: extract(meta.total, defaults.total),
        per_page: extract(meta.per_page, defaults.per_page),
        current_page: extract(meta.current_page, defaults.current_page),
        last_page: extract(meta.last_page, defaults.last_page)
    }
}

export const useDestinationStore = defineStore('destination', {
    state: () => ({
        destinations: [],
        meta: {
            total: 0,
            per_page: 9,
            current_page: 1,
            last_page: 1,
        },
        activeContinent: '',
        activeStatus: '',
        searchQuery: '',
        currentDestination: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDestinations(page = 1, perPage = null, search = null, continent = null, isActive = null) {
            this.loading = true
            this.error = null
            try {
                const currentPerPage = perPage || this.meta.per_page
                const cleanPage = parseInt(page, 10) || 1
                const cleanPerPage = parseInt(currentPerPage, 10) || 9

                const response = await apiDestination.getAll(
                    cleanPage,
                    cleanPerPage,
                    search !== null ? search : this.searchQuery,
                    continent !== null ? continent : this.activeContinent,
                    isActive !== null ? isActive : this.activeStatus,
                )

                this.destinations = response.data.data || []

                // ✅ Normalisation des métadonnées (corrige les tableaux)
                this.meta = normalizeMeta(response.data.meta || {}, {
                    total: 0,
                    per_page: cleanPerPage,
                    current_page: cleanPage,
                    last_page: 1
                })

            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors du chargement'
                console.error(err)
            } finally {
                this.loading = false
            }
        },

        async filterByContinent(continent) {
            this.activeContinent = continent
            this.meta.current_page = 1
            await this.fetchDestinations(1, this.meta.per_page, this.searchQuery, continent, this.activeStatus)
        },

        async filterByStatus(isActive) {
            this.activeStatus = isActive
            this.meta.current_page = 1
            await this.fetchDestinations(1, this.meta.per_page, this.searchQuery, this.activeContinent, isActive)
        },

        async resetFilters() {
            this.searchQuery = ''
            this.activeContinent = ''
            this.activeStatus = ''
            this.meta.current_page = 1
            await this.fetchDestinations(1, this.meta.per_page, '', '', '')
        },

        async searchDestinations(search) {
            this.searchQuery = search
            this.meta.current_page = 1
            await this.fetchDestinations(1, this.meta.per_page, search)
        },

        async resetSearch() {
            this.searchQuery = ''
            this.meta.current_page = 1
            await this.fetchDestinations(1, this.meta.per_page, '')
        },

        async setPerPage(perPage) {
            this.meta.per_page = perPage
            await this.fetchDestinations(1, perPage)
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
            const toastStore = useToastStore()
            try {
                const response = await apiDestination.create(data)
                await this.fetchDestinations(1)
                toastStore.showToast('Destination créée avec succès')
                return response.data
            } catch (err) {
                const message = err.response?.data?.message || 'Erreur lors de la création'
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
                await this.fetchDestinations(this.meta.current_page)
                toastStore.showToast('Destination modifiée avec succès')
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
                await this.fetchDestinations(this.meta.current_page)
                toastStore.showToast('Destination supprimée avec succès')
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
                await apiDestination.update(id, { is_active: isActive })
                const currentPage = this.meta?.current_page || 1
                await this.fetchDestinations(currentPage)
                toastStore.showToast(`Destination ${isActive ? 'activée' : 'désactivée'} avec succès`)
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