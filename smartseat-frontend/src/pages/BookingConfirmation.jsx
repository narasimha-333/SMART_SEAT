import { Link, Navigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking.js';
import { formatCurrency, formatDateTime } from '../services/formatters.js';

function BookingConfirmation() {
    const { bookingFlow } = useBooking();
    if (!bookingFlow?.booking || !bookingFlow.payment) return <Navigate to="/movies" replace />;
    const { booking, payment, show, movie, selectedSeats = [] } = bookingFlow;

    return <main className="page-width page-section narrow-page"><section className="confirmation-card"><div className="confirmation-icon" aria-hidden="true">✓</div><div className="eyebrow">You are all set</div><h1>Booking confirmed</h1><p className="confirmation-reference">{booking.bookingReference}</p><div className="confirmation-details"><strong>{movie?.title || show.movieTitle}</strong><span>{show.theatreName} · {show.screenName}</span><span>{formatDateTime(show.startTime)}</span><span>Seats: {selectedSeats.map((seat) => seat.seatNumber).join(', ')}</span><span>Amount: {formatCurrency(payment.amount)}</span><span>Transaction: {payment.transactionReference}</span></div><div className="hero-actions"><Link className="button button-primary" to="/my-bookings">My Bookings</Link><Link className="button button-secondary" to="/">Back to Home</Link></div></section></main>;
}

export default BookingConfirmation;
