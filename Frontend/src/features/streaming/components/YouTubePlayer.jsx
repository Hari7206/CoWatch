import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

function syncPlayback(player, currentTimeRef, playingRef) {
    if (!player) return;

    const targetTime = currentTimeRef.current;
    if (targetTime !== undefined && targetTime !== null) {
        const current = player.getCurrentTime?.() || 0;
        if (Math.abs(current - targetTime) > 1.5) {
            player.seekTo(targetTime, true);
        }
    }

    if (playingRef.current) {
        player.playVideo();
    } else {
        player.pauseVideo();
    }
}

const YouTubePlayer = forwardRef(function YouTubePlayer(
    { videoId, playing, currentTime, canControl, onTimeUpdate },
    ref
) {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const suppressRef = useRef(false);
    const loadedVideoIdRef = useRef(null);
    const currentTimeRef = useRef(currentTime);
    const playingRef = useRef(playing);
    const [ready, setReady] = useState(false);

    currentTimeRef.current = currentTime;
    playingRef.current = playing;

    useEffect(() => {
        function init() {
            if (!containerRef.current || playerRef.current) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '100%',
                width: '100%',
                videoId: '',
                playerVars: {
                    controls: 0,
                    disablekb: 1,
                    modestbranding: 1,
                    rel: 0,
                    fs: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                },
                events: {
                    onReady: () => setReady(true),
                    onStateChange: (event) => {
                        const state = event.data;
                        const playerState = window.YT.PlayerState;

                        if (state === playerState.CUED) {
                            suppressRef.current = true;
                            syncPlayback(event.target, currentTimeRef, playingRef);
                        } else if (state === playerState.PLAYING && !playingRef.current) {
                            suppressRef.current = true;
                            event.target.pauseVideo();
                        } else if (state === playerState.PAUSED && playingRef.current) {
                            suppressRef.current = true;
                            event.target.playVideo();
                        }
                    },
                },
            });
        }

        if (window.YT && window.YT.Player) {
            init();
        } else {
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof prev === 'function') prev();
                init();
            };
        }

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (error) {
                    console.error('[player] destroy failed:', error);
                }
                playerRef.current = null;
            }
        };
    }, []);

  useEffect(() => {
    if (!ready || !playerRef.current || !videoId) return;
    if (loadedVideoIdRef.current === videoId) return;

    console.log('[player] cueVideoById:', { videoId });
    loadedVideoIdRef.current = videoId;
    suppressRef.current = true;
    playerRef.current.cueVideoById({ videoId });
}, [videoId, ready]);

    useEffect(() => {
        if (!ready || !playerRef.current) return;
        const player = playerRef.current;
        const ytState = player.getPlayerState?.();

        if (playing) {
            if (
                ytState === window.YT.PlayerState.PAUSED ||
                ytState === window.YT.PlayerState.CUED ||
                ytState === window.YT.PlayerState.ENDED
            ) {
                suppressRef.current = true;
                player.playVideo();
            }
        } else {
            if (
                ytState === window.YT.PlayerState.PLAYING ||
                ytState === window.YT.PlayerState.BUFFERING
            ) {
                suppressRef.current = true;
                player.pauseVideo();
            }
        }
    }, [playing, ready]);

  useEffect(() => {
    if (!ready || !playerRef.current) return;
    if (currentTime === undefined || currentTime === null) return;

    if (loadedVideoIdRef.current !== videoId) return;

    suppressRef.current = true;
    syncPlayback(playerRef.current, currentTimeRef, playingRef);
}, [currentTime, ready, videoId]);

    useEffect(() => {
        if (!ready || !onTimeUpdate) return;
        const id = setInterval(() => {
            if (playerRef.current?.getCurrentTime) {
                onTimeUpdate(playerRef.current.getCurrentTime());
            }
        }, 500);
        return () => clearInterval(id);
    }, [ready, onTimeUpdate]);

    useImperativeHandle(ref, () => ({
        play() {
            if (!playerRef.current) return;
            suppressRef.current = true;
            playerRef.current.playVideo();
        },
        pause() {
            if (!playerRef.current) return;
            suppressRef.current = true;
            playerRef.current.pauseVideo();
        },
        seek(time) {
            if (!playerRef.current) return;
            suppressRef.current = true;
            playerRef.current.seekTo(time, true);
        },
        getCurrentTime() {
            console.log('[YouTubePlayer] getCurrentTime called');
            return playerRef.current?.getCurrentTime?.() || 0;
        },
        getDuration() {
            return playerRef.current?.getDuration?.() || 0;
        },
    }));

    return (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
            <div ref={containerRef} className="w-full h-full" />
            <div
                className="absolute inset-0 z-10 cursor-default"
                title={canControl ? 'Use the controls below' : 'Host controls playback'}
            />
        </div>
    );
});

export default YouTubePlayer;