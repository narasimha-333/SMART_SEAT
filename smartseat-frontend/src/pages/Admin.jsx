import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { getMovies } from '../services/movieService.js';
import { createMovie, createShow, deleteMovie } from '../services/adminService.js';
import { createScreen, createTheatre, getTheatres } from '../services/theatreService.js';
import { getShows } from '../services/showService.js';
import { getMoviePoster } from '../services/movieImages.js';
import { sampleMovies } from '../services/sampleMovies.js';

const emptyMovie = { title: '', description: '', genre: '', language: '', durationMinutes: '', rating: '', posterUrl: '' };
const emptyTheatre = { name: '', city: '', address: '' };
const emptyScreen = { theatreId: '', name: '', rows: 8, seatsPerRow: 10 };
const emptyShow = { movieId: '', screenId: '', startTime: '', endTime: '', ticketPrice: '' };

function buildMovieRequest(form) {
    const title = form.title.trim();
    const description = form.description.trim();
    const genre = form.genre.trim();
    const language = form.language.trim();
    const durationMinutes = Number(form.durationMinutes);
    const rating = form.rating.trim() === '' ? null : Number(form.rating);
    const posterUrl = form.posterUrl.trim();

    if (!title || !genre || !language) throw new Error('Title, genre, and language are required.');
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) throw new Error('Duration must be a positive whole number of minutes.');
    if (rating !== null && (!Number.isFinite(rating) || rating < 0 || rating > 10)) throw new Error('Rating must be between 0 and 10.');

    return { title, description, genre, language, durationMinutes, rating, posterUrl };
}

