import {ROLES , PERMISSIONS} from '../constants.js';

class Participant {
    constructor({id, username, role = ROLES.PARTICIPANT , socketId}) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.socketId = socketId;
    }

    can(action) {
        const allowed = PERMISSIONS[this.role] || [];
        return allowed.includes(action);
    }


    setRole(role) {
        this.role = role;
    }

     toJSON() {
        return {
            id: this.id,
            username: this.username,
            role: this.role,
        };
    }
}
export default Participant;