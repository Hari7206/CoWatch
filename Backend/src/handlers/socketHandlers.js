// Backend/src/handlers/socketHandlers.js

import roomManager from '../domain/roomManagerInstance.js';
import { SOCKET_EVENTS, ROLES } from '../constants.js';

export function registerSocketHandlers(io, socket) {
    // ---- join_room ----
    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, username }) => {
        try {
            const room = roomManager.get(roomId);
            if (!room) {
                return socket.emit(SOCKET_EVENTS.ERROR, 'Room not found');
            }

            if (socket.roomId && roomManager.get(socket.roomId)) {
                const oldRoom = roomManager.get(socket.roomId);
                oldRoom.removeParticipant(socket.userId);
                socket.leave(socket.roomId);
                oldRoom.participants.size === 0 && roomManager.deleteIfEmpty(socket.roomId);
            }

            room.addParticipant({
                id: socket.userId,
                username,
                socketId: socket.id,
            });

            socket.roomId = roomId;
            socket.join(roomId);

            socket.emit(SOCKET_EVENTS.SYNC_STATE, {
                ...room.snapshot(),
                you: { id: socket.userId, role: room.getParticipant(socket.userId).role },
            });

            socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
                userId: socket.userId,
                username,
                role: room.getParticipant(socket.userId).role,
                participants: room.participantsList(),
            });
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });

    // ---- leave_room ----
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
        handleLeave(io, socket);
    });

    // ---- disconnect ----
    socket.on('disconnect', () => {
        handleLeave(io, socket);
    });

    // ---- playback ----
    ['play', 'pause', 'seek', 'change_video'].forEach((action) => {
        socket.on(action, (payload = {}) => {
            handlePlayback(io, socket, action, payload);
        });
    });

    // ---- assign_role ----
    socket.on(SOCKET_EVENTS.ASSIGN_ROLE, ({ targetId, role }) => {
        try {
            const room = getRoomFor(socket);
            if (!room) return;

            room.assignRole(socket.userId, targetId, role);

            io.to(room.id).emit(SOCKET_EVENTS.ROLE_ASSIGNED, {
                userId: targetId,
                role,
                participants: room.participantsList(),
            });
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });

    // ---- remove_participant ----
    socket.on(SOCKET_EVENTS.REMOVE_PARTICIPANT, ({ targetId }) => {
        try {
            const room = getRoomFor(socket);
            if (!room) return;

            const removed = room.removeParticipantBy(socket.userId, targetId);

            if (removed.socketId) {
                const targetSocket = io.sockets.sockets.get(removed.socketId);
                if (targetSocket) {
                    targetSocket.emit(SOCKET_EVENTS.PARTICIPANT_REMOVED, {
                        reason: 'Removed by host',
                    });
                    targetSocket.leave(room.id);
                    targetSocket.roomId = null;
                }
            }

            io.to(room.id).emit(SOCKET_EVENTS.PARTICIPANT_REMOVED, {
                userId: targetId,
                participants: room.participantsList(),
            });
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });

    // ---- transfer_host ----
    socket.on(SOCKET_EVENTS.TRANSFER_HOST, ({ targetId }) => {
        try {
            const room = getRoomFor(socket);
            if (!room) return;

            room.transferHost(socket.userId, targetId);

            io.to(room.id).emit(SOCKET_EVENTS.HOST_TRANSFERRED, {
                newHostId: targetId,
                participants: room.participantsList(),
            });
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });

    // ---- send_message ----
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, ({ text }) => {
        try {
            const room = getRoomFor(socket);
            if (!room) return;

            const message = room.sendMessage(socket.userId, text);
            if (!message) return;

            io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, message);
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });

    // ---- request_action ----
    socket.on(SOCKET_EVENTS.REQUEST_ACTION, ({ action, payload }) => {
        try {
            const room = getRoomFor(socket);
            if (!room) return;

            const request = room.requestAction(socket.userId, action, payload);

            io.to(room.id).emit(SOCKET_EVENTS.REQUEST_CREATED, request);
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });

    // ---- resolve_request ----
    socket.on(SOCKET_EVENTS.RESOLVE_REQUEST, ({ requestId, decision }) => {
        try {
            const room = getRoomFor(socket);
            if (!room) return;

            const request = room.resolveRequest(socket.userId, requestId, decision);

            io.to(room.id).emit(SOCKET_EVENTS.REQUEST_RESOLVED, request);

            if (request.status === 'approved') {
                room.applyAction(socket.userId, request.action, request.payload);

                const snap = room.snapshot();
                io.to(room.id).emit(SOCKET_EVENTS.SYNC_STATE, {
                    roomId: room.id,
                    state: snap.state,
                });
            }
        } catch (err) {
            socket.emit(SOCKET_EVENTS.ERROR, err.message);
        }
    });
}

// ---- helpers ----

function getRoomFor(socket) {
    if (!socket.roomId) {
        socket.emit(SOCKET_EVENTS.ERROR, 'You are not in a room');
        return null;
    }
    const room = roomManager.get(socket.roomId);
    if (!room) {
        socket.emit(SOCKET_EVENTS.ERROR, 'Room no longer exists');
        return null;
    }
    return room;
}

function handlePlayback(io, socket, action, payload) {
    try {
        const room = getRoomFor(socket);
        if (!room) return;

        room.applyAction(socket.userId, action, payload);

        const snap = room.snapshot();
        io.to(room.id).emit(SOCKET_EVENTS.SYNC_STATE, {
            roomId: room.id,
            state: snap.state,
        });
    } catch (err) {
        socket.emit(SOCKET_EVENTS.ERROR, err.message);
    }
}

function handleLeave(io, socket) {
    const roomId = socket.roomId;
    if (!roomId) return;

    const room = roomManager.get(roomId);
    if (!room) {
        socket.roomId = null;
        return;
    }

    const participant = room.getParticipant(socket.userId);
    room.removeParticipant(socket.userId);
    socket.leave(roomId);
    socket.roomId = null;

    io.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
        userId: socket.userId,
        username: participant?.username,
        participants: room.participantsList(),
    });

    roomManager.deleteIfEmpty(roomId);
}