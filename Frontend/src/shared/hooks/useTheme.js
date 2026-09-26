import { useEffect, useState } from 'react';

const THEME_KEY = 'cowatch_theme';

function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    function toggle() {
        setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    }

    return { theme, toggle, setTheme };
}