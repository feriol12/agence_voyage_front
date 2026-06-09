<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">Bienvenue {{ user?.name }}!</p>

      <button
        @click="logout"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/apiAuth'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(null)

const logout = async () => {
  try {
    await authApi.logout()
  } catch (error) {
    console.error(error)
  } finally {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

onMounted(async () => {
  try {
    const response = await authStore.getUser()
    user.value = response.data.user
  } catch (error) {
    router.push('/login')
  }
})
</script>
