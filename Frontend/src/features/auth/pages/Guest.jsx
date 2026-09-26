import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Guest() {
    const { handleGuest } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);

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
        <div
            className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-700 ${
                focused ? 'bg-white text-black' : 'bg-black text-white'
            }`}
        >
            <main className="w-full max-w-xl">
                <Link
                    to="/"
                    className="block font-display font-bold text-3xl tracking-tight mb-12 text-center"
                >
                    Co<span className="text-brand">Watch</span>
                </Link>

                <h1 className="font-display font-bold text-5xl md:text-6xl mb-3 text-center">
                    Watch as a guest
                </h1>
                <p
                    className={`text-lg mb-12 text-center transition-colors duration-700 ${
                        focused ? 'text-black/60' : 'text-white/70'
                    }`}
                >
                    Pick a name, we'll use it in the room. No account needed.
                </p>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Your name
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="e.g. Alex"
                            maxLength={20}
                            required
                            className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-colors duration-500 focus:outline-none ${
                                focused
                                    ? 'bg-white text-black border-black/15 placeholder:text-black/30 focus:border-black'
                                    : 'bg-transparent text-white border-white/25 placeholder:text-white/40 focus:border-white'
                            }`}
                        />
                    </div>

                    {error && (
                        <div
                            className={`px-6 py-4 rounded-2xl text-base transition-colors duration-500 ${
                                focused
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-red-900/40 text-white'
                            }`}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 text-lg rounded-2xl font-semibold transition-colors duration-500 disabled:opacity-60 ${
                            focused
                                ? 'bg-black text-white hover:bg-black/85'
                                : 'bg-white text-black hover:bg-white/90'
                        }`}
                    >
                        {loading ? 'Getting ready…' : 'Continue as guest'}
                    </button>
                </form>

                <p
                    className={`text-base text-center mt-8 transition-colors duration-700 ${
                        focused ? 'text-black/60' : 'text-white/70'
                    }`}
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className={`font-medium underline-offset-4 hover:underline ${
                            focused ? 'text-black' : 'text-white'
                        }`}
                    >
                        Log in
                    </Link>
                </p>
            </main>
        </div>
    );
}