import { useMemo, useState } from 'react';
import { loginUser } from '../services/authService.js';
import { AuthContext } from './authContext.js';

function readTokenPayload(token) {
    try {
        return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return {};
    }
}

function normalizeRole(value) {
    if (Array.isArray(value)) return normalizeRole(value[0]);
    if (typeof value !== 'string') return null;
    const role = value.trim().toUpperCase().replace(/^ROLE_/, '');
    return role || null;
}

function readRoleFromSource(source) {
    if (!source) return null;
    return normalizeRole(
        source.role
        || source.roles
        || source.authority
        || source.authorities
        || source.user?.role
        || source.user?.roles,
    );
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('smartseat_token'));

    function getRole(currentToken) {
        if (!currentToken) return null;
        const payload = readTokenPayload(currentToken);
        return normalizeRole(localStorage.getItem('smartseat_role'))
            || normalizeRole(localStorage.getItem('role'))
            || readRoleFromSource(payload);
    }

    async function login(credentials) {
        const response = await loginUser(credentials);
        localStorage.setItem('smartseat_token', response.token);
        localStorage.removeItem('smartseat_role');
        localStorage.removeItem('role');
        const tokenPayload = readTokenPayload(response.token);
        const resolvedRole = readRoleFromSource(response) || readRoleFromSource(tokenPayload);
        if (resolvedRole) localStorage.setItem('smartseat_role', resolvedRole);
        setToken(response.token);
    }

    function logout() {
        localStorage.removeItem('smartseat_token');
        localStorage.removeItem('smartseat_role');
        localStorage.removeItem('role');
        localStorage.removeItem('smartseat_booking');
        setToken(null);
    }

    const role = getRole(token);
    const value = useMemo(() => ({ token, role, isAdmin: role === 'ADMIN', isAuthenticated: Boolean(token), login, logout }), [token, role]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
