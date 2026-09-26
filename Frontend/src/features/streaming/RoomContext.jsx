import { createContext, useEffect, useRef, useState } from 'react';
import { createSocket } from './services/socket';
import { useAuth } from '../auth/hooks/useAuth';

export const RoomContext = createContext(null);

export function RoomContextProvider({ roomId, children }) {
    const { user } = useAuth();

    const socketRef = useRef(null);
    const playerRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [playback, setPlayback] = useState({
        videoId: null,
        playing: false,
        currentTime: 0,
    });
    const [myRole, setMyRole] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem('cowatch_token');
        if (!token) return;

        const socket = createSocket(token);
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join_room', { roomId, username: user.username });
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('sync_state', (data) => {
            console.log('[RoomContext] sync_state received:', {
                currentTime: data.state?.currentTime,
                playing: data.state?.playing,
                videoId: data.state?.videoId,
                hasYou: !!data.you,
            });
            if (data.participants) setParticipants(data.participants);
            if (data.state) setPlayback(data.state);
            if (data.you) setMyRole(data.you.role);
        });

        socket.on('user_joined', (data) => setParticipants(data.participants));
        socket.on('user_left', (data) => setParticipants(data.participants));

        socket.on('role_assigned', (data) => {
            setParticipants(data.participants);
            if (data.userId === user.id) setMyRole(data.role);
        });

        socket.on('participant_removed', (data) => {
            if (data.reason) {
                setError('You were removed from the room');
            } else {
                setParticipants(data.participants);
            }
        });

        socket.on('error', (msg) => setError(msg));
        socket.on('connect_error', (err) =>
            setError(`Connection failed: ${err.message}`)
        );

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomId, user]);

    function play() {
        const time = playerRef.current?.getCurrentTime?.() || 0;
        socketRef.current?.emit('play', { time });
    }
    function pause() {
        const time = playerRef.current?.getCurrentTime?.() || 0;
        socketRef.current?.emit('pause', { time });
    }
    function seek(time) {
        socketRef.current?.emit('seek', { time });
    }

    function changeVideo(videoId) {
        socketRef.current?.emit('change_video', { videoId });
    }

    function assignRole(targetId, role) {
        socketRef.current?.emit('assign_role', { targetId, role });
    }

    function removeParticipant(targetId) {
        socketRef.current?.emit('remove_participant', { targetId });
    }

    function transferHost(targetId) {
        socketRef.current?.emit('transfer_host', { targetId });
    }

    const canControl = myRole === 'host' || myRole === 'moderator';
    const isHost = myRole === 'host';

    return (
        <RoomContext.Provider
            value={{
                roomId,
                connected,
                participants,
                playback,
                myRole,
                error,
                canControl,
                isHost,
                playerRef,
                play,
                pause,
                seek,
                changeVideo,
                assignRole,
                removeParticipant,
                transferHost,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}