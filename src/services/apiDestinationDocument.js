import api from './api'

export const apiDestinationDocument = {
    // Récupérer les documents d'une destination
    getByDestination: (destinationId) =>
        api.get(`/admin/destinations/${destinationId}/documents`),

    // Synchroniser les documents d'une destination
    sync: (destinationId, data) =>
        api.post(`/admin/destinations/${destinationId}/documents/sync`, data),
}