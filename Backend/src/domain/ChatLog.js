import crypto from 'crypto';

const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 200;

class ChatLog {
    constructor() {
        this.messages = [];
    }

    addMessage({ userId, username, text }) {
        const trimmed = String(text || '').trim().slice(0, MAX_MESSAGE_LENGTH);
        if (!trimmed) return null;

        const message = {
            id: crypto.randomUUID(),
            type: 'message',
            userId,
            username,
            text: trimmed,
            createdAt: Date.now(),
        };

        this.messages.push(message);
        this.enforceLimit();
        return message;
    }

    addRequest({ userId, username, action, payload }) {
        const message = {
            id: crypto.randomUUID(),
            type: 'request',
            userId,
            username,
            text: '',
            action,
            payload: payload || {},
            status: 'pending',
            createdAt: Date.now(),
        };

        this.messages.push(message);
        this.enforceLimit();
        return message;
    }

    resolveRequest(requestId, decision) {
        const request = this.messages.find((m) => m.id === requestId);
        if (!request || request.type !== 'request') return null;
        if (request.status !== 'pending') return request;

        request.status = decision === 'approved' ? 'approved' : 'denied';
        request.resolvedAt = Date.now();
        return request;
    }

    getRequest(requestId) {
        return this.messages.find((m) => m.id === requestId) || null;
    }

    list() {
        return [...this.messages];
    }

    enforceLimit() {
        if (this.messages.length > MAX_MESSAGES) {
            this.messages = this.messages.slice(-MAX_MESSAGES);
        }
    }
}

export default ChatLog;