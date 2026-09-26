import { useState } from 'react';
import { extractVideoId } from '../lib/youtube';

export default function YouTubeUrlInput({ onSelect, disabled }) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const id = extractVideoId(url.trim());
        if (!id) {
            setError('That doesn\u2019t look like a YouTube URL');
            return;
        }
        setError('');
        setUrl('');
        onSelect(id);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setError('');
                    }}
                    placeholder="Paste a YouTube URL…"
                    disabled={disabled}
                    className="flex-1 px-4 py-3 rounded-xl bg-bg border border-border focus:outline-none focus:border-brand transition-colors disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={disabled || !url.trim()}
                    className="px-5 py-3 rounded-xl bg-brand text-white hover:bg-brand-hover transition-colors font-medium disabled:opacity-60"
                >
                    Load
                </button>
            </div>

            {error && (
                <p className="text-sm text-brand">{error}</p>
            )}
        </form>
    );
}