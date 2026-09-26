import { useState } from 'react';
import YouTubeUrlInput from './YouTubeUrlInput';
import YouTubeSearch from './YouTubeSearch';

export default function VideoPicker({ onSelect, disabled }) {
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

                {disabled && (
                    <span className="ml-auto text-xs text-text-muted self-center">
                        Only the host can change videos
                    </span>
                )}
            </div>

            {tab === 'search' ? (
                <YouTubeSearch onSelect={onSelect} disabled={disabled} />
            ) : (
                <YouTubeUrlInput onSelect={onSelect} disabled={disabled} />
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