import Room from './Room.js';


const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_LENGTH = 6;

function generateRoomCode() {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        const idx = Math.floor(Math.random() * CODE_ALPHABET.length);
        code += CODE_ALPHABET[idx];
    }
    return code;
}


class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    create(hostId) {
        let id

        do {
            id = generateRoomCode();
        } while (this.rooms.has(id));

        const room = new Room({ id, hostId });
        this.rooms.set(id, room);
        return room;
    }

      get(id) {
        return this.rooms.get(id);
    }

     has(id) {
        return this.rooms.has(id);
    }

    deleteIfEmpty(id) {
        const room = this.rooms.get(id);
        if (room && room.participants.size === 0) {
            this.rooms.delete(id);
            return true;
        }
        return false;
    }

    count() {
        return this.rooms.size;
    }
}
export default RoomManager;