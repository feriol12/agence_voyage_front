import { defineStore } from 'pinia'
import { apiDestinationDocument } from '@/services/apiDestinationDocument'
import { useToastStore } from './useToastStore'

export const useDestinationDocumentStore = defineStore('destinationDocument', {
    state: () => ({
        destination: null,
        assignedDocuments: [],      // ✅ Documents assignés à cette destination
        availableDocuments: [],     // ✅ Documents disponibles (non assignés)
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDocumentsByDestination(destinationId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiDestinationDocument.getByDestination(destinationId)
                this.destination = response.data.destination
                this.assignedDocuments = response.data.assigned_documents || []
                
                // ✅ Documents disponibles = tous les documents - ceux assignés
                const allDocs = response.data.all_documents || []
                const assignedIds = this.assignedDocuments.map(d => d.id)
                this.availableDocuments = allDocs.filter(d => !assignedIds.includes(d.id))
            } catch (err) {
                this.error = err.response?.data?.message || 'Erreur lors du chargement'
                console.error(err)
            } finally {
                this.loading = false
            }
        },

        // ✅ Ajouter un document à la liste (sans sauvegarde)
        addDocumentToAssignment(documentId) {
            const doc = this.availableDocuments.find(d => d.id === documentId)
            if (doc) {
                // Ajouter avec pivot par défaut
                this.assignedDocuments.push({
                    ...doc,
                    pivot: {
                        is_mandatory: false,
                        is_active: true,
                    }
                })
                // Retirer des disponibles
                this.availableDocuments = this.availableDocuments.filter(d => d.id !== documentId)
            }
        },

        // ✅ Retirer un document (sans sauvegarde)
        removeDocumentFromAssignment(documentId) {
            const removed = this.assignedDocuments.find(d => d.id === documentId)
            if (removed) {
                this.assignedDocuments = this.assignedDocuments.filter(d => d.id !== documentId)
                // Ajouter aux disponibles
                this.availableDocuments.push({
                    id: removed.id,
                    name: removed.name,
                    code: removed.code,
                })
            }
        },

        // ✅ Modifier l'obligation d'un document (sans sauvegarde)
        toggleMandatory(documentId) {
            const doc = this.assignedDocuments.find(d => d.id === documentId)
            if (doc) {
                doc.pivot.is_mandatory = !doc.pivot.is_mandatory
            }
        },

        // ✅ Synchroniser (sauvegarder)
        async syncDocuments(destinationId) {
            this.loading = true
            const toastStore = useToastStore()
            try {
                const payload = {
                    documents: this.assignedDocuments.map(d => ({
                        id: d.id,
                        is_mandatory: d.pivot?.is_mandatory || false,
                        is_active: d.pivot?.is_active || true,
                    }))
                }
                await apiDestinationDocument.sync(destinationId, payload)
                toastStore.showToast('Modifications enregistrées avec succès')
            } catch (err) {
                const message = err.response?.data?.message || 'Erreur lors de l\'enregistrement'
                toastStore.showToast('error', message)
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})