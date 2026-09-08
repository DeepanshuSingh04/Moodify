import React, { useRef, useState, useEffect } from 'react'
import { useSong } from '../hooks/useSong'
import { getMoodMeta } from './moodMeta'
import './player.scss'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'

    const m = Math.floor(seconds / 60)

    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')

    return `${m}:${s}`
}

const Player = () => {
    const { song, isPlaying, setIsPlaying } = useSong()

    const audioRef = useRef(null)
    const progressRef = useRef(null)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const [speed, setSpeed] = useState(1)

    const [volume, setVolume] = useState(1)

    const [showSpeed, setShowSpeed] = useState(false)

    const [isMuted, setIsMuted] = useState(false)

    // =========================================
    // PLAY / PAUSE SYNC
    // =========================================

    useEffect(() => {
        const audio = audioRef.current

        if (!audio || !song?.url) return

        if (isPlaying) {
            audio.play().catch((err) => {
                console.warn(
                    'Playback prevented or error:',
                    err
                )

                setIsPlaying(false)
            })
        } else {
            audio.pause()
        }
    }, [isPlaying, song?.url, setIsPlaying])

    // =========================================
    // RESET WHEN SONG CHANGES
    // =========================================

    useEffect(() => {
        setCurrentTime(0)
        setDuration(0)
    }, [song?.url])

    // =========================================
    // PLAY / PAUSE BUTTON
    // =========================================

    const togglePlay = () => {
        if (!song?.url) return

        setIsPlaying(!isPlaying)
    }

    // =========================================
    // SKIP
    // =========================================

    const skip = (secs) => {
        const audio = audioRef.current

        if (!audio) return

        audio.currentTime = Math.min(
            Math.max(audio.currentTime + secs, 0),
            duration
        )
    }

    // =========================================
    // TIME UPDATE
    // =========================================

    const handleTimeUpdate = () => {
        if (!audioRef.current) return

        setCurrentTime(audioRef.current.currentTime)
    }

    // =========================================
    // AUDIO METADATA
    // =========================================

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return

        setDuration(audioRef.current.duration)
    }

    // =========================================
    // PROGRESS BAR CLICK
    // =========================================

    const handleProgressClick = (e) => {
        const bar = progressRef.current
        const audio = audioRef.current

        if (!bar || !audio || !duration) return

        const rect = bar.getBoundingClientRect()

        const ratio =
            (e.clientX - rect.left) / rect.width

        const newTime = Math.min(
            Math.max(ratio, 0),
            1
        ) * duration

        audio.currentTime = newTime

        setCurrentTime(newTime)
    }

    // =========================================
    // SPEED
    // =========================================

    const handleSpeedChange = (s) => {
        setSpeed(s)

        if (audioRef.current) {
            audioRef.current.playbackRate = s
        }

        setShowSpeed(false)
    }

    // =========================================
    // VOLUME
    // =========================================

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value)

        setVolume(val)

        if (audioRef.current) {
            audioRef.current.volume = val
        }

        setIsMuted(val === 0)
    }

    // =========================================
    // MUTE
    // =========================================

    const toggleMute = () => {
        const audio = audioRef.current

        if (!audio) return

        if (isMuted) {
            const newVolume = volume || 0.5

            audio.volume = newVolume

            setVolume(newVolume)
            setIsMuted(false)
        } else {
            audio.volume = 0

            setIsMuted(true)
        }
    }

    // =========================================
    // SONG END
    // =========================================

    const handleSongEnd = () => {
        setIsPlaying(false)
        setCurrentTime(0)
    }

    const progress = duration
        ? (currentTime / duration) * 100
        : 0

    if (!song) return null

    const mood = getMoodMeta(song.mood)

    return (
        <div
            className="player"
            style={{
                '--mood-color': mood.color
            }}
        >

            {/* =========================
                AUDIO
            ========================= */}

            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            {/* =========================
                SONG INFO
            ========================= */}

            <div className="player__info">

                <div className="player__poster-wrap">

                    <img
                        className={`player__poster ${
                            isPlaying
                                ? 'is-spinning'
                                : ''
                        }`}
                        src={song.posterUrl}
                        alt={song.title}
                    />

                    <span
                        className="player__mood-badge"
                        title={song.mood}
                    >
                        {mood.emoji}
                    </span>

                </div>

                <div className="player__meta">

                    <p className="player__title">
                        {song.title}
                    </p>

                    <span className="player__mood">

                        <span className="player__mood-emoji">
                            {mood.emoji}
                        </span>

                        {song.mood}

                    </span>

                </div>

            </div>

            {/* =========================
                CENTER CONTROLS
            ========================= */}

            <div className="player__center">

                <div className="player__controls">

                    {/* BACKWARD */}

                    <button
                        className="player__btn player__btn--skip"
                        onClick={() => skip(-5)}
                        title="Back 5 seconds"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="18"
                            height="18"
                        >
                            <path d="M1 4v6h6" />

                            <path d="M3.51 15a9 9 0 1 0 .49-3.6" />
                        </svg>

                        <span>5s</span>

                    </button>

                    {/* PLAY / PAUSE */}

                    <button
                        className="player__btn player__btn--play"
                        onClick={togglePlay}
                        title={
                            isPlaying
                                ? 'Pause'
                                : 'Play'
                        }
                        aria-label={
                            isPlaying
                                ? 'Pause song'
                                : 'Play song'
                        }
                    >

                        {isPlaying ? (

                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="#ffffff"
                                aria-hidden="true"
                            >
                                <rect
                                    x="6"
                                    y="4"
                                    width="4"
                                    height="16"
                                    rx="1"
                                />

                                <rect
                                    x="14"
                                    y="4"
                                    width="4"
                                    height="16"
                                    rx="1"
                                />
                            </svg>

                        ) : (

                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="#ffffff"
                                aria-hidden="true"
                            >
                                <path d="M8 5.14v14l11-7-11-7z" />
                            </svg>

                        )}

                    </button>

                    {/* FORWARD */}

                    <button
                        className="player__btn player__btn--skip"
                        onClick={() => skip(5)}
                        title="Forward 5 seconds"
                    >

                        <span>5s</span>

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="18"
                            height="18"
                        >
                            <path d="M23 4v6h-6" />

                            <path d="M20.49 15a9 9 0 1 1-.49-3.6" />
                        </svg>

                    </button>

                </div>

                {/* =========================
                    PROGRESS
                ========================= */}

                <div className="player__progress-wrap">

                    <span className="player__time">
                        {formatTime(currentTime)}
                    </span>

                    <div
                        className="player__progress"
                        ref={progressRef}
                        onClick={handleProgressClick}
                    >

                        <div
                            className="player__progress-fill"
                            style={{
                                width: `${progress}%`
                            }}
                        />

                        <div
                            className="player__progress-thumb"
                            style={{
                                left: `${progress}%`
                            }}
                        />

                    </div>

                    <span className="player__time">
                        {formatTime(duration)}
                    </span>

                </div>

            </div>

            {/* =========================
                RIGHT SIDE
            ========================= */}

            <div className="player__side">

                {/* SPEED */}

                <div className="player__speed-wrap">

                    <button
                        className="player__btn player__btn--speed"
                        onClick={() =>
                            setShowSpeed(!showSpeed)
                        }
                        title="Playback speed"
                    >
                        {speed}×
                    </button>

                    {showSpeed && (

                        <div className="player__speed-menu">

                            {SPEED_OPTIONS.map((s) => (

                                <button
                                    key={s}
                                    className={`player__speed-option ${
                                        s === speed
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleSpeedChange(s)
                                    }
                                >
                                    {s}×
                                </button>

                            ))}

                        </div>

                    )}

                </div>

                {/* VOLUME */}

                <div className="player__volume">

                    <button
                        className="player__btn player__btn--vol"
                        onClick={toggleMute}
                        title={
                            isMuted
                                ? 'Unmute'
                                : 'Mute'
                        }
                    >

                        {isMuted || volume === 0 ? (

                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="18"
                                height="18"
                            >
                                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.87 8.87 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18L19 19.27 20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>

                        ) : (

                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="18"
                                height="18"
                            >
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>

                        )}

                    </button>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={
                            isMuted
                                ? 0
                                : volume
                        }
                        onChange={handleVolume}
                        className="player__volume-slider"
                    />

                </div>

            </div>

        </div>
    )
}

export default Player