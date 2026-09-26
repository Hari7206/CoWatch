import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, guestUser, getMe } from './services/auth.api';
import {
    saveSession,
    clearSession,
    getToken,
    getUser,
    isTokenExpired,
} from '../../shared/lib/identity';

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(getUser());
    const [loading, setLoading] = useState(true);

useEffect(() => {
    async function verify() {
        const token = getToken();
        const cachedUser = getUser();

        if (!token || isTokenExpired()) {
            clearSession();
            setUser(null);
            setLoading(false);
            return;
        }

        if (cachedUser?.id?.startsWith('guest_')) {
            setUser(cachedUser);
            setLoading(false);
            return;
        }

        try {
            const data = await getMe();
            setUser(data.user);
        } catch {
            clearSession();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    verify();
}, []);

    async function handleLogin(username, password) {
        const data = await loginUser(username, password);
        saveSession({ token: data.token, user: data.user });
        setUser(data.user);
        return true;
    }

    async function handleRegister(username, password) {
        const data = await registerUser(username, password);
        saveSession({ token: data.token, user: data.user });
        setUser(data.user);
        return true;
    }

    async function handleGuest(username) {
        const data = await guestUser(username);
        saveSession({ token: data.token, user: data.user, guest: true });
        setUser(data.user);
        return true;
    }

    function handleLogout() {
        clearSession();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                handleLogin,
                handleRegister,
                handleGuest,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}