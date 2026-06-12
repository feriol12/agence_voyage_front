import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tripApi } from '@/services/apiTrip'

export const useTripStore = defineStore('trip', () => {
  // State
  const trips = ref([])
  const loading = ref(false)
  const error = ref(null)
  const meta = ref(null)

  // Actions
  const fetchTrips = async (page = 1) => {
    loading.value = true
    error.value = null

    try {
      const response = await tripApi.getAll({ page })

      // ✅ Les données sont dans response.data.data.data (attention à la structure)
      // Ta réponse a: { data: { data: [...], current_page: 1, ... } }
      const responseData = response.data.data

      trips.value = responseData.data || []

      // ✅ Les infos de pagination sont dans responseData directement
      meta.value = {
        current_page: responseData.current_page,
        last_page: responseData.last_page,
        per_page: responseData.per_page,
        total: responseData.total,
        from: responseData.from,
        to: responseData.to
      }

      console.log('Trips chargés:', trips.value.length)
      console.log('Meta:', meta.value)

    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de chargement'
      console.error('Erreur fetchTrips:', err)
    } finally {
      loading.value = false
    }
  }

  const createTrip = async (data) => {
    try {
      const response = await tripApi.create(data)
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Erreur lors de la création'
      }
    }
  }

  const updateTrip = async (id, data) => {
    try {
      const response = await tripApi.update(id, data)
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Erreur lors de la mise à jour'
      }
    }
  }

  const deleteTrip = async (id) => {
    try {
      await tripApi.delete(id)
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Erreur lors de la suppression'
      }
    }
  }

  return {
    trips,
    loading,
    error,
    meta,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip
  }
})
