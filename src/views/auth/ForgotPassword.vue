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
            Mot de passe oublié ?
          </h1>

          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <!-- Message de succès -->
          <div v-if="successMessage" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900/50 dark:text-green-400">
            {{ successMessage }}
          </div>

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900/50 dark:text-red-400">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleForgotPassword" class="space-y-4 md:space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre email</label>
              <input
                type="email"
                v-model="form.email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              >
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
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
import { ref, reactive } from 'vue'
import api from '@/services/api'

const backgroundImage = ref('https://images.pexels.com/photos/14694797/pexels-photo-14694797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  email: ''
})

const handleForgotPassword = async () => {
  if (!form.email) {
    errorMessage.value = 'Veuillez entrer votre email'
    return
  }

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await api.post('/forgot-password', {
      email: form.email
    })

    if (response.data.status) {
      successMessage.value = response.data.message
      form.email = '' // Vider le champ
    } else {
      errorMessage.value = response.data.message
    }
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.data?.errors?.email) {
      errorMessage.value = error.response.data.errors.email[0]
    } else {
      errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}
</script>
