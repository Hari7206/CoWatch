export function extractVideoId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
}