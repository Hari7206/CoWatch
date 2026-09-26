import { useNavigate } from 'react-router-dom';
import { Header } from '../../../shared/components/Header';
import SplitPanel from '../components/SplitPanel';

const Start = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-bg text-text">
            <Header />

            <main className="flex-1 flex flex-col md:flex-row relative">
                <SplitPanel
                    side="left"
                    title="I'm here to Host"
                    subtitle="Create a new watch party and invite friends with a code."
                    ctaLabel="Create Room"
                    ctaTo="/create"
                    altText="Already have a code? Join instead"
                    altTo="/join"
                    onNavigate={navigate}
                />
                <SplitPanel
                    side="right"
                    title="I'm here to Join"
                    subtitle="Enter a room code and jump into the party."
                    ctaLabel="Join Room"
                    ctaTo="/join"
                    altText="Want to host? Create a room"
                    altTo="/create"
                    onNavigate={navigate}
                />

                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="bg-surface border border-border rounded-2xl px-6 py-4 shadow-sm">
                        <span className="font-display font-bold text-xl">
                            Co<span className="text-brand">Watch</span>
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Start;