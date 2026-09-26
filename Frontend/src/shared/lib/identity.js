
const TOKEN_KEY = 'cowatch_token';
const USER_KEY = 'cowatch_user';
const GUEST_KEY = 'cowatch_is_guest';



export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}


export function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
}


export function isGuest() {
    return localStorage.getItem(GUEST_KEY) === 'true';
}

export function setGuest(value) {
    localStorage.setItem(GUEST_KEY, value ? 'true' : 'false');
}


export function saveSession({ token, user, guest = false }) {
    setToken(token);
    setUser(user);
    setGuest(guest);
}

export function clearSession() {
    clearToken();
    clearUser();
    localStorage.removeItem(GUEST_KEY);
}

export function isTokenExpired() {
    const token = getToken();
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        return payload.exp < now;
    } catch {
        return true;
    }
}