import api from './api'

export const tripApi = {
  // Récupérer tous les trips
  getAll(params) {
    return api.get('/admin/trips', { params })
  },

  // Récupérer un trip par ID
  getById(id) {
    return api.get(`/admin/trips/${id}`)
  },

  // Créer un trip
  create(data) {
    return api.post('/admin/trips', data)
  },

  // Mettre à jour un trip
  update(id, data) {
    return api.put(`/admin/trips/${id}`, data)
  },

  // Supprimer un trip
  delete(id) {
    return api.delete(`/admin/trips/${id}`)
  }
}
