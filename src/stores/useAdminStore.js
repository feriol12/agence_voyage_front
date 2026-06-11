import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashAdminApi } from '@/services/apiDashAdmin';

export const useAdminStore = defineStore('admin', () => {
  // State
  const stats = ref({
    users: {
      total: 0,
      new: 0,
      trend: 0
    },
    revenue: { total: 0 },
    orders: { pending: 0 },
    trips: { active: 0 },
    conversion: 0,
    reviews: { average: 0 },
    documents: { pending: 0 }
  });

  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchUsersStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await dashAdminApi.getUsersStats();

      if (response.data.status) {
        // Mettre à jour uniquement les stats utilisateurs
        stats.value.users.total = response.data.data.total;
        stats.value.users.new = response.data.data.new_this_month;
        stats.value.users.trend = response.data.data.trend;
      }
    } catch (err) {
      console.error('Erreur fetchUsersStats:', err);
      error.value = err.response?.data?.message || 'Erreur de chargement';
    } finally {
      loading.value = false;
    }
  };

  // Plus tard, pour les autres stats
  // const fetchFullStats = async () => { ... }

  return {
    stats,
    loading,
    error,
    fetchUsersStats,
  };
});
