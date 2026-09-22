import { apiRequest } from './api.js';

export function createMovie(movieData) {
    return apiRequest('/api/movies', { method: 'POST', body: movieData, auth: true });
}

export function deleteMovie(movieId) {
    return apiRequest(`/api/movies/${movieId}`, { method: 'DELETE', auth: true });
}

export function createShow(showData) {
    return apiRequest('/api/shows', { method: 'POST', body: showData, auth: true });
}
