import { useEffect, useState } from 'react';
import { BookingContext } from './bookingContext.js';

function readStoredBooking() {
    try {
        return JSON.parse(localStorage.getItem('smartseat_booking')) || null;
    } catch {
        return null;
    }
}

export function BookingProvider({ children }) {
    const [bookingFlow, setBookingFlow] = useState(readStoredBooking);

    useEffect(() => {
        if (bookingFlow) localStorage.setItem('smartseat_booking', JSON.stringify(bookingFlow));
        else localStorage.removeItem('smartseat_booking');
    }, [bookingFlow]);

    function saveBookingFlow(flow) {
        setBookingFlow((current) => ({ ...current, ...flow }));
    }

    function clearBookingFlow() {
        setBookingFlow(null);
    }

    return <BookingContext.Provider value={{ bookingFlow, saveBookingFlow, clearBookingFlow }}>{children}</BookingContext.Provider>;
}
