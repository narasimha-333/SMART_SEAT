import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getErrorMessage } from '../services/api.js';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try { await login(form); navigate(location.state?.from?.pathname || '/', { replace: true }); }
        catch (submitError) { setError(submitError); }
        finally { setLoading(false); }
    }

    return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><div className="eyebrow">Welcome back</div><h1>Sign in to SmartSeat</h1><p className="form-intro">Pick up where your next movie night begins.</p>{error && <p className="form-error">{getErrorMessage(error)}</p>}<label>Email<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button><p className="form-footer">New to SmartSeat? <Link to="/register">Create an account</Link></p></form></main>;
}

export default Login;
