import { useState } from 'react';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function YouTubeSearch({ onSelect, disabled }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function search(e) {
        e?.preventDefault();
        const q = query.trim();
        if (!q) return;

        setLoading(true);
        setError('');

        try {
            const url =
                `https://www.googleapis.com/youtube/v3/search` +
                `?part=snippet&type=video&maxResults=10` +
                `&q=${encodeURIComponent(q)}` +
                `&key=${API_KEY}`;

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok) {
                if (data?.error?.errors?.[0]?.reason === 'quotaExceeded') {
                    setError('Daily search quota reached. Use the URL tab instead.');
                } else {
                    setError(data?.error?.message || 'Search failed');
                }
                setResults([]);
                return;
            }

            setResults(data.items || []);
        } catch (err) {
            setError('Search failed');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-3">
            <form onSubmit={search} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search YouTube…"
                    disabled={disabled}
                    className="flex-1 px-4 py-3 rounded-xl bg-bg border border-border focus:outline-none focus:border-brand transition-colors disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={disabled || loading || !query.trim()}
                    className="px-5 py-3 rounded-xl bg-brand text-white hover:bg-brand-hover transition-colors font-medium disabled:opacity-60"
                >
                    {loading ? '…' : 'Search'}
                </button>
            </form>

            {error && (
                <p className="text-sm text-brand">{error}</p>
            )}

            {results.length > 0 && (
                <ul className="max-h-80 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                    {results.map((item) => (
                        <li key={item.id.videoId}>
                            <button
                                type="button"
                                onClick={() => onSelect(item.id.videoId)}
                                disabled={disabled}
                                className="w-full flex gap-3 p-3 text-left hover:bg-bg-soft transition-colors disabled:opacity-60"
                            >
                                <img
                                    src={item.snippet.thumbnails.default.url}
                                    alt=""
                                    className="w-24 h-14 rounded object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium line-clamp-2">
                                        {item.snippet.title}
                                    </p>
                                    <p className="text-xs text-text-muted mt-1">
                                        {item.snippet.channelTitle}
                                    </p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}