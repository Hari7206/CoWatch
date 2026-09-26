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
    const [chat, setChat] = useState([]);
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
            if (data.participants) setParticipants(data.participants);
            if (data.chat) setChat(data.chat);
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

        socket.on('chat_message', (message) => {
            setChat((prev) => [...prev, message]);
        });

        socket.on('request_created', (request) => {
            setChat((prev) => [...prev, request]);
        });

        socket.on('request_resolved', (resolved) => {
            setChat((prev) =>
                prev.map((m) => (m.id === resolved.id ? resolved : m))
            );
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

    function sendMessage(text) {
        socketRef.current?.emit('send_message', { text });
    }

    function requestAction(action, payload = {}) {
        socketRef.current?.emit('request_action', { action, payload });
    }

    function resolveRequest(requestId, decision) {
        socketRef.current?.emit('resolve_request', { requestId, decision });
    }

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

    const canControl = myRole === 'host' || myRole === 'moderator'

    function requestPlay() {
        if (canControl) play();
        else requestAction('play', {});
    }

    function requestPause() {
        if (canControl) pause();
        else requestAction('pause', {});
    }

    function requestSeek(time) {
        if (canControl) seek(time);
        else requestAction('seek', { time });
    }

    function requestChangeVideo(videoId) {
        if (canControl) changeVideo(videoId);
        else requestAction('change_video', { videoId });
    }
    const isHost = myRole === 'host';

    return (
        <RoomContext.Provider
            value={{
                roomId,
                connected,
                participants,
                chat,
                playback,
                myRole,
                error,
                canControl,
                isHost,
                playerRef,
                sendMessage,
                requestAction,
                resolveRequest,
                play,
                pause,
                seek,
                changeVideo,
                assignRole,
                removeParticipant,
                transferHost,
                requestPlay,          // ← ADD
                requestPause,         // ← ADD
                requestSeek,          // ← ADD
                requestChangeVideo,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}