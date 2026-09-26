import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../../shared/components/Header';
import { Footer } from '../../../shared/components/Footer';

export default function Home() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    function handleJoinByCode(e) {
        e.preventDefault();
        const trimmed = code.trim().toUpperCase();
        if (!trimmed) return;
        navigate(`/room/${trimmed}`);
    }

    return (
        <div className="min-h-screen flex flex-col bg-bg text-text">
            <Header />

            <main className="flex-1 pt-16">
                <Hero
                    code={code}
                    setCode={setCode}
                    onSubmit={handleJoinByCode}
                    onCreate={() => navigate('/start')}
                    onJoin={() => navigate('/start')}
                />
                <Stats />
                <Features />
                <Ways />
                <JoinOrCreate />
                <Faq />
            </main>

            <Footer />
        </div>
    );
}

/* ---------- HERO ---------- */

function Hero({ code, setCode, onSubmit, onCreate, onJoin }) {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Glow orbs */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-brand/25 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[480px] -left-32 w-[380px] h-[380px] bg-brand/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative px-4 md:px-6 max-w-[1500px] mx-auto pt-16 pb-24 flex flex-col items-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-high border border-border text-xs font-mono text-text-muted uppercase tracking-widest mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
                    </span>
                    Watch together, in sync
                </div>

                <h1 className="font-display font-bold text-5xl md:text-7xl max-w-4xl tracking-tight mb-6">
                    No more watching{' '}
                    <span className="bg-gradient-to-r from-brand via-red-400 to-orange-400 bg-clip-text text-transparent">
                        alone.
                    </span>
                </h1>

                <p className="text-lg text-text-muted max-w-2xl mb-10 leading-relaxed">
                    Start a room, drop a YouTube link, and watch with friends
                    from anywhere — perfectly in sync.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mb-6">
                    <button
                        onClick={onCreate}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand text-white font-medium shadow-[0_0_32px_-4px_rgba(220,38,38,0.6)] hover:bg-brand-hover transition-all hover:-translate-y-0.5"
                    >
                        Start a room
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    <button
                        onClick={onJoin}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-surface-high hover:bg-surface border border-border text-text font-medium transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px] text-text-muted">dialpad</span>
                        Join with code
                    </button>
                </div>

                {/* Quick code input */}
                <form
                    onSubmit={onSubmit}
                    className="w-full max-w-sm p-1.5 rounded-full bg-surface border border-border shadow-lg flex items-center gap-2 mb-16"
                >
                    <div className="flex items-center gap-2 pl-4 text-text-muted">
                        <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                            placeholder="ABC123"
                            maxLength={6}
                            className="w-32 bg-transparent text-base uppercase tracking-[0.25em] text-text placeholder:text-text-muted/50 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="ml-auto px-5 py-2 rounded-full bg-brand text-white font-medium text-sm hover:bg-brand-hover transition-colors"
                    >
                        Enter
                    </button>
                </form>

                {/* Live room mockup */}
                <RoomMockup />
            </div>
        </section>
    );
}

