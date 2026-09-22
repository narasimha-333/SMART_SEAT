import { apiRequest } from './api.js';

export function getMovies() {
    return apiRequest('/api/movies');
}

export function getMovie(movieId) {
    if (!movieId) return Promise.reject(new Error('Movie ID is missing.'));
    return apiRequest(`/api/movies/${movieId}`);
}
