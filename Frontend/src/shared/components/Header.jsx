import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { avatarColor, avatarInitial } from '../lib/avatar';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
            <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4 max-w-[1500px] mx-auto">
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="font-logo font-bold text-xl tracking-tight"
                    >
                        Co<span className="text-brand">Watch</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6">
                        <a href="/#features" className="text-sm text-text-muted hover:text-text transition-colors">
                            Features
                        </a>
                        <a href="/#how-it-works" className="text-sm text-text-muted hover:text-text transition-colors">
                            How It Works
                        </a>
                        <a href="/#faq" className="text-sm text-text-muted hover:text-text transition-colors">
                            FAQ
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {user ? (
                        <UserMenu
                            user={user}
                            onLogout={() => {
                                handleLogout();
                                navigate('/');
                            }}
                        />
                    ) : (
                        <>
                            <Link
                                to="/guest"
                                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
                            >
                                Guest
                            </Link>
                            <Link
                                to="/login"
                                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium hover:bg-bg-soft rounded-full transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/start"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand text-white rounded-full shadow-[0_0_24px_-4px_rgba(220,38,38,0.5)] hover:bg-brand-hover transition-all"
                            >
                                Start a Room
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
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm transition-transform hover:scale-105"
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
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}