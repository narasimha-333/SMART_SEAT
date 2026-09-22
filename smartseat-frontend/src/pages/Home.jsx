import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getMovies } from '../services/movieService.js';
import { getMovieBackdrop } from '../services/movieImages.js';

function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function loadMovies() {
        setLoading(true);
        getMovies().then(setMovies).catch(setError).finally(() => setLoading(false));
    }

    useEffect(loadMovies, []);

    return (
        <main>
            <section className="hero-section page-width" style={movies[0] && getMovieBackdrop(movies[0]) ? { '--hero-image': `url(${getMovieBackdrop(movies[0])})` } : undefined}>
                <div className="hero-copy">
                    <div className="eyebrow">Your next great night out</div>
                    <h1>Book your seat.<br /><span>Own the night.</span></h1>
                    <p>Discover what is playing, choose a showtime, and settle into the seat that feels just right.</p>
                    <div className="hero-actions">
                        <Link className="button button-primary" to="/movies">Explore Movies</Link>
                        <Link className="button button-secondary" to="/movies">View Shows <span aria-hidden="true">→</span></Link>
                    </div>
                </div>
                <div className="hero-ticket" aria-hidden="true">
                    <span className="ticket-label">SMARTSEAT / 01</span>
                    <strong>Tonight<br />starts here.</strong>
                    <span className="ticket-line" />
                    <span className="ticket-meta">SELECT A FILM · CHOOSE A SEAT</span>
                </div>
            </section>
            <section className="page-width section-block">
                <div className="section-heading"><div><div className="eyebrow">Fresh from the screen</div><h2>Now Showing</h2></div><Link className="text-link" to="/movies">See all movies <span aria-hidden="true">→</span></Link></div>
                {loading && <LoadingState message="Loading movies..." />}
                {error && <ErrorMessage error={error} onRetry={loadMovies} />}
                {!loading && !error && movies.length === 0 && <div className="empty-panel">No movies available right now.</div>}
                {!loading && !error && movies.length > 0 && <div className="movie-grid">{movies.map((movie) => movie.id ? <MovieCard key={movie.id} movie={movie} /> : null)}</div>}
            </section>
        </main>
    );
}

export default Home;
