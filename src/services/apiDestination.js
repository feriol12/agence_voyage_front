import api from './api'

export const apiDestination = {
  // Récupérer toutes les destinations (paginées)
  getAll: (page = 1, perPage = 9) => {
    // Nettoie les paramètres pour éviter les doublons
    const cleanPage = parseInt(page, 10) || 1
    const cleanPerPage = parseInt(perPage, 10) || 9
    return api.get(`/admin/destinations?page=${cleanPage}&per_page=${cleanPerPage}`)
  },
  // Récupérer une destination par son ID
  getById: (id) => api.get(`/admin/destinations/${id}`),

  // Créer une nouvelle destination
  create: (data) => api.post('/admin/destinations', data),

  // Mettre à jour une destination
  update: (id, data) => api.post(`/admin/destinations/${id}`, { ...data, _method: 'PUT' }),

  // Supprimer une destination
  delete: (id) => api.delete(`/admin/destinations/${id}`),
}
