import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { createRoom } from '../services/room.api';

export default function CreateRoom() {
    const { user, handleGuest } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.username || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!user) {
                const trimmed = name.trim();
                if (!trimmed) {
                    setError('Please enter a name');
                    setLoading(false);
                    return;
                }
                await handleGuest(trimmed);
            }

            const data = await createRoom();
            navigate(`/room/${data.roomId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
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
                        Create a room
                    </h1>
                    <p className="text-text-muted mb-8">
                        {user
                            ? "You'll be the host of this room."
                            : "Pick a name and you'll be the host — no account needed."}
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        {!user && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Your name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Alex"
                                    maxLength={20}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-brand transition-colors"
                                />
                            </div>
                        )}

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
                            {loading ? 'Creating…' : 'Create room'}
                        </button>
                    </form>

                    <p className="text-sm text-text-muted text-center mt-6">
                        Have a code?{' '}
                        <Link to="/join" className="text-brand hover:underline font-medium">
                            Join instead
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}