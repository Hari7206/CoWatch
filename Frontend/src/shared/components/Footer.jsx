export function Footer() {
    return (
        <footer className="border-t border-border bg-bg">
            <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-text-muted">
                <span>CoWatch © {new Date().getFullYear()}</span>
                <span className="font-mono">Built with Socket.IO</span>
            </div>
        </footer>
    );
}