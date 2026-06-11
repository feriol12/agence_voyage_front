<template>
  <!-- Afficher un loader pendant le chargement -->
  <div v-if="authStore.loading" class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
    </div>
  </div>

  <!-- Afficher le contenu quand les données sont chargées -->
  <div v-else-if="authStore.user" class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Client</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">Bienvenue {{ authStore.user?.name }}!</p>

      <p class="mt-2 text-sm text-gray-500">Rôle : {{ authStore.userRole }}</p>
      <p class="text-sm text-gray-500">is_admin : {{ authStore.isAdmin }}</p>

      <button
        @click="logout"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>

    
  </div>

  <!-- Rediriger si pas d'utilisateur -->
  <div v-else class="flex justify-center items-center min-h-screen">
    <p>Redirection...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
}

// Forcer le chargement des données si nécessaire
onMounted(async () => {
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }
})
</script>
