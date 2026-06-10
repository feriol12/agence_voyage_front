<template>
  <div class="bg-gray-100 dark:bg-gray-900">
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
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
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
}
</script>
