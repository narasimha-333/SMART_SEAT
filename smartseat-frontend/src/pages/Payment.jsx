import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking.js';
import { formatCurrency } from '../services/formatters.js';
import { getErrorMessage } from '../services/api.js';
import { payForBooking } from '../services/paymentService.js';

function Payment() {
    const { bookingFlow, saveBookingFlow } = useBooking();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!bookingFlow?.booking) return <Navigate to="/movies" replace />;
    const { booking, payment } = bookingFlow;

    async function handlePayment() {
        setLoading(true);
        setError(null);
        try { const response = await payForBooking(booking.bookingId); saveBookingFlow({ payment: response }); navigate('/booking-confirmation'); }
        catch (paymentError) { setError(paymentError); }
        finally { setLoading(false); }
    }

    if (payment) return <Navigate to="/booking-confirmation" replace />;
    return <main className="page-width page-section narrow-page"><div className="page-heading"><div className="eyebrow">Secure checkout</div><h1>Complete payment</h1><p>Your seats are held for a limited time.</p></div><section className="payment-card"><div className="payment-row"><span>Booking ID</span><strong>#{booking.bookingId}</strong></div><div className="payment-row payment-total"><span>Amount to pay</span><strong>{formatCurrency(booking.totalAmount)}</strong></div>{error && <p className="form-error">{getErrorMessage(error)}</p>}<button className="button button-primary full-button" type="button" disabled={loading} onClick={handlePayment}>{loading ? 'Processing payment...' : `Pay ${formatCurrency(booking.totalAmount)}`}</button><p className="payment-note">This uses the SmartSeat payment service. No external payment gateway is connected.</p></section></main>;
}

export default Payment;
