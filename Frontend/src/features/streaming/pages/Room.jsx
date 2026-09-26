import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { RoomContextProvider } from '../RoomContext';
import { useRoom } from '../hooks/useRoom';
import YouTubePlayer from '../components/YouTubePlayer';
import VideoPicker from '../components/VideoPicker';
import PlayerControls from '../components/PlayerControls';
import ParticipantList from '../components/ParticipantList';
import ChatPanel from '../components/ChatPanel';

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
    const navigate = useNavigate();

    const {
        roomId,
        connected,
        playback,
        participants,
        error,
        canControl,
        playerRef,
    } = useRoom();

    const [localTime, setLocalTime] = useState(0);
    const [copied, setCopied] = useState(false);

    function copyCode() {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    function leaveRoom() {
        navigate('/');
    }

    if (error) {
        return (
            <div className="h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <h1 className="font-display font-bold text-2xl mb-4">Room error</h1>
                    <p className="text-white/60 mb-6">{error}</p>
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

    const hostName =
        participants.find((p) => p.role === 'host')?.username || 'Host';

    return (
        <div className="h-screen overflow-hidden bg-[#0f0f0f] text-white flex flex-col">

            {/* TOP BAR */}
            <header className="shrink-0 px-4 md:px-6 py-3 border-b border-white/5">
                <div className="flex items-center justify-between gap-4">

                    {/* Left: Logo + Status + Room Code */}
                    <div className="flex items-center gap-5 min-w-0">
                        <Link
                            to="/"
                            className="font-logo font-bold text-xl tracking-tight shrink-0"
                        >
                            Co<span className="text-brand">Watch</span>
                        </Link>

                        <div className="hidden sm:flex items-center gap-2 pl-5 border-l border-white/10">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                                }`}
                            />
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                                {connected ? 'Live' : 'Connecting'}
                            </span>
                        </div>

                        <div className="hidden md:block min-w-0 pl-5 border-l border-white/10">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                                Room Code
                            </p>
                            <p className="font-display font-bold text-base tracking-widest truncate">
                                {roomId}
                            </p>
                        </div>
                    </div>

                    {/* Right: Host + Copy + Leave */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                                Host
                            </p>
                            <p className="text-sm font-medium truncate max-w-[140px]">
                                {hostName}
                            </p>
                        </div>

                        <button
                            onClick={copyCode}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                {copied ? 'check' : 'content_copy'}
                            </span>
                            <span className="hidden sm:inline">
                                {copied ? 'Copied!' : 'Copy Code'}
                            </span>
                        </button>

                        <button
                            onClick={leaveRoom}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                logout
                            </span>
                            <span className="hidden sm:inline">Leave</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN — Video + Chat + Search */}
            <main className="flex-1 min-h-0 px-4 md:px-6 py-4 overflow-hidden">
                <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

                    {/* LEFT: Video + Controls + Picker */}
                    <div className="flex flex-col gap-3 min-h-0">
                        <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-black">
                            <YouTubePlayer
                                ref={playerRef}
                                videoId={playback?.videoId}
                                playing={playback?.playing}
                                currentTime={playback?.currentTime}
                                canControl={canControl}
                                onTimeUpdate={setLocalTime}
                            />
                        </div>

                        <div className="shrink-0">
                            <PlayerControls localTime={localTime} />
                        </div>

                        <div className="shrink-0">
                            <VideoPicker />
                        </div>
                    </div>

                    {/* RIGHT: Participants + Chat */}
                    <aside className="flex flex-col gap-3 min-h-0">
                        <div className="shrink-0 max-h-[30%] overflow-y-auto">
                            <ParticipantList />
                        </div>
                        <div className="flex-1 min-h-0">
                            <ChatPanel />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}