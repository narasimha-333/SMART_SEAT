import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getMovies } from '../services/movieService.js';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function loadMovies() {
        setLoading(true);
        setError(null);
        getMovies().then(setMovies).catch(setError).finally(() => setLoading(false));
    }

    useEffect(loadMovies, []);

    return <main className="page-width page-section"><div className="page-heading"><div className="eyebrow">Find your next favourite</div><h1>Movies</h1><p>Choose a story, then choose where you want to sit.</p></div>{loading && <LoadingState message="Loading movies..." />}{error && <ErrorMessage error={error} onRetry={loadMovies} />}{!loading && !error && movies.length === 0 && <div className="empty-panel">No movies available.</div>}{!loading && !error && movies.length > 0 && <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>}</main>;
}

export default Movies;
