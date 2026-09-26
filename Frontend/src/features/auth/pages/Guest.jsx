import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Guest() {
    const { handleGuest } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await handleGuest(username);
            navigate('/start');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-brand/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <main className="w-full max-w-xl flex flex-col items-center">
                <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                    <span className="font-logo font-bold text-3xl tracking-tight">
                        Co<span className="text-brand">Watch</span>
                    </span>
                </Link>

                <h1 className="font-display font-bold text-5xl md:text-6xl text-center tracking-tight mb-3">
                    Watch as a guest
                </h1>
                <p className="text-lg text-center text-text-muted mb-10">
                    Pick a name, we'll use it in the room. No account needed.
                </p>

                {error && (
                    <div className="w-full bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl px-6 py-4 text-base mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit} className="w-full space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Your name
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. Alex"
                            maxLength={20}
                            required
                            className="w-full px-5 py-4 bg-surface text-text placeholder:text-text-muted/60 text-base rounded-2xl border border-border focus:border-brand focus:ring-4 focus:ring-brand/20 outline-none transition-all duration-200"
                        />
                        <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            Session lasts 2 hours. Completely anonymous.
                        </p>
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
                                    <span>Getting ready…</span>
                                </>
                            ) : (
                                <span>Continue as guest</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-base text-text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand hover:underline font-semibold transition-colors ml-1">
                        Log in
                    </Link>
                </div>

                <div className="mt-3 text-center text-base">
                    <span className="text-text-muted">New here?</span>
                    <Link to="/signup" className="text-brand hover:underline font-semibold transition-colors ml-1.5 inline-flex items-center gap-0.5">
                        Create an account
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}