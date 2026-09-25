
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 6;

export const ROLES = {
    HOST: "host",
    MODERATOR: "moderator",
    PARTICIPANT: "participant"
}


export const PERMISSIONS  = {
   [ROLES.HOST]: [
    'play',
    'pause',
    'seek',
    'change_video',
    'assign_role',
    'remove_participant',
    'transfer_host',
  ],
    [ROLES.MODERATOR]: [
    'play',
    'pause',
    'seek',
    'change_video',
  ],
    [ROLES.PARTICIPANT]: []
}


export const SOCKET_EVENTS = {
    JOIN_ROOM: "join_room",
    LEAVE_ROOM: 'leave_room',
    PLAY: 'play',
    PAUSE: 'pause',
    SEEK: 'seek',
    CHANGE_VIDEO: 'change_video',
    ASSIGN_ROLE: 'assign_role',
    REMOVE_PARTICIPANT: 'remove_participant',
    TRANSFER_HOST: 'transfer_host',
    REQUEST_ACTION: 'request_action',

    SYNC_STATE: 'sync_state',
    USER_JOINED: 'user_joined',
    USER_LEFT: 'user_left',
    ROLE_ASSIGNED: 'role_assigned',
    PARTICIPANT_REMOVED: 'participant_removed',
    HOST_TRANSFERRED: 'host_transferred',
    ERROR: 'error',
}