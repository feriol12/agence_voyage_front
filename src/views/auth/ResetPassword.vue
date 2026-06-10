<template>
  <section class="relative min-h-screen bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="absolute inset-0 bg-black/50"></div>

    <div class="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
      <div class="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

          <div class="flex justify-center mb-4">
            <img class="w-10 h-10" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
          </div>

          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Nouveau mot de passe
          </h1>

          <!-- Message de succès -->
          <div v-if="successMessage" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900/50 dark:text-green-400">
            {{ successMessage }}
          </div>

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900/50 dark:text-red-400">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-4 md:space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                v-model="form.email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nouveau mot de passe</label>
              <input
                type="password"
                v-model="form.password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
            </div>

            <div>
              <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmer le mot de passe</label>
              <input
                type="password"
                v-model="form.password_confirmation"
                id="password_confirmation"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
            </button>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              <router-link to="/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">
                ← Retour à la connexion
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const backgroundImage = ref('https://images.pexels.com/photos/14694797/pexels-photo-14694797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  password_confirmation: ''
})

const handleResetPassword = async () => {
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await api.post('/reset-password', {
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      token: route.query.token // Récupérer le token de l'URL
    })

    if (response.data.status) {
      successMessage.value = response.data.message
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      errorMessage.value = response.data.message
    }
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      errorMessage.value = Object.values(errors).flat().join(', ')
    } else {
      errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}
</script>
