import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clientTripApi } from '@/services/apiClientTrip'

export const useClientTripStore = defineStore('clientTrip', () => {
  // ==================== STATE (les données) ====================
  const clientTrips = ref([])      // Liste des inscriptions
  const meta = ref(null)            // Pagination (total, page, etc.)
  const loading = ref(false)        // Indicateur de chargement
  const error = ref(null)           // Message d'erreur

  // ==================== ACTIONS (les fonctions) ====================

  // 1. Récupérer toutes les inscriptions (avec pagination et filtres)
  const fetchClientTrips = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await clientTripApi.getAll(params)

      // La réponse contient { data: [inscriptions], current_page, last_page, ... }
      clientTrips.value = response.data.data.data  // ← les inscriptions
      meta.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total: response.data.data.total,
        per_page: response.data.data.per_page
      }

      return { success: true, data: clientTrips.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de chargement'
      console.error('Erreur fetchClientTrips:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 2. Créer une inscription
  const createClientTrip = async (data) => {
    try {
      const response = await clientTripApi.create(data)
      return { success: true, data: response.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la création'
      console.error('Erreur createClientTrip:', err)
      return { success: false, message }
    }
  }

  // 3. Mettre à jour le statut
  const updateClientTripStatus = async (id, status) => {
    try {
      const response = await clientTripApi.updateStatus(id, status)
      return { success: true, data: response.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour du statut'
      console.error('Erreur updateClientTripStatus:', err)
      return { success: false, message }
    }
  }

  // 4. Mettre à jour les notes
  const updateClientTripNotes = async (id, notes) => {
    try {
      const response = await clientTripApi.updateNotes(id, notes)
      return { success: true, data: response.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour des notes'
      console.error('Erreur updateClientTripNotes:', err)
      return { success: false, message }
    }
  }

  // 5. Supprimer une inscription
  const deleteClientTrip = async (id) => {
    try {
      await clientTripApi.delete(id)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression'
      console.error('Erreur deleteClientTrip:', err)
      return { success: false, message }
    }
  }

  // 6. Récupérer les voyages du client connecté (front client)
  const fetchMyTrips = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await clientTripApi.getMyTrips()
      clientTrips.value = response.data.data
      return { success: true, data: clientTrips.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de chargement'
      console.error('Erreur fetchMyTrips:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 7. Réinitialiser le store
  const reset = () => {
    clientTrips.value = []
    meta.value = null
    loading.value = false
    error.value = null
  }

  // ==================== RETOUR ====================
  return {
    // State
    clientTrips,
    meta,
    loading,
    error,

    // Actions
    fetchClientTrips,
    createClientTrip,
    updateClientTripStatus,
    updateClientTripNotes,
    deleteClientTrip,
    fetchMyTrips,
    reset
  }
})
