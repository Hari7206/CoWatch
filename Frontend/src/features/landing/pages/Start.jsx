import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../../shared/components/Header';

export default function Start() {
    const navigate = useNavigate();

    return (
        <div className="h-screen overflow-hidden flex flex-col bg-bg text-text">
            <Header />

            <main className="flex-1 pt-16 relative overflow-hidden flex flex-col">
                {/* Glow orbs */}
                <div className="pointer-events-none absolute -top-40 left-1/4 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-brand/10 blur-[130px]" />
                <div className="pointer-events-none absolute -bottom-40 right-1/4 translate-x-1/2 w-[550px] h-[550px] rounded-full bg-blue-900/15 blur-[140px]" />

                <div className="relative flex-1 min-h-0 max-w-[1500px] w-full mx-auto px-4 md:px-6 py-3 flex flex-col">

                    {/* Split panels */}
                    <div className="relative flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden">

                        {/* LEFT — Host */}
                        <div className="group relative flex flex-col justify-center items-center px-8 md:px-12 py-6 text-center hover:bg-bg-soft/40 transition-colors">
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-mono uppercase tracking-widest mb-5">
                                <span className="material-symbols-outlined text-[14px]">sensors</span>
                                Host a Party
                            </div>

                            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3 max-w-sm">
                                Start a new room
                            </h2>
                            <p className="text-text-muted max-w-xs leading-relaxed mb-8 text-sm">
                                Choose a video, invite friends with a link, and take full control of playback and moderation.
                            </p>

                            {/* Circular image */}
                            <div className="relative w-48 h-48 rounded-full bg-bg-soft flex flex-col items-center justify-center mb-8 shadow-[0_0_30px_rgba(220,38,38,0.15)] group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 rounded-full border border-brand/30 animate-ping opacity-25" />
                                <div className="pointer-events-none absolute -inset-1 rounded-full border border-brand/20" />
                                <img
                                    src="/host.jpg"
                                    alt="Host"
                                    className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-full object-cover"
                                />
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-bg/90 backdrop-blur text-brand text-xs font-bold tracking-wider border border-brand/30">
                                    HOST
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/create')}
                                className="w-full max-w-xs px-10 py-4 rounded-full bg-brand hover:bg-brand-hover text-white font-medium shadow-[0_0_28px_-4px_rgba(220,38,38,0.5)] hover:shadow-[0_0_35px_-4px_rgba(220,38,38,0.7)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                <span>Start a room</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex-col items-center pointer-events-none">
                            <div className="w-px h-24 bg-gradient-to-b from-transparent via-border to-transparent" />
                            <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-xl flex items-center justify-center my-2">
                                <span className="text-[10px] font-mono font-bold tracking-widest">OR</span>
                            </div>
                            <div className="w-px h-24 bg-gradient-to-b from-transparent via-border to-transparent" />
                        </div>

                        {/* Mobile divider */}
                        <div className="flex lg:hidden items-center justify-center py-3 bg-bg-soft/40 border-y border-border">
                            <div className="w-12 h-px bg-border" />
                            <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-text-muted">OR</span>
                            <div className="w-12 h-px bg-border" />
                        </div>

                        {/* RIGHT — Join */}
                        <div className="group relative flex flex-col justify-center items-center px-8 md:px-12 py-6 text-center hover:bg-bg-soft/40 transition-colors">
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-5">
                                <span className="material-symbols-outlined text-[14px]">group_add</span>
                                Join a Room
                            </div>

                            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3 max-w-sm">
                                Join with a code
                            </h2>
                            <p className="text-text-muted max-w-xs leading-relaxed mb-8 text-sm">
                                Got a room code from a friend? Hop straight in — no account required.
                            </p>

                            {/* Circular image */}
                            <div className="relative w-48 h-48 rounded-full bg-bg-soft flex flex-col items-center justify-center mb-8 shadow-[0_0_30px_rgba(37,99,235,0.20)] group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 rounded-full border border-blue-500/30" />
                                <div className="pointer-events-none absolute -inset-1 rounded-full border border-blue-500/20 animate-pulse" />
                                <img
                                    src="/member.png"
                                    alt="Join"
                                    className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-full object-cover"
                                />
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-bg/90 backdrop-blur text-blue-400 text-xs font-bold tracking-wider border border-blue-500/30">
                                    JOIN
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/join')}
                                className="w-full max-w-xs px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_0_28px_-4px_rgba(37,99,235,0.6)] hover:shadow-[0_0_35px_-4px_rgba(37,99,235,0.8)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">login</span>
                                <span>Join with code</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Info strip below */}
                    <div className="mt-3 shrink-0 p-3 rounded-2xl bg-surface border border-border flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-brand text-[16px]">info</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">New to CoWatch?</p>
                                <p className="text-xs text-text-muted">
                                    Skip accounts entirely — continue as a guest and start watching in seconds.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/guest"
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface border border-border hover:bg-bg-soft text-sm font-medium transition-colors"
                        >
                            Continue as guest
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}