function RoomMockup() {
    const fakeAvatars = [
        { initial: 'Y', color: '#DC2626', label: 'You (Host)' },
        { initial: 'A', color: '#0891B2', label: 'Alex (Mod)' },
        { initial: 'E', color: '#7C3AED', label: 'Elena' },
    ];

    return (
        <div className="w-full max-w-6xl rounded-2xl bg-surface border border-border p-2 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand/20 via-red-500/10 to-orange-500/20 blur-2xl opacity-60 pointer-events-none" />
            <div className="relative rounded-xl bg-bg-soft overflow-hidden flex flex-col">
                {/* Top bar */}
                <div className="h-12 px-4 bg-surface border-b border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <span className="hidden sm:inline font-mono text-[10px] text-text-muted uppercase tracking-widest">Room:</span>
                        <span className="font-mono text-xs text-text bg-surface-high px-2 py-0.5 rounded">ABC123</span>
                        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-mono uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            In Sync
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {fakeAvatars.map((a) => (
                                <div
                                    key={a.initial}
                                    title={a.label}
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm border-2 border-surface"
                                    style={{ backgroundColor: a.color }}
                                >
                                    {a.initial}
                                </div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-surface-high flex items-center justify-center text-text-muted text-[10px] font-bold border-2 border-surface">
                                +5
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player + chat */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
                    {/* Player side */}
                    <div className="lg:col-span-8 relative bg-black flex flex-col justify-end p-4 overflow-hidden">
                        <img
                            src="/hero.jpg"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

                        {/* Video label */}
                        <div className="relative z-10 flex items-center justify-between mb-auto">
                            <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur text-white text-[11px] flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-brand">smart_display</span>
                                Cyberpunk: Edgerunners · Ep 04
                            </span>
                            <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur text-green-400 text-[10px] font-mono uppercase tracking-wider">
                                1080p · 60fps
                            </span>
                        </div>

                        {/* Player controls */}
                        <div className="relative z-10 w-full">
                            <div className="relative w-full h-3 flex items-center mb-3">
                                <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                                    <div className="h-full bg-brand w-[42%] rounded-full" />
                                </div>
                                <div className="absolute left-[42%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white ring-2 ring-brand shadow-md" />
                                <div className="absolute left-[42%] -translate-x-1/2 -top-6 flex -space-x-1.5">
                                    {fakeAvatars.map((a) => (
                                        <div
                                            key={a.initial}
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-md"
                                            style={{ backgroundColor: a.color }}
                                        >
                                            {a.initial}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-[24px]">pause</span>
                                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                                    <span className="font-mono text-xs text-white/70">24:18 / 1:42:00</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat side */}
                    <div className="lg:col-span-4 bg-surface border-l border-border flex flex-col">
                        <div className="p-3 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand text-[18px]">forum</span>
                                <span className="text-sm font-semibold">Party Chat</span>
                            </div>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">8 Watching</span>
                        </div>

                        <div className="p-4 flex flex-col gap-3 flex-1 text-left">
                            <MockMessage name="You" role="HOST" color="#DC2626" time="24:10">
                                Soundtrack on this episode is unreal 🎧
                            </MockMessage>
                            <MockMessage name="Alex" role="MOD" color="#0891B2" time="24:14">
                                Wait till the car chase sequence!
                            </MockMessage>
                            <MockMessage name="Elena" role="GUEST" color="#7C3AED" time="24:17">
                                Pass the popcorn 🍿✨
                            </MockMessage>
                        </div>

                        <div className="p-3 border-t border-border">
                            <div className="flex items-center gap-2 rounded-full bg-bg border border-border px-4 py-2">
                                <span className="text-sm text-text-muted flex-1">Send a reaction…</span>
                                <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[16px]">send</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MockMessage({ name, role, color, time, children }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color }}>{name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-high text-text-muted uppercase font-mono tracking-wider">
                    {role}
                </span>
                <span className="text-[10px] text-text-muted font-mono">{time}</span>
            </div>
            <p className="text-sm text-text bg-surface-high/60 rounded-lg px-3 py-2 leading-relaxed">
                {children}
            </p>
        </div>
    );
}

/* ---------- STATS ---------- */

function Stats() {
    return (
        <section className="w-full border-y border-border/50">
            <div className="px-4 md:px-6 max-w-[1500px] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
                <div className="flex flex-col items-center py-2">
                    <span className="font-display text-4xl md:text-5xl font-bold text-brand">50,000+</span>
                    <span className="text-sm text-text-muted mt-2">Hours watched together</span>
                </div>
                <div className="flex flex-col items-center py-2">
                    <span className="font-display text-4xl md:text-5xl font-bold text-green-400">0ms</span>
                    <span className="text-sm text-text-muted mt-2">Noticeable sync latency</span>
                </div>
                <div className="flex flex-col items-center py-2">
                    <span className="font-display text-4xl md:text-5xl font-bold text-orange-400">100% Free</span>
                    <span className="text-sm text-text-muted mt-2">No plugins or downloads</span>
                </div>
            </div>
        </section>
    );
}

/* ---------- FEATURES ---------- */

function Features() {
    const items = [
        {
            icon: 'sync',
            number: '01',
            title: 'Perfect sync',
            text: 'Play, pause, and seek — everyone stays on the exact same frame. Drift correction eliminates echo.',
        },
        {
            icon: 'admin_panel_settings',
            number: '02',
            title: 'Roles & control',
            text: 'Hosts decide who can control. Promote friends to moderators with a single click.',
        },
        {
            icon: 'person_off',
            number: '03',
            title: 'Anonymous by default',
            text: 'No account needed. Guests get a name and a 2-hour session. Zero trackers.',
        },
        {
            icon: 'play_circle',
            number: '04',
            title: 'Any YouTube video',
            text: 'Search inside the room, paste a link, or jump to a URL. Livestreams work too.',
        },
    ];

    return (
        <section id="features" className="w-full py-20">
            <div className="px-4 md:px-6 max-w-[1500px] mx-auto">
                <div className="mb-12">
                    <span className="text-xs font-mono text-brand uppercase tracking-widest">What it does</span>
                    <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 tracking-tight">
                        Built for watching together.
                    </h2>
                    <p className="text-text-muted max-w-xl mt-3">
                        Engineered from scratch to make remote movie nights feel like sitting on the same couch.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((f) => (
                        <div
                            key={f.number}
                            className="group p-8 rounded-2xl bg-surface border border-border hover:bg-surface-high transition-all shadow-lg relative overflow-hidden flex flex-col gap-8 min-h-[220px]"
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[26px]">{f.icon}</span>
                                </div>
                                <span className="font-mono text-3xl text-text-muted/30">{f.number}</span>
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- WAYS ---------- */

function Ways() {
    const items = [
        {
            icon: 'login',
            title: 'Log in',
            text: 'Already have an account? Pick up where you left off and access your rooms.',
            to: '/login',
            cta: 'Log in',
        },
        {
            icon: 'auto_awesome',
            title: 'Sign up',
            text: 'Save your rooms and history. Takes 10 seconds. Your own account.',
            to: '/signup',
            cta: 'Sign up',
            featured: true,
        },
        {
            icon: 'bolt',
            title: 'Continue as guest',
            text: 'Skip accounts. Just pick a name and start watching. Frictionless.',
            to: '/guest',
            cta: 'Continue as guest',
        },
    ];

    return (
        <section id="how-it-works" className="w-full py-20 bg-bg-soft">
            <div className="px-4 md:px-6 max-w-[1500px] mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-mono text-brand uppercase tracking-widest">Three ways in</span>
                    <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 tracking-tight">
                        Pick how you want to start.
                    </h2>
                    <p className="text-text-muted mt-3">
                        Jump straight into a room or create a permanent home for your watch club.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {items.map((w) => (
                        <Link
                            key={w.title}
                            to={w.to}
                            className={`relative p-8 rounded-2xl flex flex-col justify-between shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                                w.featured
                                    ? 'bg-surface border-2 border-brand/60'
                                    : 'bg-surface border border-border'
                            }`}
                        >
                            {w.featured && (
                                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-brand text-white text-[10px] font-mono uppercase tracking-widest font-bold">
                                    Most Popular
                                </div>
                            )}
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-surface-high flex items-center justify-center text-brand mb-5">
                                    <span className="material-symbols-outlined text-[22px]">{w.icon}</span>
                                </div>
                                <h3 className="font-display font-bold text-xl mb-2">{w.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{w.text}</p>
                            </div>
                            <div className="pt-6">
                                {w.featured ? (
                                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white font-medium text-sm shadow-[0_0_24px_-4px_rgba(220,38,38,0.5)]">
                                        {w.cta}
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 text-brand font-semibold text-sm">
                                        {w.cta}
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- JOIN OR CREATE ---------- */

function JoinOrCreate() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = code.trim().toUpperCase();
        if (!trimmed) return;
        navigate(`/room/${trimmed}`);
    }

    return (
        <section className="w-full py-20">
            <div className="px-4 md:px-6 max-w-[1500px] mx-auto">
                <div className="p-8 md:p-12 rounded-3xl bg-surface border border-border shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 flex flex-col gap-6">
                            <span className="self-start px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-mono uppercase tracking-widest">
                                Already invited?
                            </span>
                            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
                                Jump into a room with a 6-character code.
                            </h2>
                            <p className="text-text-muted">
                                Enter the unique room passkey provided by the host. No install, no extension, no waiting room.
                            </p>

                            <div className="flex flex-col gap-3 mt-2">
                                <Check>Auto-syncs immediately with the host playhead</Check>
                                <Check>Pick any guest name before entering</Check>
                                <Check>Full audio, chat, and reaction features unlocked</Check>
                            </div>
                        </div>

                        <div className="lg:col-span-6 flex justify-center">
                            <div className="w-full max-w-md p-8 rounded-2xl bg-bg-soft border border-border shadow-2xl flex flex-col gap-5">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold">Enter 6-digit room code</label>
                                    <span className="text-xs text-text-muted">Example: ABC123</span>
                                </div>
                                <input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                    maxLength={6}
                                    placeholder="ABC123"
                                    className="w-full px-6 py-5 rounded-2xl bg-surface border border-border focus:outline-none focus:border-brand text-center font-mono text-3xl tracking-[0.35em] uppercase placeholder:text-text-muted/30 transition-colors"
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={!code.trim()}
                                    className="w-full py-4 rounded-full bg-brand text-white font-medium shadow-[0_0_24px_-4px_rgba(220,38,38,0.5)] hover:bg-brand-hover transition-all disabled:opacity-40"
                                >
                                    Join room
                                </button>
                                <p className="text-center text-xs text-text-muted">
                                    Don't have a code?{' '}
                                    <Link to="/start" className="text-brand font-semibold underline underline-offset-4">
                                        Start a room
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Check({ children }) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[14px]">check</span>
            </span>
            <span className="text-sm text-text">{children}</span>
        </div>
    );
}

/* ---------- FAQ ---------- */

function Faq() {
    const items = [
        {
            q: 'Do I need an account to watch?',
            a: 'Nope. You can continue as a guest, pick any name, and start watching in seconds.',
        },
        {
            q: 'How long do guest sessions last?',
            a: '2 hours. After that the session expires and you re-enter a name. Nothing is stored for guests.',
        },
        {
            q: 'Can two people have the same name?',
            a: 'Yes. Guests are anonymous — the same display name can be used by multiple people.',
        },
        {
            q: 'Who can pause or change the video?',
            a: 'Only the host and moderators. Participants can request an action — the host approves from chat.',
        },
        {
            q: 'What happens when everyone leaves?',
            a: 'The room is deleted automatically. Rooms only exist while at least one person is inside.',
        },
    ];

    const [open, setOpen] = useState(0);

    return (
        <section id="faq" className="w-full pb-24">
            <div className="px-4 md:px-6 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-brand uppercase tracking-widest">Questions? Answered.</span>
                    <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 tracking-tight">
                        Everything you need to know.
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl bg-surface border overflow-hidden transition-colors ${
                                open === i ? 'border-brand/40' : 'border-border'
                            }`}
                        >
                            <button
                                onClick={() => setOpen(open === i ? -1 : i)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <span className="font-display font-semibold text-base md:text-lg">
                                    {item.q}
                                </span>
                                <span
                                    className={`material-symbols-outlined text-brand transition-transform duration-200 ${
                                        open === i ? 'rotate-180' : ''
                                    }`}
                                >
                                    expand_more
                                </span>
                            </button>
                            {open === i && (
                                <div className="px-6 pb-5 text-text-muted text-sm leading-relaxed">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}