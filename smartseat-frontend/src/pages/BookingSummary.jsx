import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking.js';
import { formatCurrency, formatDateTime } from '../services/formatters.js';

function BookingSummary() {
    const { bookingFlow } = useBooking();
    const navigate = useNavigate();
    if (!bookingFlow?.booking) return <Navigate to="/movies" replace />;
    const { booking, show, movie, selectedSeats = [] } = bookingFlow;

    return <main className="page-width page-section narrow-page"><Link className="back-link" to={`/shows/${show.id}/seats`}>← Change seats</Link><div className="page-heading"><div className="eyebrow">One last look</div><h1>Booking summary</h1><p>Review your seats before heading to payment.</p></div><section className="summary-card"><div className="summary-movie"><div className="mini-poster">{movie?.posterUrl ? <img src={movie.posterUrl} alt="" /> : movie?.title?.charAt(0)}</div><div><h2>{movie?.title || show.movieTitle}</h2><p>{show.theatreName} · {show.screenName}</p><p>{formatDateTime(show.startTime)}</p></div></div><dl className="summary-details"><div><dt>Seats</dt><dd>{selectedSeats.map((seat) => seat.seatNumber).join(', ')}</dd></div><div><dt>Booking reference</dt><dd>{booking.bookingReference}</dd></div><div><dt>Total</dt><dd>{formatCurrency(booking.totalAmount)}</dd></div></dl><button className="button button-primary full-button" type="button" onClick={() => navigate('/payment')}>Proceed to Payment</button></section></main>;
}

export default BookingSummary;
