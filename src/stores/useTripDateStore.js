import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tripDateApi } from '@/services/apiTripDate'

export const useTripDateStore = defineStore('tripDate', () => {
  const dates = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchDates = async (tripId) => {
    loading.value = true
    error.value = null

    try {
      const response = await tripDateApi.getAll(tripId)
      dates.value = response.data.data || []
      return { success: true, data: dates.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de chargement'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const createDate = async (tripId, data) => {
    try {
      const response = await tripDateApi.create(tripId, data)

      return { success: true, data: response.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la création'
      return { success: false, message }
    }
  }

  const updateDate = async (tripId, tripDateId, data) => {
          console.log('📡 updateDate appelé:', { tripId, tripDateId, data })

    try {
      const response = await tripDateApi.update(tripId, tripDateId, data)
       console.log('✅ Réponse update:', response.data)
      return { success: true, data: response.data.data }
    } catch (err) {
       console.error('❌ Erreur update:', err.response?.data)
      const message = err.response?.data?.message || 'Erreur lors de la modification'
      return { success: false, message }
    }
  }

  const deleteDate = async (tripId, tripDateId) => {
    try {
      await tripDateApi.delete(tripId, tripDateId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression'
      return { success: false, message }
    }
  }

  const reset = () => {
    dates.value = []
    loading.value = false
    error.value = null
  }

  return {
    dates,
    loading,
    error,
    fetchDates,
    createDate,
    updateDate,
    deleteDate,
    reset
  }
})
