import { apiRequest } from './api.js';

export function getTheatres() {
    return apiRequest('/api/theatres', { auth: true });
}

export function createTheatre(theatreData) {
    return apiRequest('/api/theatres', { method: 'POST', body: theatreData, auth: true });
}

export function createScreen(theatreId, screenData) {
    return apiRequest(`/api/theatres/${theatreId}/screens`, { method: 'POST', body: screenData, auth: true });
}
