import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getMovie } from '../services/movieService.js';
import { getShowsForMovie } from '../services/showService.js';
import { formatCurrency } from '../services/formatters.js';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import { getMoviePoster } from '../services/movieImages.js';

function MovieDetails() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function loadDetails() {
        setLoading(true);
        setError(null);
        Promise.all([getMovie(movieId), getShowsForMovie(movieId)])
            .then(([movieResponse, showResponse]) => { setMovie(movieResponse); setShows(showResponse); })
            .catch(setError)
            .finally(() => setLoading(false));
    }

    useEffect(loadDetails, [movieId]);

    if (loading) return <main className="page-width page-section"><LoadingState message="Loading movie details..." /></main>;
    if (error) return <main className="page-width page-section"><ErrorMessage error={error} onRetry={loadDetails} /></main>;
    const groupedShows = shows.reduce((groups, show) => {
        const theatreKey = show.theatreName || 'Cinema';
        const screenKey = show.screenName || 'Screen';
        groups[theatreKey] ||= {};
        groups[theatreKey][screenKey] ||= [];
        groups[theatreKey][screenKey].push(show);
        return groups;
    }, {});

    return <main className="page-width page-section movie-details-page"><Link className="back-link" to="/movies">← All movies</Link><section className="movie-detail"><div className="detail-poster movie-poster"><ImageWithFallback src={getMoviePoster(movie)} alt={`${movie.title} poster`} /></div><div className="detail-copy"><div className="eyebrow">{movie.language} · {movie.genre}</div><h1>{movie.title}</h1><p className="detail-description">{movie.description || 'Choose a showtime and make it a great night.'}</p><div className="detail-facts"><span>{movie.durationMinutes} min</span>{movie.rating ? <span>{movie.rating}/10 rating</span> : null}</div></div></section><section className="show-section"><div className="section-heading"><div><div className="eyebrow">Choose your moment</div><h2>Available Shows</h2></div></div>{shows.length === 0 ? <div className="empty-panel">No shows available for this movie.</div> : <div className="show-groups">{Object.entries(groupedShows).map(([theatreName, theatreShows]) => <section className="show-group" key={theatreName}><h3>{theatreName}</h3>{Object.entries(theatreShows).map(([screenName, screenShows]) => <div className="screen-group" key={screenName}><div className="screen-name">{screenName}</div><div className="show-time-grid">{screenShows.map((show) => <Link className="show-time-card" key={show.id} to={`/shows/${show.id}/seats`}><strong>{new Date(show.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</strong><span>{formatCurrency(show.ticketPrice)}</span></Link>)}</div></div>)}</section>)}</div>}</section></main>;
}

export default MovieDetails;
