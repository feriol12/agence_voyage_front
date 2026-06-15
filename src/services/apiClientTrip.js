import api from './api'

export const clientTripApi = {
  // 1. Récupérer TOUTES les inscriptions (admin)
  getAll(params) {
    // params = { page: 1, status: 'pending', user_id: 2, trip_id: 1 }
    return api.get('/admin/client-trips', { params })
  },

  // 2. Récupérer une inscription par son ID
  getById(id) {
    return api.get(`/admin/client-trips/${id}`)
  },

  // 3. Créer une nouvelle inscription
  create(data) {
    // data = { user_id, trip_id, trip_date_id, notes }
    return api.post('/admin/client-trips', data)
  },

  // 4. Mettre à jour le STATUT
  updateStatus(id, status) {
    return api.put(`/admin/client-trips/${id}/status`, { status })
  },

  // 5. Mettre à jour les NOTES
  updateNotes(id, notes) {
    return api.put(`/admin/client-trips/${id}/notes`, { notes })
  },

  // 6. Supprimer une inscription
  delete(id) {
    return api.delete(`/admin/client-trips/${id}`)
  },

  // 7. Récupérer les voyages du client connecté (front client)
  getMyTrips() {
    return api.get('/my-trips')
  }
}
