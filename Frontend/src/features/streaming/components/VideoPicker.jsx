import { useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import YouTubeUrlInput from './YouTubeUrlInput';
import YouTubeSearch from './YouTubeSearch';

export default function VideoPicker() {
    const { requestChangeVideo, canControl } = useRoom();
    const [tab, setTab] = useState('search');

    return (
        <div className="rounded-2xl bg-surface border border-border p-4 space-y-3">
            <div className="flex gap-2">
                <TabButton active={tab === 'search'} onClick={() => setTab('search')}>
                    Search
                </TabButton>
                <TabButton active={tab === 'url'} onClick={() => setTab('url')}>
                    YouTube URL
                </TabButton>

                {!canControl && (
                    <span className="ml-auto text-xs text-text-muted self-center">
                        Request mode
                    </span>
                )}
            </div>

            {tab === 'search' ? (
                <YouTubeSearch onSelect={requestChangeVideo} disabled={false} />
            ) : (
                <YouTubeUrlInput onSelect={requestChangeVideo} disabled={false} />
            )}
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                    ? 'bg-brand text-white'
                    : 'bg-bg-soft text-text-muted hover:text-text'
            }`}
        >
            {children}
        </button>
    );
}