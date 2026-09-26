import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { createRoom } from '../services/room.api';
import { Header } from '../../../shared/components/Header';

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
            <Header />

            <main className="flex-1 relative overflow-hidden">
                {/* Ambient glow orbs */}
                <div className="pointer-events-none absolute -top-40 left-1/4 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-brand/10 blur-[130px]" />

                <div className="relative max-w-[1500px] mx-auto px-4 md:px-6 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* LEFT — Form */}
                        <div className="flex flex-col">
                            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[10px] font-mono uppercase tracking-widest mb-6">
                                <span className="material-symbols-outlined text-[14px]">sensors</span>
                                Host a Party
                            </div>

                            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-3">
                                Create a room
                            </h1>
                            <p className="text-text-muted mb-8 max-w-md leading-relaxed">
                                {user
                                    ? "You'll be the host of this room. Share the code once it's created."
                                    : "Pick a name and you'll be the host — no account needed."}
                            </p>

                            <form onSubmit={onSubmit} className="space-y-6 max-w-md">
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
                                            className="w-full px-5 py-4 bg-surface text-text placeholder:text-text-muted/60 text-base rounded-2xl border border-border focus:border-brand focus:ring-4 focus:ring-brand/20 outline-none transition-all duration-200"
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
                                    disabled={loading}
                                    className="w-full py-4 text-lg rounded-2xl font-semibold bg-brand hover:bg-brand-hover text-white shadow-[0_4px_24px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_32px_rgba(220,38,38,0.5)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            <span>Creating room…</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create room</span>
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                    <Feature icon="vpn_key">You'll get a 6-character room code</Feature>
                                    <Feature icon="group_add">Share the code — friends join instantly</Feature>
                                    <Feature icon="shield_person">Only you control playback by default</Feature>
                                </div>
                            </form>

                            <p className="text-sm text-text-muted mt-8">
                                Have a code?{' '}
                                <Link to="/join" className="text-brand hover:underline font-medium">
                                    Join instead
                                </Link>
                            </p>
                        </div>

                        {/* RIGHT — Video Preview Mockup */}
                        <div className="relative lg:sticky lg:top-24">
                            <div className="relative rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden">
                                {/* Mock player */}
                                <div className="relative aspect-video bg-black overflow-hidden">
                                    <img
                                        src="https://i.pinimg.com/originals/e8/4e/db/e84edb279472c7ab49e97ec276d4ffda.gif"
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                                    {/* Top badges */}
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            LIVE SYNC
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
                                            <span className="text-green-400">All 100% in sync</span>
                                            <span>01:58:30</span>
                                        </div>
                                        <div className="relative w-full h-1.5 bg-white/20 rounded-full">
                                            <div className="h-full bg-brand rounded-full w-2/5" />
                                            <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 flex -space-x-1.5">
                                                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white text-[9px] font-bold shadow-md border-2 border-black/50">
                                                    H
                                                </div>
                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shadow-md border-2 border-black/50">
                                                    S
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info bar */}
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">tv</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate">
                                                    {name || 'Your'} Cinema Lounge
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    Waiting for friends to join
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-mono uppercase tracking-widest">
                                            Ready
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <Stat icon="lock" label="Lock Sync" color="text-brand" />
                                        <Stat icon="volume_off" label="Mute All" color="text-green-400" />
                                        <Stat icon="replay" label="Snap Scrub" color="text-blue-400" />
                                    </div>

                                    <div className="pt-3 border-t border-border flex items-center gap-2 text-xs text-text-muted">
                                        <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
                                        <span>Zero sign-up required · Free forever</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description below the card */}
                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand text-[20px] mt-0.5">movie</span>
                                    <div>
                                        <p className="text-sm font-medium">Watch anything together</p>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            YouTube, live streams, or any URL — synced frame-perfect for everyone in the room.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-400 text-[20px] mt-0.5">bolt</span>
                                    <div>
                                        <p className="text-sm font-medium">Instantly synced</p>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            Play, pause, seek — every action is broadcast to the room in real time.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-400 text-[20px] mt-0.5">shield_person</span>
                                    <div>
                                        <p className="text-sm font-medium">You stay in control</p>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            As host, you decide who can control the playback. Promote friends to moderators anytime.
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
            <span className="material-symbols-outlined text-brand text-[18px]">{icon}</span>
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