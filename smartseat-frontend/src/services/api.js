export const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:8080';

const errorMessages = {
    400: 'Please check the information and try again.',
    401: 'Please login to continue.',
    403: 'You are not authorized to perform this action.',
    404: 'The requested item was not found.',
    409: 'This action could not be completed right now.',
};

export async function apiRequest(path, options = {}) {
    const { body, auth = false, ...requestOptions } = options;
    const token = localStorage.getItem('smartseat_token');
    const headers = { ...requestOptions.headers };

    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...requestOptions,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const contentType = response.headers.get('content-type') || '';
    const responseBody = response.status === 204 ? null : contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const serverMessage = typeof responseBody === 'string' ? responseBody : responseBody?.error || responseBody?.message;
        const error = new Error(serverMessage || errorMessages[response.status] || 'Something went wrong.');
        error.status = response.status;
        throw error;
    }
    return responseBody;
}

export function getErrorMessage(error) {
    if (!error) return 'Something went wrong. Please try again.';
    if (error.message === 'Failed to fetch') return 'Unable to connect to SmartSeat. Please make sure the backend is running.';
    if (error.status === 409) {
        const conflictMessages = {
            'Seat is not available': 'Seat is not available.',
            'Booking is not pending': 'Booking is not pending.',
            'Seat hold has expired': 'Seat hold has expired. Please choose your seats again.',
        };
        return conflictMessages[error.message] || error.message || 'This action could not be completed right now.';
    }
    return error.message || errorMessages[error.status] || 'Something went wrong. Please try again.';
}
