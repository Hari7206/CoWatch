
import Participant from './Participant.js';
import ChatLog from './ChatLog.js';
import { ROLES } from '../constants.js';

class Room {
    constructor({ id, hostId }) {
        this.id = id;
        this.hostId = hostId;
        this.participants = new Map();
        this.chat = new ChatLog();
        this.state = {
            videoId: null,
            playing: false,
            currentTime: 0,
            updatedAt: Date.now(),
        };
    }
    addParticipant({ id, username, socketId, role }) {
        const participant = new Participant({
            id,
            username,
            socketId,
            role: role || (id === this.hostId ? ROLES.HOST : ROLES.PARTICIPANT),
        });
        this.participants.set(id, participant);
        return participant;
    }

    removeParticipant(id) {
        this.participants.delete(id);
        if (id === this.hostId && this.participants.size > 0) {
            const nextId = this.participants.keys().next().value;
            this.transferHost(this.hostId, nextId);
        }
    }

    getParticipant(id) {
        return this.participants.get(id);
    }

    hasParticipant(id) {
        return this.participants.has(id);
    }



    applyAction(actorId, action, payload = {}) {
        const actor = this.participants.get(actorId);

        if (!actor) {
            throw new Error('You are not in this room');
        }

        if (!actor.can(action)) {
            throw new Error('You do not have permission to do this');
        }

        switch (action) {
            case 'play':
                this.state.playing = true;
                if (payload.time !== undefined) {
                    this.state.currentTime = payload.time;
                }
                break;
            case 'pause':
                this.state.playing = false;
                if (payload.time !== undefined) {
                    this.state.currentTime = payload.time;
                }
                break;
            case 'seek':
                this.state.currentTime = payload.time;
                break;
            case 'change_video':
                this.state.videoId = payload.videoId;
                this.state.currentTime = 0;
                this.state.playing = false;
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        this.state.updatedAt = Date.now();
        return this.state;
    }

    assignRole(actorId, targetId, role) {
        if (actorId !== this.hostId) {
            throw new Error('Only the host can assign roles');
        }
        const target = this.participants.get(targetId);
        if (!target) {
            throw new Error('Participant not found');
        }
        target.setRole(role);
        return target;
    }

    transferHost(actorId, targetId) {
        if (actorId !== this.hostId) {
            throw new Error('Only the host can transfer host');
        }
        const target = this.participants.get(targetId);
        if (!target) {
            throw new Error('Participant not found');
        }
        const currentHost = this.participants.get(this.hostId);
        if (currentHost) currentHost.setRole(ROLES.PARTICIPANT);

        this.hostId = targetId;
        target.setRole(ROLES.HOST);
        return target;
    }

    removeParticipantBy(actorId, targetId) {
        if (actorId !== this.hostId) {
            throw new Error('Only the host can remove participants');
        }
        if (actorId === targetId) {
            throw new Error('Host cannot remove themselves');
        }
        const target = this.participants.get(targetId);
        if (!target) {
            throw new Error('Participant not found');
        }
        this.participants.delete(targetId);
        return target;
    }

    participantsList() {
        return [...this.participants.values()].map((p) => p.toJSON());
    }

    sendMessage(actorId, text) {
        const actor = this.participants.get(actorId);
        if (!actor) throw new Error('You are not in this room');
        return this.chat.addMessage({
            userId: actorId,
            username: actor.username,
            text,
        });
    }

    requestAction(actorId, action, payload) {
        const actor = this.participants.get(actorId);
        if (!actor) throw new Error('You are not in this room');
        if (actor.role !== ROLES.PARTICIPANT) {
            throw new Error('Only participants need to request approval');
        }
        return this.chat.addRequest({
            userId: actorId,
            username: actor.username,
            action,
            payload,
        });
    }

    resolveRequest(actorId, requestId, decision) {
        const actor = this.participants.get(actorId);
        if (!actor) throw new Error('You are not in this room');
        if (actor.role !== ROLES.HOST && actor.role !== ROLES.MODERATOR) {
            throw new Error('Only host or moderator can resolve requests');
        }

        const request = this.chat.getRequest(requestId);
        if (!request) throw new Error('Request not found');

        return this.chat.resolveRequest(requestId, decision);
    }

   currentPlaybackTime() {
    if (!this.state.playing) return this.state.currentTime;
    const elapsed = (Date.now() - this.state.updatedAt) / 1000;
    return this.state.currentTime + elapsed;
}


    snapshot() {
        return {
            roomId: this.id,
            hostId: this.hostId,
            participants: this.participantsList(),
            chat: this.chat.list(),
            state: {
                ...this.state,
                currentTime: this.currentPlaybackTime(),
            },
        };
    }
}

export default Room;