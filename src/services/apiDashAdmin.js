import api from './api'

export const dashAdminApi = {
  // Statistiques utilisateurs
  getUsersStats() {
    return api.get('/admin/stats/users')
  },

  // Plus tard, ajouter d'autres stats
  // getRevenueStats() { return api.get('/admin/stats/revenue') },
  // getOrdersStats() { return api.get('/admin/stats/orders') },
}
