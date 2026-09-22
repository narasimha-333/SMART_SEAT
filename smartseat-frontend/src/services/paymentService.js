import { apiRequest } from './api.js';

export function payForBooking(bookingId) {
    return apiRequest('/api/payments', { method: 'POST', body: { bookingId }, auth: true });
}
