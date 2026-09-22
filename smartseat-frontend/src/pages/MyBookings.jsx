import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { cancelBooking, getMyBookings } from '../services/bookingService.js';
import { formatCurrency, formatDateTime } from '../services/formatters.js';
import { getErrorMessage } from '../services/api.js';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import { getMoviePoster } from '../services/movieImages.js';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    function loadBookings() {
        setLoading(true);
        setError(null);
        getMyBookings().then(setBookings).catch(setError).finally(() => setLoading(false));
    }

    useEffect(loadBookings, []);

    async function handleCancel(bookingId) {
        if (!window.confirm('Cancel this booking?')) return;
        setCancellingId(bookingId);
        setActionError(null);
        try { await cancelBooking(bookingId); loadBookings(); }
        catch (cancelError) { setActionError(cancelError); }
        finally { setCancellingId(null); }
    }

    return <main className="page-width page-section"><div className="page-heading"><div className="eyebrow">Your cinema history</div><h1>My Bookings</h1><p>Everything you have planned with SmartSeat.</p></div>{loading && <LoadingState message="Loading bookings..." />}{error && <ErrorMessage error={error} onRetry={loadBookings} />}{actionError && <p className="form-error">{getErrorMessage(actionError)}</p>}{!loading && !error && bookings.length === 0 && <div className="empty-panel"><div><strong>No movie nights planned yet.</strong><br /><Link className="text-link" to="/movies">Explore movies</Link></div></div>}{!loading && !error && bookings.length > 0 && <div className="booking-list">{bookings.map((booking) => <article className="booking-card" key={booking.bookingId}><ImageWithFallback className="booking-poster" src={getMoviePoster({ title: booking.movieTitle })} alt={`${booking.movieTitle} poster`} /><div className="booking-card-content"><div className="booking-topline"><span className="booking-reference">{booking.bookingReference}</span><span className={`status status-${booking.status.toLowerCase()}`}>{booking.status}</span></div><h2>{booking.movieTitle}</h2><p>{booking.theatreName} · {booking.screenName}</p><p>{formatDateTime(booking.showStartTime)} · Seats: {booking.seatNumbers.join(', ')}</p><div className="booking-bottom"><strong>{formatCurrency(booking.totalAmount)}</strong>{booking.status === 'CONFIRMED' && <button className="button button-secondary" type="button" disabled={cancellingId === booking.bookingId} onClick={() => handleCancel(booking.bookingId)}>{cancellingId === booking.bookingId ? 'Cancelling...' : 'Cancel booking'}</button>}</div></div></article>)}</div>}</main>;
}

export default MyBookings;
