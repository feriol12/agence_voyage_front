import api from './api'

export const apiDestination = {
  // Récupérer toutes les destinations (paginées) avec recherche
  getAll: (page = 1, perPage = 9, search = '', continent = '', isActive = '') => {
    let url = `/admin/destinations?page=${page}&per_page=${perPage}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    if (continent) url += `&continent=${continent}`
    if (isActive !== '') url += `&is_active=${isActive}`
    return api.get(url)
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
