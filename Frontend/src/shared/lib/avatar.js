const COLORS = [
    '#DC2626',     
    '#EA580C', 
    '#D97706', 
    '#65A30D', 
    '#059669', 
    '#0891B2', 
    '#2563EB', 
    '#7C3AED', 
    '#C026D3', 
    '#DB2777', 
];

export function avatarColor(username) {
    if (!username) return COLORS[0];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
}

export function avatarInitial(username) {
    if (!username) return '?';
    return username[0].toUpperCase();
}