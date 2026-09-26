import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);

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
        <div
            className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-700 ${focused ? 'bg-white text-black' : 'bg-black text-white'
                }`}
        >
            <main className="w-full max-w-xl">
                <Link
                    to="/"
                    className="block font-display font-bold text-3xl tracking-tight mb-12 text-center"
                >
                    Co<span className="text-[#DC2626]  ml-1 font-logo">Watch</span>
                </Link>

                <h1 className="font-display font-bold text-5xl md:text-6xl mb-3 text-center">
                    Welcome back
                </h1>
                <p
                    className={`text-lg mb-12 text-center transition-colors duration-700 ${focused ? 'text-black/60' : 'text-white/70'
                        }`}
                >
                    Log in to continue to CoWatch.
                </p>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="yourname"
                            autoComplete="username"
                            required
                            className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-colors duration-500 focus:outline-none ${focused
                                    ? 'bg-white text-black border-black/15 placeholder:text-black/30 focus:border-black'
                                    : 'bg-transparent text-white border-white/25 placeholder:text-white/40 focus:border-white'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-colors duration-500 focus:outline-none ${focused
                                    ? 'bg-white text-black border-black/15 placeholder:text-black/30 focus:border-black'
                                    : 'bg-transparent text-white border-white/25 placeholder:text-white/40 focus:border-white'
                                }`}
                        />
                    </div>

                    {error && (
                        <div
                            className={`px-6 py-4 rounded-2xl text-base transition-colors duration-500 ${focused
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
                        className={`w-full py-4 text-lg rounded-2xl font-semibold transition-colors duration-500 disabled:opacity-60 ${focused
                                ? 'bg-black text-white hover:bg-black/85'
                                : 'bg-white text-black hover:bg-white/90'
                            }`}
                    >
                        {loading ? 'Logging in…' : 'Log in'}
                    </button>
                </form>

                <p
                    className={`text-base text-center mt-8 transition-colors duration-700 ${focused ? 'text-black/60' : 'text-white/70'
                        }`}
                >
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className={`font-medium underline-offset-4 hover:underline ${focused ? 'text-black' : 'text-white'
                            }`}
                    >
                        Sign up
                    </Link>
                </p>

                <p
                    className={`text-base text-center mt-3 transition-colors duration-700 ${focused ? 'text-black/60' : 'text-white/70'
                        }`}
                >
                    Just want to watch?{' '}
                    <Link
                        to="/guest"
                        className={`font-medium underline-offset-4 hover:underline ${focused ? 'text-black' : 'text-white'
                            }`}
                    >
                        Continue as guest
                    </Link>
                </p>
            </main>
        </div>
    );
}