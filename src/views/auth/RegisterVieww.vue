<template>
  <section class="relative min-h-screen bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${backgroundImage})` }">

    <!-- Overlay sombre pour que le formulaire soit lisible -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Contenu (formulaire) centré par-dessus l'image -->
    <div class="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
      <div class="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

          <!-- Logo / Titre -->
          <div class="flex justify-center mb-4">
            <img class="w-10 h-10" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
          </div>

          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Create your Free Account
          </h1>

          <!-- Affichage des erreurs -->
          <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900/50 dark:text-red-400">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4 md:space-y-6">
             <!-- Nom -->
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
              <input
                type="name"
                v-model="form.name"
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="John Doe"
                required
              >
            </div>
            <!-- Email -->
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input
                type="email"
                v-model="form.email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              >
            </div>

            <!-- Mot de passe -->
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                type="password"
                v-model="form.password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
            </div>

            <!-- Confirmer mot de passe -->
            <div>
              <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
              <input
                type="password"
                v-model="form.password_confirmation"
                id="password_confirmation"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
            </div>



            <!-- Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.acceptedTerms"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
                  required
                >
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">
                  I accept the <a href="#" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <!-- Bouton -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
            >
              {{ loading ? 'Creating account...' : 'Create an account' }}
            </button>

            <!-- Lien connexion -->
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Already have an account?
              <router-link to="/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Login here
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
import { useRouter } from 'vue-router'
import { authApi } from '@/services/apiAuth'

// 🔥 L'IMAGE DE FOND - à changer selon ton besoin
const backgroundImage = ref('https://images.pexels.com/photos/14694797/pexels-photo-14694797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')

// Tu pourras facilement changer l'URL plus tard
// const backgroundImage = ref('/src/assets/votre-image.jpg')

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')


// Générer les années (1900 à 2026)
// const currentYear = new Date().getFullYear()
// const years = ref([])
// for (let i = currentYear; i >= 1900; i--) {
//   years.value.push(i)
// }

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  // birthDay: '',
  // birthMonth: '',
  // birthYear: '',
  // acceptedTerms: false
})

const handleRegister = async () => {
  if (!form.acceptedTerms) {
    errorMessage.value = 'You must accept the Terms and Conditions'
    return
  }

  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Appel API Laravel
    const response = await authApi.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    })

    localStorage.setItem('auth_token', response.data.token)
    router.push('/dashboard')

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
