import { useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import { extractVideoId } from '../lib/youtube';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function VideoPicker() {
    const { requestChangeVideo, canControl } = useRoom();

    return (
        <div className="rounded-xl bg-[#181818] border border-white/5 p-3 grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* LEFT — Search by title */}
            <SearchByTitle onSelect={requestChangeVideo} />

            {/* RIGHT — Search by link */}
            <SearchByLink onSelect={requestChangeVideo} />
        </div>
    );
}

function SearchByTitle({ onSelect }) {
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
                    setError('Quota reached. Use the link tab.');
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
        <div className="flex flex-col gap-2 min-w-0">
            <form onSubmit={search} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title…"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/10 focus:outline-none focus:border-brand/60 transition-colors text-sm text-white placeholder:text-white/30"
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors text-sm font-medium disabled:opacity-50"
                >
                    {loading ? '…' : 'Search'}
                </button>
            </form>

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            {/* Results — scrollable */}
            <div className="max-h-[160px] overflow-y-auto rounded-lg border border-white/5 divide-y divide-white/5">
                {results.length === 0 && !loading && (
                    <p className="text-xs text-white/30 text-center py-3">
                        Search results will appear here
                    </p>
                )}
                {results.map((item) => (
                    <button
                        key={item.id.videoId}
                        type="button"
                        onClick={() => onSelect(item.id.videoId)}
                        className="w-full flex gap-2 p-2 text-left hover:bg-white/5 transition-colors"
                    >
                        <img
                            src={item.snippet.thumbnails.default.url}
                            alt=""
                            className="w-16 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-xs font-medium line-clamp-2 text-white/90">
                                {item.snippet.title}
                            </p>
                            <p className="text-[10px] text-white/40 mt-0.5 truncate">
                                {item.snippet.channelTitle}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function SearchByLink({ onSelect }) {
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
        <div className="flex flex-col gap-2 min-w-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setError('');
                    }}
                    placeholder="Paste a YouTube URL…"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/10 focus:outline-none focus:border-brand/60 transition-colors text-sm text-white placeholder:text-white/30"
                />
                <button
                    type="submit"
                    disabled={!url.trim()}
                    className="px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors text-sm font-medium disabled:opacity-50"
                >
                    Load
                </button>
            </form>

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="flex-1 rounded-lg border border-white/5 flex items-center justify-center p-3 min-h-[160px]">
                <div className="text-center">
                    <span className="material-symbols-outlined text-[24px] text-white/20">
                        link
                    </span>
                    <p className="text-xs text-white/30 mt-1">
                        Paste any YouTube link to load it
                    </p>
                </div>
            </div>
        </div>
    );
}