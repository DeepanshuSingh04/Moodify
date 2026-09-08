import React, { useState } from 'react'
import { getMoodMeta } from './moodMeta'
import { useSong } from '../hooks/useSong'
import AddSongModal from './AddSongModal'
import './playlist-sidebar.scss'

const PlaylistSidebar = ({
    songs: propsSongs,
    activeSongUrl: propsActiveUrl,
    isPlaying: propsIsPlaying,
    onSelect: propsOnSelect
}) => {
    const {
        songs: contextSongs,
        song: contextActiveSong,
        isPlaying: contextIsPlaying,
        selectSong,
        handleGetSong
    } = useSong()

    const [isModalOpen, setIsModalOpen] = useState(false)

    const songsList = propsSongs !== undefined ? propsSongs : (contextSongs || [])
    const activeUrl = propsActiveUrl !== undefined ? propsActiveUrl : contextActiveSong?.url
    const isPlaying = propsIsPlaying !== undefined ? propsIsPlaying : contextIsPlaying
    const handleSelect = propsOnSelect || selectSong

    const handleSongAdded = ({ mood: addedMood, song: newSong }) => {
        const currentMood = contextActiveSong?.mood?.toLowerCase()
        const targetMood = addedMood?.toLowerCase()

        // If added song's mood matches current playlist mood, or if no active song exists, refetch
        if (!currentMood || currentMood === targetMood) {
            handleGetSong({ mood: addedMood })
        }

        if (newSong && !contextActiveSong?.url) {
            selectSong(newSong)
        }
    }

    return (
        <aside className="playlist">
            <div className="playlist__header">
                <div className="playlist__header-title-wrap">
                    <h2 className="playlist__title">Mood Playlist</h2>
                    {contextActiveSong?.mood && (
                        <span className="playlist__active-mood">
                            {getMoodMeta(contextActiveSong.mood).emoji} {contextActiveSong.mood}
                        </span>
                    )}
                </div>
                <span className="playlist__count">{songsList.length} {songsList.length === 1 ? 'song' : 'songs'}</span>
            </div>

            <AddSongModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSongAdded={handleSongAdded}
            />

            <div className="playlist__list">
                {songsList.length === 0 ? (
                    <div className="playlist__empty">
                        <p className="playlist__empty-title">No playlist loaded</p>
                        <p className="playlist__empty-subtitle">Detect an expression to get mood-matched songs.</p>
                    </div>
                ) : (
                    songsList.map((item, idx) => {
                        const mood = getMoodMeta(item.mood)
                        const isActive = item.url === activeUrl

                        return (
                            <button
                                key={item.url || idx}
                                className={`playlist__row ${isActive ? 'is-active' : ''}`}
                                style={{ '--mood-color': mood.color }}
                                onClick={() => handleSelect(item)}
                            >
                                <div className="playlist__poster-wrap">
                                    <img className="playlist__poster" src={item.posterUrl} alt={item.title} />
                                    {isActive && (
                                        <span className="playlist__playing-icon">
                                            {isPlaying ? (
                                                <span className="playlist__bars">
                                                    <i /><i /><i />
                                                </span>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                                    <path d="M8 5.14v14l11-7-11-7z" />
                                                </svg>
                                            )}
                                        </span>
                                    )}
                                </div>

                                <div className="playlist__meta">
                                    <p className="playlist__song-title">{item.title}</p>
                                    {item.artist && <p className="playlist__song-artist">{item.artist}</p>}
                                </div>

                                <span className="playlist__mood-pill">
                                    <span className="playlist__mood-emoji">{mood.emoji}</span>
                                    {item.mood}
                                </span>
                            </button>
                        )
                    })
                )}
            </div>

            <div className="playlist__footer">
                <button
                    className="playlist__add-song-btn"
                    onClick={() => setIsModalOpen(true)}
                    title="Add new song to Moodify"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Song</span>
                </button>
            </div>
        </aside>
    )
}

export default PlaylistSidebar