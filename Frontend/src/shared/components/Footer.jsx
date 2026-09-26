import { Link } from 'react-router-dom';

const links = {
    github: 'https://github.com/Hari7206',
    linkedin: 'https://www.linkedin.com/in/hari-thapa-67827835b/',
    instagram: 'https://www.instagram.com/heaariii',
    email: 'harithapa4654@gmail.com',
};

export function Footer() {
    return (
        <footer className="border-t border-border bg-bg">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <Link
                            to="/"
                            className="font-display font-bold text-2xl tracking-tight"
                        >
                            Co<span className="text-brand">Watch</span>
                        </Link>
                        <p className="text-sm text-text-muted mt-4 max-w-xs leading-relaxed">
                            Watch YouTube together, in perfect sync. No account
                            needed — just share a code and press play.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-4">
                            Product
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/start" className="hover:text-brand transition-colors">
                                    Start a room
                                </Link>
                            </li>
                            <li>
                                <Link to="/join" className="hover:text-brand transition-colors">
                                    Join with code
                                </Link>
                            </li>
                            <li>
                                <Link to="/guest" className="hover:text-brand transition-colors">
                                    Continue as guest
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-4">
                            Connect
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href={links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-brand transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href={links.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-brand transition-colors"
                                >
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a
                                    href={links.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-brand transition-colors"
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${links.email}`}
                                    className="hover:text-brand transition-colors font-mono text-xs"
                                >
                                    {links.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-text-muted">
                    <span>© {new Date().getFullYear()} CoWatch — Built by Hari Thapa</span>
                    <span className="font-mono">Made with React · Node · Socket.IO</span>
                </div>
            </div>
        </footer>
    );
}