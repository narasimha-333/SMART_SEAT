import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try { await registerUser(form); navigate('/login', { state: { message: 'Account created. Please login.' } }); }
        catch (submitError) { setError(submitError); }
        finally { setLoading(false); }
    }

    return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><div className="eyebrow">Your seat is waiting</div><h1>Create your account</h1><p className="form-intro">Save bookings and make every cinema trip simpler.</p>{error && <p className="form-error">{getErrorMessage(error)}</p>}<label>Name<input autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" autoComplete="new-password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button><p className="form-footer">Already registered? <Link to="/login">Login</Link></p></form></main>;
}

export default Register;
