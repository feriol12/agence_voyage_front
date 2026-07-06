import api from './api'

export const apiDocumentType = {
    getAll: () => api.get('/admin/document-types'),
    getById: (id) => api.get(`/admin/document-types/${id}`),
    create: (data) => api.post('/admin/document-types', data),
    update: (id, data) => api.put(`/admin/document-types/${id}`, data),
    delete: (id) => api.delete(`/admin/document-types/${id}`)
}