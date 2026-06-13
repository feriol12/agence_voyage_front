import api from './api'

export const tripDateApi = {
  // Récupérer toutes les dates d'un voyage
  getAll(tripId) {
    return api.get(`/admin/trips/${tripId}/dates`)
  },

  // Créer une date pour un voyage
  create(tripId, data) {
    return api.post(`/admin/trips/${tripId}/dates`, data)
  },

  // Modifier une date
  update(tripId, tripDateId, data) {
    return api.put(`/admin/trips/${tripId}/dates/${tripDateId}`, data)
  },

  // Supprimer une date
  delete(tripId, tripDateId) {
    return api.delete(`/admin/trips/${tripId}/dates/${tripDateId}`)
  }
}
