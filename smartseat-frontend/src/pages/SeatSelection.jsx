import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useBooking } from '../context/useBooking.js';
import { createBooking } from '../services/bookingService.js';
import { getMovie } from '../services/movieService.js';
import { getShow, getShowSeats } from '../services/showService.js';
import { formatCurrency, formatDateTime } from '../services/formatters.js';

function SeatSelection() {
    const { showId } = useParams();
    const navigate = useNavigate();
    const { saveBookingFlow } = useBooking();
    const [show, setShow] = useState(null);
    const [movie, setMovie] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);

    function loadSeats() {
        setLoading(true);
        setError(null);
        Promise.all([getShow(showId), getShowSeats(showId)])
            .then(async ([showResponse, seatResponse]) => { setShow(showResponse); setSeats(seatResponse); setMovie(await getMovie(showResponse.movieId)); })
            .catch(setError)
            .finally(() => setLoading(false));
    }

    useEffect(loadSeats, [showId]);

    function toggleSeat(seat) {
        setSelectedSeatIds((current) => current.includes(seat.seatId) ? current.filter((id) => id !== seat.seatId) : [...current, seat.seatId]);
    }

    async function handleContinue() {
        setBookingLoading(true);
        setError(null);
        try {
            const selectedSeats = seats.filter((seat) => selectedSeatIds.includes(seat.seatId));
            const booking = await createBooking({ showId: Number(showId), seatIds: selectedSeatIds });
            saveBookingFlow({ booking, show, movie, selectedSeats });
            navigate('/booking-summary');
        } catch (bookingError) { setError(bookingError); }
        finally { setBookingLoading(false); }
    }

    if (loading) return <main className="page-width page-section"><LoadingState message="Loading seats..." /></main>;
    if (error && !show) return <main className="page-width page-section"><ErrorMessage error={error} onRetry={loadSeats} /></main>;
    const total = selectedSeatIds.length * show.ticketPrice;

    return <main className="page-width page-section"><Link className="back-link" to={`/movies/${show.movieId}`}>← Back to showtimes</Link><div className="seat-header"><div><div className="eyebrow">{show.theatreName} · {show.screenName}</div><h1>Select your seats</h1><p>{formatDateTime(show.startTime)}</p></div><div className="screen-label">SCREEN</div></div>{error && <ErrorMessage error={error} /> }<div className="seat-layout"><div className="seat-stage"><div className="screen-arc" />{seats.length > 0 ? <SeatGrid seats={seats} selectedSeatIds={selectedSeatIds} onToggle={toggleSeat} /> : <div className="empty-panel">No seat information available.</div>}<div className="seat-legend"><span><i className="legend-available" />Available</span><span><i className="legend-selected" />Selected</span><span><i className="legend-held" />Held</span><span><i className="legend-booked" />Booked</span></div></div><aside className="seat-summary"><div className="eyebrow">Your selection</div><h2>{selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'seat' : 'seats'}</h2><p>{selectedSeatIds.length ? seats.filter((seat) => selectedSeatIds.includes(seat.seatId)).map((seat) => seat.seatNumber).join(', ') : 'Choose available seats to continue.'}</p><div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div><button className="button button-primary" type="button" disabled={!selectedSeatIds.length || bookingLoading} onClick={handleContinue}>{bookingLoading ? 'Holding seats...' : 'Continue'}</button></aside></div></main>;
}

export default SeatSelection;
