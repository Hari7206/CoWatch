const SplitPanel = ({ side, title, subtitle, ctaLabel, ctaTo, altText, altTo, onNavigate }) => {
    const isLeft = side === 'left';

    return (
        <div
            className={`flex-1 flex flex-col justify-center items-center px-8 py-20 text-center relative ${
                isLeft ? 'bg-brand-soft' : 'bg-bg-soft'
            }`}
        >
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 max-w-sm">
                {title}
            </h2>

            <p className="text-text-muted mb-12 max-w-xs leading-relaxed">
                {subtitle}
            </p>

            <div className="w-32 h-32 rounded-full bg-surface border border-border flex items-center justify-center mb-12">
                <span className="font-display font-bold text-2xl text-brand">
                    {isLeft ? 'Host' : 'Join'}
                </span>
            </div>

            <button
                onClick={() => onNavigate(ctaTo)}
                className="px-10 py-4 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors font-medium mb-6"
            >
                {ctaLabel}
            </button>

            <button
                onClick={() => onNavigate(altTo)}
                className="text-sm text-text-muted hover:text-text underline underline-offset-4 transition-colors"
            >
                {altText}
            </button>
        </div>
    );
};

export default SplitPanel;