import { defineStore } from 'pinia'
import { apiDocumentType } from '@/services/apiDocumentType'
import { useToastStore } from './useToastStore'

export const useDocumentTypeStore = defineStore('documentType', {
    state: () => ({
        documentTypes: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDocumentTypes() {
            this.loading = true
            this.error = null
            try {
                const response = await apiDocumentType.getAll()
                this.documentTypes = response.data.data || []
            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors du chargement'
                console.error(err)
            } finally {
                this.loading = false
            }
        },

        async createDocumentType(data) {
            this.loading = true
            const toastStore = useToastStore()
            try {
                const response = await apiDocumentType.create(data)
                await this.fetchDocumentTypes()
                toastStore.showToast('Type de document créé avec succès')
                return response.data
            } catch (err) {
                const message = err.response?.data?.message || 'Erreur lors de la création'
                toastStore.showToast('error', message)
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateDocumentType(id, data) {
            this.loading = true
            const toastStore = useToastStore()
            try {
                const response = await apiDocumentType.update(id, data)
                await this.fetchDocumentTypes()
                toastStore.showToast('Type de document modifié avec succès')
                return response.data
            } catch (err) {
                const message = err.response?.data?.message || 'Erreur lors de la modification'
                toastStore.showToast('error', message)
                throw err
            } finally {
                this.loading = false
            }
        },

        async deleteDocumentType(id) {
            this.loading = true
            const toastStore = useToastStore()
            try {
                await apiDocumentType.delete(id)
                await this.fetchDocumentTypes()
                toastStore.showToast('Type de document supprimé avec succès')
            } catch (err) {
                const message = err.response?.data?.message || 'Erreur lors de la suppression'
                toastStore.showToast('error', message)
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})