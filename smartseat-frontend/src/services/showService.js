import { apiRequest } from './api.js';

export function getShows() {
    return apiRequest('/api/shows');
}

export function getShowsForMovie(movieId) {
    return apiRequest(`/api/shows/movie/${movieId}`);
}

export function getShow(showId) {
    return apiRequest(`/api/shows/${showId}`);
}

export function getShowSeats(showId) {
    return apiRequest(`/api/shows/${showId}/seats`);
}
