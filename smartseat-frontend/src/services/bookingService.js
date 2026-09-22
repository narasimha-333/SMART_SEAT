import { apiRequest } from './api.js';

export function createBooking(bookingData) {
    return apiRequest('/api/bookings', { method: 'POST', body: bookingData, auth: true });
}

export function getMyBookings() {
    return apiRequest('/api/bookings/my', { auth: true });
}

export function cancelBooking(bookingId) {
    return apiRequest('/api/bookings/cancel', { method: 'POST', body: { bookingId }, auth: true });
}
