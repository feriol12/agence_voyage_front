import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/services/apiUser'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await userApi.getAll(params)
      users.value = response.data.data
      return { success: true, data: users.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de chargement'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers
  }
})
