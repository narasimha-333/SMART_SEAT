import { apiRequest } from './api.js';

export function registerUser(userData) {
    return apiRequest('/api/auth/register', { method: 'POST', body: userData });
}

export function loginUser(credentials) {
    return apiRequest('/api/auth/login', { method: 'POST', body: credentials });
}
