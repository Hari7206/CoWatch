import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

            <main className="flex-1">
             <Hero
    code={code}
    setCode={setCode}
    onSubmit={handleJoinByCode}
    onCreate={() => navigate('/start')}
    onJoin={() => navigate('/start')}
/>
                <HowItWorks />
               <FinalCta onStart={() => navigate('/start')} />
            </main>

            <Footer />
        </div>
    );
}

function Hero({ code, setCode, onSubmit, onCreate, onJoin }) {
    return (
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
            <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-soft text-text-muted text-sm">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    Watch together, in sync
                </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
                Watch YouTube
                <br />
                <span className="text-brand">together.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                Create a room, share the link, and watch any video with friends.
                Play, pause, seek — everyone stays perfectly in sync.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
                <button
                    onClick={onCreate}
                    className="px-8 py-4 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors font-medium shadow-sm"
                >
                    Create a room →
                </button>
                <button
                    onClick={onJoin}
                    className="px-8 py-4 rounded-full bg-surface border border-border hover:bg-bg-soft transition-colors font-medium"
                >
                    Join with code
                </button>
            </div>

            <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-muted uppercase tracking-widest">
                    or enter a code
                </span>
                <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={onSubmit} className="flex justify-center gap-2 max-w-md mx-auto mt-6">
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ABC123"
                    maxLength={6}
                    className="flex-1 px-5 py-4 rounded-full bg-surface border border-border focus:outline-none focus:border-brand font-mono text-lg uppercase text-center tracking-[0.3em] transition-colors"
                />
                <button
                    type="submit"
                    className="px-6 py-4 rounded-full bg-surface border border-border hover:bg-bg-soft transition-colors font-medium"
                >
                    Join
                </button>
            </form>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Create a room',
            text: 'Start a new watch party and get a unique 6-character code.',
        },
        {
            number: '02',
            title: 'Share the link',
            text: 'Send the code to friends. They join in one click — no account needed.',
        },
        {
            number: '03',
            title: 'Watch together',
            text: 'Play, pause, and seek. Everyone in the room stays in perfect sync.',
        },
    ];

    return (
        <section className="max-w-5xl mx-auto px-6 pb-24">
            <div className="text-center mb-16">
                <p className="text-sm font-mono text-brand mb-3 uppercase tracking-widest">
                    How it works
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                    Three steps to watch together
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step) => (
                    <StepCard key={step.number} {...step} />
                ))}
            </div>
        </section>
    );
}

function StepCard({ number, title, text }) {
    return (
        <div className="rounded-2xl bg-surface border border-border p-8 hover:border-brand/40 transition-colors">
            <div className="font-mono text-brand text-sm mb-6 tracking-widest">
                {number}
            </div>
            <h3 className="font-display font-semibold text-xl mb-3">{title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{text}</p>
        </div>
    );
}

function FinalCta({ onStart }) {
    return (
        <section className="max-w-5xl mx-auto px-6 pb-24">
            <div className="rounded-3xl bg-surface border border-border p-12 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Ready to watch?
                </h2>
                <p className="text-text-muted mb-8 max-w-lg mx-auto">
                    Set up a room in seconds. Invite your friends. Enjoy the show.
                </p>
                <button
                    onClick={onStart}
                    className="px-8 py-4 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors font-medium"
                >
                    Start a watch party →
                </button>
            </div>
        </section>
    );
}