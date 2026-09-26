import { useState } from 'react';
import { useRoom } from '../hooks/useRoom';

export default function PlayerControls({ localTime }) {
    const { playback, canControl, play, pause, seek, playerRef } = useRoom();
    const [scrubTime, setScrubTime] = useState(null);

    const isPlaying = playback?.playing;
    const duration = playerRef?.current?.getDuration?.() || 0;
    const displayTime = scrubTime ?? localTime ?? 0;
    const displayDuration = duration || 0;

    function format(t) {
        if (!t || isNaN(t)) return '0:00';
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function handleToggle() {
        if (!canControl) return;
        if (isPlaying) pause();
        else play();
    }

    function handleSeekChange(e) {
        setScrubTime(Number(e.target.value));
    }

    function handleSeekEnd(e) {
        if (!canControl) return;
        const time = Number(e.target.value);
        setScrubTime(null);
        seek(time);
    }

    return (
        <div className="rounded-2xl bg-surface border border-border p-4 flex items-center gap-4">
            <button
                onClick={handleToggle}
                disabled={!canControl}
                className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            <span className="font-mono text-sm w-12 text-right tabular-nums">
                {format(displayTime)}
            </span>

            <input
                type="range"
                min={0}
                max={Math.max(displayDuration, 1)}
                step={0.1}
                value={displayTime}
                onChange={handleSeekChange}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                disabled={!canControl || !playback?.videoId}
                className="flex-1 accent-brand disabled:opacity-40"
            />

            <span className="font-mono text-sm w-12 tabular-nums text-text-muted">
                {format(displayDuration)}
            </span>

            {!canControl && (
                <span className="text-xs text-text-muted whitespace-nowrap">
                    Host only
                </span>
            )}
        </div>
    );
}