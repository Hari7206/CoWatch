import { useEffect, useRef, useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../../auth/hooks/useAuth';
import { avatarColor, avatarInitial } from '../../../shared/lib/avatar';

export default function ChatPanel() {
    const { chat, sendMessage, resolveRequest, canControl } = useRoom();
    const { user } = useAuth();

    const [text, setText] = useState('');
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const listRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (shouldAutoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat, shouldAutoScroll]);

    function handleScroll() {
        const el = listRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        setShouldAutoScroll(atBottom);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        sendMessage(trimmed);
        setText('');
        setShouldAutoScroll(true);
    }

    return (
      <div className="rounded-xl bg-[#181818] border border-white/5 flex flex-col h-full min-h-0">

            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-white/60">
                        forum
                    </span>
                    <h2 className="font-display font-semibold text-base">Live Chat</h2>
                </div>
                <span className="text-xs text-white/40 font-mono">
                    {chat.length}
                </span>
            </div>

            {/* Messages */}
            <div
                ref={listRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
                {chat.length === 0 && (
                    <p className="text-sm text-white/40 text-center py-12">
                        No messages yet — say hi!
                    </p>
                )}

                {chat.map((msg) =>
                    msg.type === 'request' ? (
                        <RequestBubble
                            key={msg.id}
                            msg={msg}
                            canResolve={canControl}
                            isMe={msg.userId === user?.id}
                            onResolve={resolveRequest}
                        />
                    ) : (
                        <MessageBubble key={msg.id} msg={msg} isMe={msg.userId === user?.id} />
                    )
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-white/5 p-3 flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Send a message…"
                    maxLength={500}
                    className="flex-1 px-4 py-2.5 rounded-full bg-[#0f0f0f] border border-white/10 focus:outline-none focus:border-brand/60 transition-colors text-sm text-white placeholder:text-white/30"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-10 h-10 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors flex items-center justify-center disabled:opacity-40"
                >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
            </form>
        </div>
    );
}

function MessageBubble({ msg, isMe }) {
    return (
        <div className="flex gap-2.5">
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-xs flex-shrink-0"
                style={{ backgroundColor: avatarColor(msg.username) }}
            >
                {avatarInitial(msg.username)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className={`text-xs font-medium ${isMe ? 'text-brand' : 'text-white/80'}`}>
                        {msg.username}
                        {isMe && ' (you)'}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">
                        {formatTime(msg.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-white/90 break-words mt-0.5 leading-relaxed">
                    {msg.text}
                </p>
            </div>
        </div>
    );
}

function RequestBubble({ msg, canResolve, isMe, onResolve }) {
    const isPending = msg.status === 'pending';
    const isApproved = msg.status === 'approved';

    return (
        <div className="rounded-lg border border-brand/40 bg-brand/5 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-brand uppercase tracking-widest">
                    Request
                </span>
                <span className="text-[10px] text-white/30 font-mono">
                    {formatTime(msg.createdAt)}
                </span>
            </div>

            <p className="text-sm text-white/90 mt-1">
                <span className="font-medium">{msg.username}</span> wants to{' '}
                <span className="font-mono text-brand">{msg.action}</span>
            </p>

            {isPending && canResolve && (
                <div className="flex gap-2 mt-2.5">
                    <button
                        onClick={() => onResolve(msg.id, 'approved')}
                        className="flex-1 py-1.5 rounded-md bg-brand text-white hover:bg-brand-hover transition-colors text-xs font-medium"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onResolve(msg.id, 'denied')}
                        className="flex-1 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-medium"
                    >
                        Deny
                    </button>
                </div>
            )}

            {isPending && !canResolve && (
                <p className="text-xs text-white/40 mt-2">Waiting for host…</p>
            )}

            {!isPending && (
                <p className={`text-xs mt-2 font-medium ${isApproved ? 'text-green-400' : 'text-white/40'}`}>
                    {isApproved ? 'Approved' : 'Denied'}
                </p>
            )}
        </div>
    );
}

function formatTime(ts) {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}