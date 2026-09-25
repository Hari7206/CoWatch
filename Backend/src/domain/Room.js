// Backend/src/domain/Room.js

import Participant from './Participant.js';
import { ROLES } from '../constants.js';

class Room {
    constructor({ id, hostId }) {
        this.id = id;
        this.hostId = hostId;
        this.participants = new Map();
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
                break;
            case 'pause':
                this.state.playing = false;
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

    snapshot() {
        return {
            roomId: this.id,
            hostId: this.hostId,
            participants: this.participantsList(),
            state: this.state,
        };
    }
}

export default Room;