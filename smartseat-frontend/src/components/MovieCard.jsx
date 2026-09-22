import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback.jsx';
import { getMoviePoster } from '../services/movieImages.js';

function MovieCard({ movie }) {
    return (
        <article className="movie-card">
            <div className="movie-poster"><ImageWithFallback src={getMoviePoster(movie)} alt={`${movie.title} poster`} /></div>
            <div className="movie-card-body">
                <div className="eyebrow">{movie.language} · {movie.genre}</div>
                <h3>{movie.title}</h3>
                <p>{movie.durationMinutes} min {movie.rating ? `· ${movie.rating}/10` : ''}</p>
                <Link className="button button-secondary movie-card-action" to={`/movies/${movie.id}`}>View shows <span aria-hidden="true">→</span></Link>
            </div>
        </article>
    );
}

export default MovieCard;
