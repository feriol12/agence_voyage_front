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
  const fetchTrips = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await tripApi.getAll(params)

      console.log('🔵 fetchTrips params reçus:', params)
    //    console.log('🟢 Réponse complète:', response)
    // console.log('🟢 response.data:', response.data)

      // ✅ Les données sont dans response.data.data.data (attention à la structure)
      // Ta réponse a: { data: { data: [...], current_page: 1, ... } }
      const responseData = response.data.data
    //    console.log('🟢 responseData:', responseData)
    // console.log('🟢 responseData.data:', responseData?.data)  // ← AJOUTE CE LOG
    // console.log('🟢 typeof responseData:', typeof responseData)

      trips.value = responseData || []

      // console.log('🟢 trips.value après assignation:', trips.value)

      // ✅ Les infos de pagination sont dans responseData directement
      meta.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to
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
