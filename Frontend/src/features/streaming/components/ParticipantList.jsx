import { useEffect, useRef, useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../../auth/hooks/useAuth';
import { avatarColor, avatarInitial } from '../../../shared/lib/avatar';

export default function ParticipantList() {
    const { participants, isHost, myRole } = useRoom();
    const { user } = useAuth();

    return (
        <div className="rounded-xl bg-[#181818] border border-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-white/60">
                        group
                    </span>
                    <h2 className="font-display font-semibold text-base">
                        Participants
                    </h2>
                </div>
                <span className="text-xs text-white/40 font-mono">
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
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-white/40 flex items-center justify-between">
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

    const roleColor = {
        host: 'bg-brand text-white',
        moderator: 'bg-blue-500/20 text-blue-400',
        participant: 'bg-white/5 text-white/50',
    }[participant.role];

    return (
        <li
            ref={ref}
            className={`relative flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                isMe ? 'bg-white/5' : 'hover:bg-white/5'
            }`}
        >
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: color }}
            >
                {initial}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white/90">
                    {participant.username}
                    {isMe && <span className="text-white/40 font-normal"> (you)</span>}
                </p>
            </div>

            <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${roleColor}`}>
                {participant.role}
            </span>

            {canManage && (
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/40"
                    aria-label="Manage participant"
                >
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
            )}

            {open && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#1e1e1e] border border-white/10 shadow-xl py-1 z-20">
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

                    <div className="my-1 border-t border-white/10" />

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
            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                variant === 'danger' ? 'text-brand' : 'text-white/90'
            }`}
        >
            {children}
        </button>
    );
}