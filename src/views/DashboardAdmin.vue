<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Admin</h1>

    <!-- Grille des statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Total Utilisateurs"
        :value="adminStore.stats.users.total"
        :icon="UsersIcon"
        variant="primary"
      />

      <StatCard
        label="Nouveaux clients"
        :value="adminStore.stats.users.new"
        :icon="UserPlusIcon"
        variant="success"
        :trend="adminStore.stats.users.trend"

      />

      <StatCard
        label="Chiffre d'affaires"
        :value="formatPrice(stats.revenue.total)"
        :icon="CurrencyEuroIcon"
        variant="warning"
        :trend="-3.1"
      />

      <StatCard
        label="Commandes en cours"
        :value="stats.orders.pending"
        :icon="ShoppingBagIcon"
        variant="danger"
        :trend="0"
      />
    </div>

    <!-- Deuxième ligne de stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Voyages actifs"
        :value="stats.trips.active"
        :icon="MapPinIcon"
        variant="default"
      />

      <StatCard
        label="Taux de conversion"
        :value="`${stats.conversion}%`"
        :icon="ChartBarIcon"
        variant="default"
        :trend="5.4"
      />

      <StatCard
        label="Avis clients"
        :value="stats.reviews.average"
        :icon="StarIcon"
        variant="success"
      />

      <StatCard
        label="Documents en attente"
        :value="stats.documents.pending"
        :icon="DocumentTextIcon"
        variant="warning"
        :trend="-2.1"
      />
    </div>

    <!-- Graphiques et tableaux -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphique des ventes -->
      <CardSimple title="Ventes mensuelles">
        <div class="h-64 flex items-center justify-center text-gray-500">
          Graphique des ventes (à implémenter avec Chart.js)
        </div>
      </CardSimple>

      <!-- Dernières commandes -->
      <Card title="Dernières commandes">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2">Client</th>
                <th class="text-left py-2">Montant</th>
                <th class="text-left py-2">Statut</th>
                <th class="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="border-b border-gray-100 dark:border-gray-800">
                <td class="py-2">{{ order.client }}</td>
                <td class="py-2">{{ formatPrice(order.amount) }}</td>
                <td class="py-2">
                  <span :class="statusClass(order.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-2">{{ order.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardSimple from '@/components/admin/CardSimple.vue'
import StatCard from '@/components/admin/StatCard.vue'
import { useAdminStore } from '@/stores/useAdminStore'

// Icônes (Heroicons ou autre)
import {
  UsersIcon,
  UserPlusIcon,
  CurrencyEuroIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ChartBarIcon,
  StarIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()
// Statistiques (à remplacer par des données réelles depuis l'API)
const stats = ref({
  users: { total: 1248, new: 48 },
  revenue: { total: 89250 },
  orders: { pending: 23 },
  trips: { active: 42 },
  conversion: 3.8,
  reviews: { average: 4.7 },
  documents: { pending: 12 }
})

const recentOrders = ref([
  { id: 1, client: 'Jean Dupont', amount: 1250, status: 'payé', date: '2024-06-10' },
  { id: 2, client: 'Marie Martin', amount: 890, status: 'en attente', date: '2024-06-09' },
  { id: 3, client: 'Pierre Durand', amount: 2340, status: 'livré', date: '2024-06-08' },
])

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

const statusClass = (status) => {
  const classes = {
    'payé': 'bg-green-100 text-green-800',
    'en attente': 'bg-yellow-100 text-yellow-800',
    'livré': 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Récupérer les données réelles depuis l'API
// const fetchStats = async () => {
//   try {
//     const response = await api.get('/admin/stats')
//     stats.value = response.data
//   } catch (error) {
//     console.error('Erreur chargement stats:', error)
//   }
// }

onMounted(() => {
  adminStore.fetchUsersStats()
})
</script>
