import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { RoomContextProvider } from '../RoomContext';
import { useRoom } from '../hooks/useRoom';
import YouTubePlayer from '../components/YouTubePlayer';
import VideoPicker from '../components/VideoPicker';
import PlayerControls from '../components/PlayerControls';
import ParticipantList from '../components/ParticipantList';

export default function Room() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <RoomContextProvider roomId={roomId}>
            <RoomInner />
        </RoomContextProvider>
    );
}

function RoomInner() {
    const {
        roomId,
        connected,
        playback,
        myRole,
        error,
        canControl,
        changeVideo,
        playerRef,
    } = useRoom();

    const [localTime, setLocalTime] = useState(0);

    if (error) {
        return (
            <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <h1 className="font-display font-bold text-2xl mb-4">
                        Room error
                    </h1>
                    <p className="text-text-muted mb-6">{error}</p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors font-medium"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg text-text flex flex-col">
            <header className="border-b border-border bg-bg">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        to="/"
                        className="font-display font-bold text-xl tracking-tight"
                    >
                        CoWatch
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-muted">Room</span>
                        <span className="font-mono text-lg tracking-widest">
                            {roomId}
                        </span>
                        <span
                            className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    <div className="space-y-4">
                        <YouTubePlayer
                            ref={playerRef}
                            videoId={playback?.videoId}
                            playing={playback?.playing}
                            currentTime={playback?.currentTime}
                            canControl={canControl}
                            onTimeUpdate={setLocalTime}
                        />

                        <PlayerControls
                            localTime={localTime}
                        />

                        <VideoPicker
                            onSelect={changeVideo}
                            disabled={!canControl}
                        />
                    </div>

                    <aside className="space-y-4">
                        <ParticipantList />
                    </aside>
                </div>
            </main>
        </div>
    );
}