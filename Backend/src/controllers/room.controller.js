


import roomManager from '../domain/roomManagerInstance.js';

export async function createRoom(req, res) {
    try {
        const hostId = req.userId;

        const room = roomManager.create(hostId);

        return res.status(201).json({
            roomId: room.id,
            hostId: room.hostId,
        });
    } catch (error) {
        console.error('Error creating room:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}