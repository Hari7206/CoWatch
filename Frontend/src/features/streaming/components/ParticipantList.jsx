import { useEffect, useRef, useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../../auth/hooks/useAuth';
import { avatarColor, avatarInitial } from '../../../shared/lib/avatar';

export default function ParticipantList() {
    const { participants, isHost, myRole } = useRoom();
    const { user } = useAuth();

    return (
        <div className="rounded-2xl bg-surface border border-border p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg">
                    Participants
                </h2>
                <span className="text-xs text-text-muted font-mono">
                    {participants.length}
                </span>
            </div>

            <ul className="space-y-1">
                {participants.map((p) => (
                    <ParticipantRow
                        key={p.id}
                        participant={p}
                        isMe={p.id === user?.id}
                        canManage={isHost && p.id !== user?.id}
                    />
                ))}
            </ul>

            {myRole && (
                <div className="mt-4 pt-4 border-t border-border text-xs text-text-muted flex items-center justify-between">
                    <span>Your role</span>
                    <span className="font-mono uppercase tracking-widest text-brand">
                        {myRole}
                    </span>
                </div>
            )}
        </div>
    );
}

function ParticipantRow({ participant, isMe, canManage }) {
    const { assignRole, removeParticipant, transferHost } = useRoom();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initial = avatarInitial(participant.username);
    const color = avatarColor(participant.username);

    function act(fn) {
        return () => {
            fn(participant.id);
            setOpen(false);
        };
    }

    return (
        <li
            ref={ref}
            className={`relative flex items-center gap-3 px-2 py-2 rounded-lg ${
                isMe ? 'bg-bg-soft' : ''
            }`}
        >
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: color }}
            >
                {initial}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {participant.username}
                    {isMe && <span className="text-text-muted font-normal"> (you)</span>}
                </p>
                <p className="text-xs text-text-muted uppercase tracking-widest">
                    {participant.role}
                </p>
            </div>

            {canManage && (
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-bg-soft transition-colors text-text-muted"
                    aria-label="Manage participant"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                    </svg>
                </button>
            )}

            {open && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-surface border border-border shadow-lg py-1 z-20">
                    {participant.role === 'participant' && (
                        <MenuItem
                            onClick={() => {
                                assignRole(participant.id, 'moderator');
                                setOpen(false);
                            }}
                        >
                            Make moderator
                        </MenuItem>
                    )}
                    {participant.role === 'moderator' && (
                        <MenuItem
                            onClick={() => {
                                assignRole(participant.id, 'participant');
                                setOpen(false);
                            }}
                        >
                            Remove moderator
                        </MenuItem>
                    )}

                    <MenuItem onClick={act(transferHost)}>
                        Transfer host
                    </MenuItem>

                    <div className="my-1 border-t border-border" />

                    <MenuItem onClick={act(removeParticipant)} variant="danger">
                        Remove from room
                    </MenuItem>
                </div>
            )}
        </li>
    );
}

function MenuItem({ onClick, variant, children }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-bg-soft transition-colors ${
                variant === 'danger' ? 'text-brand' : ''
            }`}
        >
            {children}
        </button>
    );
}