function Admin() {
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [shows, setShows] = useState([]);
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState('');
    const [movieForm, setMovieForm] = useState(emptyMovie);
    const [theatreForm, setTheatreForm] = useState(emptyTheatre);
    const [screenForm, setScreenForm] = useState(emptyScreen);
    const [showForm, setShowForm] = useState(emptyShow);
    const [submitting, setSubmitting] = useState('');

    async function loadDashboard() {
        setLoading(true);
        setError(null);
        try {
            const [movieData, theatreData, showData] = await Promise.all([getMovies(), getTheatres(), getShows()]);
            setMovies(movieData);
            setTheatres(theatreData);
            setShows(showData);
        } catch (loadError) {
            setError(loadError);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadDashboard(); }, []);

    function updateForm(setter, field, value) {
        setter((current) => ({ ...current, [field]: value }));
    }

    async function submitAction(name, action, successMessage, reset) {
        setSubmitting(name);
        setNotice('');
        setError(null);
        try { await action(); reset(); setNotice(successMessage); await loadDashboard(); }
        catch (actionError) { setError(actionError); }
        finally { setSubmitting(''); }
    }

    function handleMovieSubmit(event) {
        event.preventDefault();
        submitAction('movie', () => createMovie(buildMovieRequest(movieForm)), 'Movie added successfully.', () => setMovieForm(emptyMovie));
    }

    function handleTheatreSubmit(event) {
        event.preventDefault();
        submitAction('theatre', () => createTheatre(theatreForm), 'Theatre added successfully.', () => setTheatreForm(emptyTheatre));
    }

    function handleScreenSubmit(event) {
        event.preventDefault();
        submitAction('screen', async () => { const screen = await createScreen(screenForm.theatreId, { name: screenForm.name, rows: Number(screenForm.rows), seatsPerRow: Number(screenForm.seatsPerRow) }); setScreens((current) => [...current, screen]); }, 'Screen added successfully.', () => setScreenForm(emptyScreen));
    }

    function handleShowSubmit(event) {
        event.preventDefault();
        submitAction('show', () => createShow({ ...showForm, movieId: Number(showForm.movieId), screenId: Number(showForm.screenId), ticketPrice: Number(showForm.ticketPrice) }), 'Show added successfully.', () => setShowForm(emptyShow));
    }

    async function handleDelete(movie) {
        if (!window.confirm(`Delete ${movie.title}?`)) return;
        setSubmitting(`delete-${movie.id}`);
        setError(null);
        try { await deleteMovie(movie.id); setMovies((current) => current.filter((item) => item.id !== movie.id)); setNotice('Movie deleted successfully.'); }
        catch (deleteError) { setError(deleteError); }
        finally { setSubmitting(''); }
    }

    async function handleSeedMovies() {
        const existingTitles = new Set(movies.map((movie) => movie.title.toLowerCase()));
        const moviesToAdd = sampleMovies.filter((movie) => !existingTitles.has(movie.title.toLowerCase()));
        if (!moviesToAdd.length) {
            setNotice('All sample movies are already in the catalogue.');
            return;
        }
        setSubmitting('seed');
        setError(null);
        setNotice('');
        try {
            await Promise.all(moviesToAdd.map((movie) => createMovie(movie)));
            setNotice(`${moviesToAdd.length} sample movies added successfully.`);
            await loadDashboard();
        } catch (seedError) {
            setError(seedError);
        } finally {
            setSubmitting('');
        }
    }

    if (loading) return <main className="page-width page-section"><LoadingState message="Loading admin dashboard..." /></main>;

    return (
        <main className="page-width page-section admin-page">
            <div className="page-heading admin-heading"><div><div className="eyebrow">Control room</div><h1>SmartSeat Admin</h1><p>Manage your cinema experience.</p></div><div className="admin-lockup">ADMIN<br /><span>SMARTSEAT OPS</span></div></div>
            {error && <ErrorMessage error={error} onRetry={loadDashboard} />}
            {notice && <div className="notice-panel">{notice}</div>}
            <section className="admin-stats"><div><span>Total Movies</span><strong>{movies.length}</strong></div><div><span>Total Theatres</span><strong>{theatres.length}</strong></div><div><span>Total Shows</span><strong>{shows.length}</strong></div><div><span>User data</span><strong>API unavailable</strong></div></section>
            <div className="admin-grid">
                <section className="admin-panel"><div className="panel-heading"><div><div className="eyebrow">Catalogue</div><h2>Movie Management</h2></div><span className="panel-count">{movies.length} titles</span></div><button className="button button-secondary seed-button" type="button" disabled={submitting === 'seed'} onClick={handleSeedMovies}>{submitting === 'seed' ? 'Adding sample movies...' : 'Add 5 sample movies'}</button><p className="admin-helper">Adds Avengers: Endgame, The Dark Knight, Inception, Dune, and Oppenheimer through the existing admin API.</p><form className="admin-form" onSubmit={handleMovieSubmit}><input placeholder="Movie title" required value={movieForm.title} onChange={(event) => updateForm(setMovieForm, 'title', event.target.value)} /><input placeholder="Genre" required value={movieForm.genre} onChange={(event) => updateForm(setMovieForm, 'genre', event.target.value)} /><input placeholder="Language" required value={movieForm.language} onChange={(event) => updateForm(setMovieForm, 'language', event.target.value)} /><input type="number" placeholder="Duration (minutes)" min="1" required value={movieForm.durationMinutes} onChange={(event) => updateForm(setMovieForm, 'durationMinutes', event.target.value)} /><input type="number" placeholder="Rating / 10" min="0" max="10" step="0.1" required value={movieForm.rating} onChange={(event) => updateForm(setMovieForm, 'rating', event.target.value)} /><input placeholder="Poster URL (optional)" value={movieForm.posterUrl} onChange={(event) => updateForm(setMovieForm, 'posterUrl', event.target.value)} /><textarea placeholder="Description" rows="3" value={movieForm.description} onChange={(event) => updateForm(setMovieForm, 'description', event.target.value)} /><button className="button button-primary" disabled={submitting === 'movie'}>{submitting === 'movie' ? 'Adding movie...' : 'Add Movie'}</button></form><div className="admin-table">{movies.map((movie) => <div className="admin-row" key={movie.id}><ImageWithFallback src={getMoviePoster(movie)} alt="" /><div><strong>{movie.title}</strong><span>{movie.genre} · {movie.language}</span></div><button className="button button-danger" type="button" disabled={submitting === `delete-${movie.id}`} onClick={() => handleDelete(movie)}>Delete</button></div>)}</div></section>
                <section className="admin-panel"><div className="panel-heading"><div><div className="eyebrow">Venues</div><h2>Theatre Management</h2></div></div><form className="admin-form" onSubmit={handleTheatreSubmit}><input placeholder="Theatre name" required value={theatreForm.name} onChange={(event) => updateForm(setTheatreForm, 'name', event.target.value)} /><input placeholder="City" required value={theatreForm.city} onChange={(event) => updateForm(setTheatreForm, 'city', event.target.value)} /><input placeholder="Address" required value={theatreForm.address} onChange={(event) => updateForm(setTheatreForm, 'address', event.target.value)} /><button className="button button-primary" disabled={submitting === 'theatre'}>{submitting === 'theatre' ? 'Adding theatre...' : 'Add Theatre'}</button></form><div className="admin-list">{theatres.map((theatre) => <div className="admin-list-item" key={theatre.id}><strong>{theatre.name}</strong><span>{theatre.city} · {theatre.address}</span></div>)}</div><div className="subsection-heading">Add Screen</div><form className="admin-form" onSubmit={handleScreenSubmit}><select required value={screenForm.theatreId} onChange={(event) => updateForm(setScreenForm, 'theatreId', event.target.value)}><option value="">Select theatre</option>{theatres.map((theatre) => <option key={theatre.id} value={theatre.id}>{theatre.name}</option>)}</select><input placeholder="Screen name" required value={screenForm.name} onChange={(event) => updateForm(setScreenForm, 'name', event.target.value)} /><div className="form-split"><input type="number" min="1" placeholder="Rows" required value={screenForm.rows} onChange={(event) => updateForm(setScreenForm, 'rows', event.target.value)} /><input type="number" min="1" placeholder="Seats per row" required value={screenForm.seatsPerRow} onChange={(event) => updateForm(setScreenForm, 'seatsPerRow', event.target.value)} /></div><button className="button button-secondary" disabled={submitting === 'screen'}>{submitting === 'screen' ? 'Adding screen...' : 'Add Screen'}</button></form>{screens.length > 0 && <div className="admin-list">{screens.map((screen) => <div className="admin-list-item" key={screen.id}><strong>{screen.name}</strong><span>{screen.totalSeats} seats · Theatre #{screen.theatreId}</span></div>)}</div>}</section>
                <section className="admin-panel admin-panel-wide"><div className="panel-heading"><div><div className="eyebrow">Programming</div><h2>Show Management</h2></div><span className="panel-count">{shows.length} scheduled</span></div><form className="admin-form show-form" onSubmit={handleShowSubmit}><select required value={showForm.movieId} onChange={(event) => updateForm(setShowForm, 'movieId', event.target.value)}><option value="">Select movie</option>{movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}</select><select required value={showForm.screenId} onChange={(event) => updateForm(setShowForm, 'screenId', event.target.value)}><option value="">Select created screen</option>{screens.map((screen) => <option key={screen.id} value={screen.id}>{screen.name} · #{screen.id}</option>)}</select><input type="datetime-local" required value={showForm.startTime} onChange={(event) => updateForm(setShowForm, 'startTime', event.target.value)} /><input type="datetime-local" required value={showForm.endTime} onChange={(event) => updateForm(setShowForm, 'endTime', event.target.value)} /><input type="number" min="0" step="0.01" placeholder="Ticket price" required value={showForm.ticketPrice} onChange={(event) => updateForm(setShowForm, 'ticketPrice', event.target.value)} /><button className="button button-primary" disabled={submitting === 'show'}>{submitting === 'show' ? 'Scheduling...' : 'Add Show'}</button></form><div className="admin-table">{shows.map((show) => <div className="admin-row show-admin-row" key={show.id}><div><strong>{show.movieTitle}</strong><span>{show.theatreName} · {show.screenName}</span></div><span>{new Date(show.startTime).toLocaleString()}</span></div>)}</div></section>
            </div>
        </main>
    );
}

export default Admin;
