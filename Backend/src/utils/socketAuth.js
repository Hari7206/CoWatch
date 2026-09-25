import { verifyToken } from './jwt.js';

export function socketAuth(socket, next) {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('No token provided'));
        }

        const decoded = verifyToken(token);
        socket.userId = decoded.userId;
        next();
    } catch (err) {
        next(new Error('Invalid or expired token'));
    }
}