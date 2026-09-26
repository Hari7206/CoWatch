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
        <div className="min-h-screen bg-bg text-text flex flex-col">
            <header className="px-6 py-4">
                <Link to="/" className="font-display font-bold text-xl tracking-tight">
                    CoWatch
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <h1 className="font-display font-bold text-3xl mb-2">
                        Watch as a guest
                    </h1>
                    <p className="text-text-muted mb-8">
                        Pick a name, we'll use it in the room. No account needed.
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Your name
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. Alex"
                                maxLength={20}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-brand transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="px-4 py-3 rounded-xl bg-brand-soft text-brand text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-brand text-white hover:bg-brand-hover transition-colors font-medium disabled:opacity-60"
                        >
                            {loading ? 'Getting ready…' : 'Continue as guest'}
                        </button>
                    </form>

                    <p className="text-sm text-text-muted text-center mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}