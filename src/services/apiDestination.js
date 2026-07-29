import api from './api'

export const apiDestination = {
  getAll: (page = 1, perPage = 9, search = '', continent = '', isActive = '') => {
    let url = `/admin/destinations?page=${page}&per_page=${perPage}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    if (continent) url += `&continent=${continent}`
    if (isActive !== '') url += `&is_active=${isActive}`
    return api.get(url)
  },

  getById: (id) => api.get(`/admin/destinations/${id}`),

  // ✅ Création avec plusieurs images
  create: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file, index) => {
          formData.append(`images[${index}]`, file)
        })
      } else if (data[key] !== undefined && data[key] !== null) {
        // ✅ Convertir les booléens en '0' ou '1'
        if (typeof data[key] === 'boolean') {
          formData.append(key, data[key] ? '1' : '0')
        } else {
          formData.append(key, data[key])
        }
      }
    })
    return api.post('/admin/destinations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // ✅ Mise à jour avec plusieurs images
  update: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file, index) => {
          formData.append(`images[${index}]`, file)
        })
      } else if (key === 'images_to_delete' && Array.isArray(data[key])) {
        data[key].forEach((url, index) => {
          formData.append(`images_to_delete[${index}]`, url)
        })
      } else if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'boolean') {
          formData.append(key, data[key] ? '1' : '0')
        } else {
          formData.append(key, data[key])
        }
      }
    })
    formData.append('_method', 'PUT')
    return api.post(`/admin/destinations/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete: (id) => api.delete(`/admin/destinations/${id}`),
}
