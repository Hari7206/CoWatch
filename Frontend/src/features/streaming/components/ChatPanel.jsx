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
        <div className="rounded-2xl bg-surface border border-border flex flex-col h-[420px]">
            <div className="px-4 py-3 border-b border-border">
                <h2 className="font-display font-semibold text-lg">Chat</h2>
            </div>

            <div
                ref={listRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
                {chat.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-8">
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

            <form
                onSubmit={handleSubmit}
                className="border-t border-border p-3 flex gap-2"
            >
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message…"
                    maxLength={500}
                    className="flex-1 px-4 py-2 rounded-lg bg-bg border border-border focus:outline-none focus:border-brand transition-colors text-sm"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors font-medium text-sm disabled:opacity-60"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

function MessageBubble({ msg, isMe }) {
    return (
        <div className="flex gap-2">
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-xs flex-shrink-0"
                style={{ backgroundColor: avatarColor(msg.username) }}
            >
                {avatarInitial(msg.username)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className={`text-xs font-medium ${isMe ? 'text-brand' : 'text-text'}`}>
                        {msg.username}
                        {isMe && ' (you)'}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                        {formatTime(msg.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-text break-words mt-0.5">{msg.text}</p>
            </div>
        </div>
    );
}

function RequestBubble({ msg, canResolve, isMe, onResolve }) {
    const isPending = msg.status === 'pending';
    const isApproved = msg.status === 'approved';

    return (
        <div className="rounded-lg border border-brand/30 bg-brand-soft/40 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-brand uppercase tracking-widest">
                    Request
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                    {formatTime(msg.createdAt)}
                </span>
            </div>

            <p className="text-sm text-text mt-1">
                <span className="font-medium">{msg.username}</span> wants to{' '}
                <span className="font-mono text-brand">{msg.action}</span>
            </p>

            {isPending && canResolve && (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onResolve(msg.id, 'approved')}
                        className="flex-1 py-1.5 rounded-md bg-brand text-white hover:bg-brand-hover transition-colors text-xs font-medium"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onResolve(msg.id, 'denied')}
                        className="flex-1 py-1.5 rounded-md bg-bg border border-border hover:bg-bg-soft transition-colors text-xs font-medium"
                    >
                        Deny
                    </button>
                </div>
            )}

            {isPending && !canResolve && (
                <p className="text-xs text-text-muted mt-2">Waiting for host…</p>
            )}

            {!isPending && (
                <p className={`text-xs mt-2 font-medium ${isApproved ? 'text-green-600' : 'text-text-muted'}`}>
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