<template>
  <nav v-if="authStore.user !== null" class="bg-[#0F3B5C] shadow-md fixed top-0 left-0 w-full z-50">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-white font-bold text-xl">
            ✈️ AgenceVoyage
          </router-link>
        </div>

        <!-- Menu desktop (caché sur mobile) -->
        <div class="hidden md:flex items-center space-x-2">
          <template v-for="item in menuItems" :key="item.path">
            <!-- Élément avec sous-menu -->
            <div v-if="item.children" class="relative group">
              <button
                class="text-gray-200 hover:bg-[#E67E22] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                :class="{ 'bg-[#E67E22] text-white': isActive(item.path) }"
              >
                {{ item.name }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <!-- Sous-menu -->
              <div class="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                <router-link
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-[#E67E22] hover:text-white transition-colors"
                >
                  <span>{{ child.name }}</span>
                  <span v-if="child.badge" class="bg-[#E74C3C] text-white text-xs rounded-full px-2 py-0.5">
                    {{ child.badge }}
                  </span>
                </router-link>
              </div>
            </div>

            <!-- Élément simple -->
            <router-link v-else :to="item.path" class="text-gray-200 hover:bg-[#E67E22] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" :class="{ 'bg-[#E67E22] text-white': isActive(item.path) }">
              {{ item.name }}
            </router-link>
          </template>
        </div>

        <!-- Droite : notifications + utilisateur -->
        <div class="flex items-center space-x-4">

          <!-- Icône notifications -->
          <button class="relative text-gray-200 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-[#E74C3C] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {{ unreadCount }}
            </span>
          </button>

          <!-- Avatar + dropdown -->
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
              <div class="w-8 h-8 bg-[#E67E22] rounded-full flex items-center justify-center text-white font-semibold">
                {{ userInitials }}
              </div>
              <span class="text-gray-200 text-sm hidden sm:block">{{ userName }}</span>
              <svg class="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                👤 Mon profil
              </router-link>
              <router-link to="/admin/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                ⚙️ Paramètres
              </router-link>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>

        <!-- Bouton menu mobile -->
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-200 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile (affiché quand ouvert) -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-[#0F3B5C] border-t border-[#1E4A6E] py-2">
      <div class="px-2 space-y-1">
        <template v-for="item in menuItems" :key="item.path">
          <router-link
            v-if="!item.children"
            :to="item.path"
            class="block text-gray-200 hover:bg-[#E67E22] hover:text-white px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
          <div v-else>
            <div class="text-gray-200 px-3 py-2 text-base font-medium">
              {{ item.name }}
            </div>
            <div class="pl-4 space-y-1">
              <router-link
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                class="block text-gray-300 hover:bg-[#E67E22] hover:text-white px-3 py-2 rounded-md text-sm"
                @click="mobileMenuOpen = false"
              >
                {{ child.name }}
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
  <div v-else class="bg-[#0F3B5C] shadow-md h-16">
    <div class="px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div class="text-white">Chargement...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const authStore = useAuthStore()

const dropdownOpen = ref(false)
const mobileMenuOpen = ref(false)
const unreadCount = ref(3)

const userName = computed(() => authStore.user?.name || 'Invité')
const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.substring(0, 2).toUpperCase()
})

// ✅ Menu avec sous-menu Documents
const menuItems = computed(() => {
  if (authStore.isAdmin) {
    return [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Destinations', path: '/admin/destinations' },
      { name: 'Clients', path: '/admin/clients' },
      { name: 'Voyages', path: '/admin/trips' },
      {
        name: 'Documents',
        path: '/admin/documents',
        children: [
          { name: 'Types de documents', path: '/admin/document-types' },
          { name: 'À valider', path: '/admin/documents/pending', badge: 5 }
        ]
      },
      { name: 'Paiements', path: '/admin/payments' }
    ]
  }
  return [
    { name: 'Mon dossier', path: '/client/dashboard' },
    { name: 'Mes documents', path: '/client/documents' },
    { name: 'Mes paiements', path: '/client/payments' },
    { name: 'Suivi', path: '/client/timeline' }
  ]
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    await authStore.logout()
  }
}

const handleClickOutside = (event) => {
  if (dropdownOpen.value && !event.target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>