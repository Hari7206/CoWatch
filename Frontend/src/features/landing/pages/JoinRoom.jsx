import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

export default function JoinRoom() {
    const { user, handleGuest } = useAuth();
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState(user?.username || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const code = roomId.trim().toUpperCase();
            if (!code) {
                setError('Please enter a room code');
                setLoading(false);
                return;
            }

            if (!user) {
                const trimmed = name.trim();
                if (!trimmed) {
                    setError('Please enter a name');
                    setLoading(false);
                    return;
                }
                await handleGuest(trimmed);
            }

            navigate(`/room/${code}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
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
                        Join a room
                    </h1>
                    <p className="text-text-muted mb-8">
                        {user
                            ? 'Enter the room code to join.'
                            : "Enter the code and pick a name — no account needed."}
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Room code
                            </label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                placeholder="ABC123"
                                maxLength={6}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-brand font-mono text-lg uppercase text-center tracking-[0.3em] transition-colors"
                            />
                        </div>

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
                            {loading ? 'Joining…' : 'Join room'}
                        </button>
                    </form>

                    <p className="text-sm text-text-muted text-center mt-6">
                        Want to host?{' '}
                        <Link to="/create" className="text-brand hover:underline font-medium">
                            Create a room
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}