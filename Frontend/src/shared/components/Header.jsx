import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { avatarColor, avatarInitial } from '../lib/avatar';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="border-b border-border bg-bg">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="font-display font-bold text-xl tracking-tight">
                    CoWatch
                </Link>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {user ? (
                        <UserMenu user={user} onLogout={() => {
                            handleLogout();
                            navigate('/');
                        }} />
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium hover:bg-bg-soft rounded-full transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 text-sm font-medium bg-brand text-white hover:bg-brand-hover rounded-full transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function UserMenu({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initial = avatarInitial(user.username);
    const color = avatarColor(user.username);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Open user menu"
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-transform hover:scale-105"
                style={{ backgroundColor: color }}
            >
                {initial}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-surface border border-border shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium truncate">{user.username}</p>
                    </div>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-bg-soft transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}