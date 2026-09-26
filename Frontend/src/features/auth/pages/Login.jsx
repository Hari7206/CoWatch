import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await handleLogin(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4 py-10 relative overflow-hidden">
            {/* Ambient glow orbs */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-brand/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <main className="w-full max-w-xl flex flex-col items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 mb-8 group"
                >
                    <span className="font-logo font-bold text-3xl tracking-tight">
                        Co<span className="text-brand">Watch</span>
                    </span>
                </Link>

                {/* Headline */}
                <h1 className="font-display font-bold text-5xl md:text-6xl text-center tracking-tight mb-3">
                    Welcome back
                </h1>
                <p className="text-lg text-center text-text-muted mb-10">
                    Log in to continue to CoWatch.
                </p>

                {/* Error */}
                {error && (
                    <div className="w-full bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl px-6 py-4 text-base mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={onSubmit} className="w-full space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            placeholder="yourname"
                            required
                            className="w-full px-5 py-4 bg-surface text-text placeholder:text-text-muted/60 text-base rounded-2xl border border-border focus:border-brand focus:ring-4 focus:ring-brand/20 outline-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                required
                                className="w-full pl-5 pr-14 py-4 bg-surface text-text placeholder:text-text-muted/60 text-base rounded-2xl border border-border focus:border-brand focus:ring-4 focus:ring-brand/20 outline-none transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label="Toggle password visibility"
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-text-muted hover:text-text transition-colors"
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-lg rounded-2xl font-semibold bg-brand hover:bg-brand-hover text-white shadow-[0_4px_24px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_32px_rgba(220,38,38,0.5)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    <span>Logging in…</span>
                                </>
                            ) : (
                                <span>Log in</span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer links */}
                <div className="mt-8 text-center text-base text-text-muted">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand hover:underline font-semibold transition-colors ml-1">
                        Sign up
                    </Link>
                </div>

                <div className="mt-3 text-center text-base">
                    <span className="text-text-muted">Just want to watch?</span>
                    <Link to="/guest" className="text-brand hover:underline font-semibold transition-colors ml-1.5 inline-flex items-center gap-0.5">
                        Continue as guest
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}