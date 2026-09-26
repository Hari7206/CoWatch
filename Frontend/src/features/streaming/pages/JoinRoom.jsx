import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Header } from '../../../shared/components/Header';

export default function JoinRoom() {
    const { user, handleGuest } = useAuth();
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState(user?.username || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function formatCode(v) {
        return v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    }

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
            <Header />

            <main className="flex-1 relative overflow-hidden">
                {/* Ambient glow orbs — blue-themed */}
                <div className="pointer-events-none absolute -top-40 right-1/4 translate-x-1/2 w-[550px] h-[550px] rounded-full bg-blue-500/10 blur-[130px]" />
                <div className="pointer-events-none absolute -bottom-40 left-1/4 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-blue-900/15 blur-[140px]" />

                <div className="relative max-w-[1500px] mx-auto px-4 md:px-6 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* LEFT — Form */}
                        <div className="flex flex-col">
                            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                                <span className="material-symbols-outlined text-[14px]">group_add</span>
                                Join a Room
                            </div>

                            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-3">
                                Join a room
                            </h1>
                            <p className="text-text-muted mb-8 max-w-md leading-relaxed">
                                {user
                                    ? 'Enter the room code to join.'
                                    : "Enter the code and pick a name — no account needed."}
                            </p>

                            <form onSubmit={onSubmit} className="space-y-6 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium mb-3">
                                        Room code
                                    </label>
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(formatCode(e.target.value))}
                                        placeholder="ABC123"
                                        maxLength={6}
                                        required
                                        autoComplete="off"
                                        spellCheck="false"
                                        className="w-full px-5 py-5 bg-surface text-text placeholder:text-text-muted/40 text-2xl rounded-2xl border border-border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 text-center font-display uppercase tracking-[0.4em]"
                                    />
                                    <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">info</span>
                                        6-character code — letters and numbers only
                                    </p>
                                </div>

                                {!user && (
                                    <div>
                                        <label className="block text-sm font-medium mb-3">
                                            Your name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Alex"
                                            maxLength={20}
                                            required
                                            className="w-full px-5 py-4 bg-surface text-text placeholder:text-text-muted/60 text-base rounded-2xl border border-border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200"
                                        />
                                        <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px]">info</span>
                                            Session lasts 2 hours. Completely anonymous.
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div className="w-full bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl px-5 py-3 text-sm flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[18px]">error</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !roomId.trim()}
                                    className="w-full py-4 text-lg rounded-2xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.5)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            <span>Joining room…</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Join room</span>
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                    <Feature icon="bolt">Instant sync — no install, no plugins</Feature>
                                    <Feature icon="group">Watch with anyone — no account needed</Feature>
                                    <Feature icon="lock_open">Fully anonymous — you pick your name</Feature>
                                </div>
                            </form>

                            <p className="text-sm text-text-muted mt-8">
                                Want to host?{' '}
                                <Link to="/create" className="text-brand hover:underline font-medium">
                                    Create a room
                                </Link>
                            </p>
                        </div>

                        {/* RIGHT — Video Preview Mockup */}
                        <div className="relative lg:sticky lg:top-24">
                            <div className="relative rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden">
                                {/* Mock player */}
                                <div className="relative aspect-video bg-black overflow-hidden">
                                    <img
                                        src="https://i.pinimg.com/originals/04/29/72/0429722fff58863a95104e37eea5ed44.gif"
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                                    {/* Top badges */}
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                            SYNCING
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white/80 text-[10px] font-mono uppercase tracking-widest">
                                            4K HDR
                                        </span>
                                    </div>

                                    {/* Center play button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur border border-white/30 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[42px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                play_arrow
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center justify-between text-[10px] font-mono text-white/80 mb-2">
                                            <span>42:15</span>
                                            <span className="text-blue-400">All 100% in sync</span>
                                            <span>01:58:30</span>
                                        </div>
                                        <div className="relative w-full h-1.5 bg-white/20 rounded-full">
                                            <div className="h-full bg-blue-500 rounded-full w-2/5" />
                                            <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 flex -space-x-1.5">
                                                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white text-[9px] font-bold shadow-md border-2 border-black/50">
                                                    H
                                                </div>
                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shadow-md border-2 border-black/50">
                                                    Y
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info bar */}
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate">
                                                    Joining as {name || 'guest'}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {roomId || 'Waiting for code…'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-widest">
                                            Ready
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <Stat icon="visibility" label="Watch Live" color="text-blue-400" />
                                        <Stat icon="chat" label="Chat Free" color="text-green-400" />
                                        <Stat icon="celebration" label="React" color="text-purple-400" />
                                    </div>

                                    <div className="pt-3 border-t border-border flex items-center gap-2 text-xs text-text-muted">
                                        <span className="material-symbols-outlined text-[16px] text-blue-400">check_circle</span>
                                        <span>No install · No plugins · No signup</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description below the card */}
                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-400 text-[20px] mt-0.5">bolt</span>
                                    <div>
                                        <p className="text-sm font-medium">Zero friction join</p>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            Just the code, that's it. You're in and watching in seconds.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-400 text-[20px] mt-0.5">sync</span>
                                    <div>
                                        <p className="text-sm font-medium">Perfectly synced</p>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            The playhead follows the host automatically — no buffering, no drift.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand text-[20px] mt-0.5">shield_person</span>
                                    <div>
                                        <p className="text-sm font-medium">Fully anonymous</p>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            No account, no history, no tracking. You're just a name in the room.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Feature({ icon, children }) {
    return (
        <div className="flex items-center gap-3 text-sm text-text-muted">
            <span className="material-symbols-outlined text-blue-400 text-[18px]">{icon}</span>
            <span>{children}</span>
        </div>
    );
}

function Stat({ icon, label, color }) {
    return (
        <div className="p-2.5 rounded-xl bg-bg-soft flex flex-col items-center justify-center gap-1 text-center">
            <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
            <span className="text-[11px] font-medium text-text-muted">{label}</span>
        </div>
    );
}