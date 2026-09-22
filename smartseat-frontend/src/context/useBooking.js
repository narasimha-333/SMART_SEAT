import { useContext } from 'react';
import { BookingContext } from './bookingContext.js';

export function useBooking() {
    return useContext(BookingContext);
}
