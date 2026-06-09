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
            Sign in to your account
          </h1>

          <!-- Affichage des erreurs -->
          <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900/50 dark:text-red-400">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
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

            <!-- Option "Se souvenir de moi" + Mot de passe oublié -->
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    v-model="form.remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="font-light text-gray-500 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>
              <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                Forgot password?
              </a>
            </div>

            <!-- Bouton -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>

            <!-- Lien inscription -->
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Don't have an account?
              <router-link to="/register" class="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Create an account
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
import { useAuthStore } from '@/stores/useAuthStore'
import { authApi } from '@/services/apiAuth'


const backgroundImage = ref('https://images.pexels.com/photos/14694797/pexels-photo-14694797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  if (!form.email || !form.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // ✅ 1. Appel API
    const response = await authApi.login({
      email: form.email,
      password: form.password
    })

    console.log('Réponse brute:', response.data)

    // ✅ 2. Construire l'utilisateur correctement
    const userData = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      is_admin: response.data.is_admin,
      role: response.data.role
    }

    // ✅ 3. Stocker immédiatement
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(userData))

    // ✅ 4. Mettre à jour le store AVANT la redirection
    authStore.token = response.data.token
    authStore.user = userData
    authStore.loading = false

    // ✅ 5. Petite pause pour être sûr que le store est à jour
    await new Promise(resolve => setTimeout(resolve, 100))

    // ✅ 6. Redirection selon le rôle
    if (userData.is_admin) {
      router.push('/admin/dashboard')
    } else {
      router.push('dashboard')
    }

  } catch (error) {
    console.error('Erreur:', error.response?.data)
    errorMessage.value = error.response?.data?.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>
<!-- <script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/apiAuth'

// 🔥 L'IMAGE DE FOND
const backgroundImage = ref('https://images.pexels.com/photos/14694797/pexels-photo-14694797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  // Validation simple
  if (!form.email || !form.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Appel API Laravel pour la connexion
    const response = await authApi.login({
      email: form.email,
      password: form.password
    })

    console.log('Réponse complète:', response.data)  // ← DEBUG

    // 1. Stocker le token
    localStorage.setItem('token', response.data.token)

    // 2. Stocker l'utilisateur avec is_admin et role
    const user = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      is_admin: response.data.is_admin,      // ← IMPORTANT !
      role: response.data.role               // ← IMPORTANT !
    }
    localStorage.setItem('user', JSON.stringify(user))

    // 3. Option "remember me"
    if (form.remember) {
      localStorage.setItem('remember_email', form.email)
    } else {
      localStorage.removeItem('remember_email')
    }

    // 4. Redirection selon le rôle
    if (user.is_admin) {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }

  } catch (error) {
    console.error('Erreur:', error.response?.data)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      errorMessage.value = Object.values(errors).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Invalid email or password'
    }
  } finally {
    loading.value = false
  }
}

// Optionnel : charger l'email sauvegardé si "remember me"
const loadRememberedEmail = () => {
  const rememberedEmail = localStorage.getItem('remember_email')
  if (rememberedEmail) {
    form.email = rememberedEmail
    form.remember = true
  }
}

loadRememberedEmail()
</script> -->
