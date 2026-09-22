import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import './Navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function handleLogout() {
        logout();
        closeMenu();
        navigate('/');
    }

    return (
        <header className="site-header">
            <nav className="navbar" aria-label="Main navigation">
                <Link className="brand" to="/" onClick={closeMenu}>
                    <span className="brand-mark" aria-hidden="true">SS</span>
                    <span className="brand-copy">
                        <span className="brand-name">SmartSeat</span>
                        <span className="brand-tagline">Book your seat. Enjoy your movie.</span>
                    </span>
                </Link>

                <button
                    className="menu-toggle"
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    id="primary-navigation"
                    className={`nav-panel${isMenuOpen ? ' nav-panel-open' : ''}`}
                >
                    <div className="nav-links">
                        <NavLink end to="/" onClick={closeMenu}>Home</NavLink>
                        <NavLink to="/movies" onClick={closeMenu}>Movies</NavLink>
                        <NavLink to="/my-bookings" onClick={closeMenu}>My Bookings</NavLink>
                        {isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
                    </div>

                    <div className="auth-actions">
                        {isAuthenticated ? (
                            <button className="auth-button auth-button-outline" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link className="auth-button auth-button-muted" to="/login" onClick={closeMenu}>Login</Link>
                                <Link className="auth-button auth-button-primary" to="/register" onClick={closeMenu}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;