import api from './api'

export const userApi = {
  // Récupérer la liste des utilisateurs (admin)
  getAll(params) {
    return api.get('/admin/users', { params })
  },

  // Récupérer un utilisateur par son ID
  getById(id) {
    return api.get(`/admin/users/${id}`)
  },

  // Créer un utilisateur (admin)
  create(data) {
    return api.post('/admin/users', data)
  },

  // Mettre à jour un utilisateur
  update(id, data) {
    return api.put(`/admin/users/${id}`, data)
  },

  // Supprimer un utilisateur
  delete(id) {
    return api.delete(`/admin/users/${id}`)
  }
}
