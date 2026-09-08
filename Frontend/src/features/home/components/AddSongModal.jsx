import React, { useState } from 'react'
import {
    MOOD_META,
    getMoodMeta
} from './moodMeta'

import { uploadSongApi } from '../service/song.api'

import './add-song-modal.scss'

const MOOD_OPTIONS = Object.keys(MOOD_META)

const AddSongModal = ({
    isOpen,
    onClose,
    onSongAdded
}) => {

    const [title, setTitle] = useState('')

    const [mood, setMood] = useState('happy')

    const [inputType, setInputType] =
        useState('url')

    const [songUrl, setSongUrl] =
        useState('')

    const [posterUrl, setPosterUrl] =
        useState('')

    const [songFile, setSongFile] =
        useState(null)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    const [success, setSuccess] =
        useState('')

    if (!isOpen) return null

    // =====================================
    // FILE CHANGE
    // =====================================

    const handleFileChange = (e) => {

        if (
            e.target.files &&
            e.target.files[0]
        ) {

            setSongFile(
                e.target.files[0]
            )

            setError('')
        }
    }

    // =====================================
    // SUBMIT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')
        setSuccess('')

        // TITLE
        if (!title.trim()) {

            setError(
                'Please enter a song title.'
            )

            return
        }

        // MOOD
        if (!mood) {

            setError(
                'Please select a mood.'
            )

            return
        }

        // SOURCE
        if (inputType === 'file') {

            if (!songFile) {

                setError(
                    'Please choose an MP3 audio file to upload.'
                )

                return
            }

        } else {

            if (!songUrl.trim()) {

                setError(
                    'Please enter a direct Audio URL (.mp3 link).'
                )

                return
            }
        }

        setLoading(true)

        try {

            let result

            // =================================
            // FILE UPLOAD
            // =================================

            if (inputType === 'file') {

                const formData =
                    new FormData()

                formData.append(
                    'song',
                    songFile
                )

                formData.append(
                    'mood',
                    mood
                )

                formData.append(
                    'title',
                    title.trim()
                )

                if (posterUrl.trim()) {

                    formData.append(
                        'posterUrl',
                        posterUrl.trim()
                    )
                }

                result =
                    await uploadSongApi(
                        formData
                    )

            }

            // =================================
            // URL
            // =================================

            else {

                result =
                    await uploadSongApi({

                        title:
                            title.trim(),

                        mood,

                        url:
                            songUrl.trim(),

                        posterUrl:
                            posterUrl.trim() ||
                            undefined

                    })
            }

            // =================================
            // SUCCESS
            // =================================

            setSuccess(
                'Song added successfully!'
            )

            // CLEAR
            setTitle('')
            setSongUrl('')
            setPosterUrl('')
            setSongFile(null)

            // PARENT CALLBACK
            onSongAdded?.({
                mood,
                song: result.song
            })

            setTimeout(() => {

                setSuccess('')

            }, 3000)

        } catch (err) {

            console.error(
                'Error adding song:',
                err
            )

            setError(
                err.response?.data?.message ||
                err.message ||
                'Failed to add song. Please try again.'
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div
            className="add-song-backdrop"
            onClick={onClose}
        >

            <div
                className="add-song-card"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =========================
                    HEADER
                ========================= */}

                <header className="add-song-header">

                    <div className="add-song-header-title">

                        <h2>
                            Add New Song
                        </h2>

                        <span className="add-song-subtitle">
                            Expand your mood playlists
                        </span>

                    </div>

                    <button
                        className="add-song-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="20"
                            height="20"
                        >

                            <line
                                x1="18"
                                y1="6"
                                x2="6"
                                y2="18"
                            />

                            <line
                                x1="6"
                                y1="6"
                                x2="18"
                                y2="18"
                            />

                        </svg>

                    </button>

                </header>

                {/* =========================
                    FORM
                ========================= */}

                <form
                    onSubmit={handleSubmit}
                    className="add-song-form"
                >

                    {error && (

                        <div className="add-song-alert add-song-alert--error">
                            {error}
                        </div>

                    )}

                    {success && (

                        <div className="add-song-alert add-song-alert--success">
                            {success}
                        </div>

                    )}

                    {/* TITLE */}

                    <div className="add-song-field">

                        <label htmlFor="song-title">
                            Song Title *
                        </label>

                        <input
                            id="song-title"
                            type="text"
                            placeholder="e.g. Midnight City"
                            value={title}
                            onChange={(e) => {

                                setTitle(
                                    e.target.value
                                )

                                setError('')
                            }}
                            disabled={loading}
                        />

                    </div>

                    {/* MOOD */}

                    <div className="add-song-field">

                        <label htmlFor="song-mood">
                            Mood Category *
                        </label>

                        <div className="add-song-select-wrap">

                            <select
                                id="song-mood"
                                value={mood}
                                onChange={(e) => {

                                    setMood(
                                        e.target.value
                                    )

                                    setError('')
                                }}
                                disabled={loading}
                            >

                                {MOOD_OPTIONS.map(
                                    (m) => {

                                        const meta =
                                            getMoodMeta(m)

                                        return (

                                            <option
                                                key={m}
                                                value={m}
                                            >
                                                {meta.emoji}{' '}
                                                {m
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    m.slice(1)}
                                            </option>

                                        )
                                    }
                                )}

                            </select>

                            <span className="add-song-select-emoji">
                                {
                                    getMoodMeta(
                                        mood
                                    ).emoji
                                }
                            </span>

                        </div>

                    </div>

                    {/* INPUT TYPE */}

                    <div className="add-song-tabs">

                        <button
                            type="button"
                            className={`add-song-tab ${
                                inputType === 'url'
                                    ? 'is-active'
                                    : ''
                            }`}
                            onClick={() => {

                                setInputType(
                                    'url'
                                )

                                setError('')
                            }}
                        >
                            Audio URL
                        </button>

                        <button
                            type="button"
                            className={`add-song-tab ${
                                inputType === 'file'
                                    ? 'is-active'
                                    : ''
                            }`}
                            onClick={() => {

                                setInputType(
                                    'file'
                                )

                                setError('')
                            }}
                        >
                            Upload File (.mp3)
                        </button>

                    </div>

                    {/* AUDIO URL / FILE */}

                    {inputType === 'url' ? (

                        <div className="add-song-field">

                            <label htmlFor="song-url">
                                Audio File URL (.mp3 link) *
                            </label>

                            <input
                                id="song-url"
                                type="url"
                                placeholder="https://example.com/song.mp3"
                                value={songUrl}
                                onChange={(e) => {

                                    setSongUrl(
                                        e.target.value
                                    )

                                    setError('')
                                }}
                                disabled={loading}
                            />

                        </div>

                    ) : (

                        <div className="add-song-field">

                            <label htmlFor="song-file">
                                MP3 Audio File *
                            </label>

                            <input
                                id="song-file"
                                type="file"
                                accept="audio/mp3,audio/mpeg"
                                onChange={
                                    handleFileChange
                                }
                                disabled={loading}
                                className="add-song-file-input"
                            />

                        </div>

                    )}

                    {/* POSTER */}

                    <div className="add-song-field">

                        <label htmlFor="poster-url">
                            Poster Image URL (Optional)
                        </label>

                        <input
                            id="poster-url"
                            type="url"
                            placeholder="https://example.com/cover.jpg"
                            value={posterUrl}
                            onChange={(e) =>
                                setPosterUrl(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>

                    {/* ACTIONS */}

                    <div className="add-song-actions">

                        <button
                            type="button"
                            className="add-song-btn add-song-btn--cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-song-btn add-song-btn--submit"
                            disabled={loading}
                        >

                            {loading
                                ? 'Adding Song...'
                                : 'Add Song'}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddSongModal