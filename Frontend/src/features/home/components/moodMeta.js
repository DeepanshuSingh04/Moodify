// Central place for mood -> emoji + accent color.
// Add/edit moods here and both the Player and the Playlist sidebar update.
export const MOOD_META = {
    happy:     { emoji: '😄', color: '#f5b400' },
    sad:       { emoji: '😢', color: '#4c8dff' },
    energetic: { emoji: '⚡', color: '#dd4200' },
    calm:      { emoji: '😌', color: '#3fbf8f' },
    angry:     { emoji: '😤', color: '#e5484d' },
    romantic:  { emoji: '💗', color: '#ff5fa2' },
    chill:     { emoji: '🧊', color: '#5fd0e0' },
    neutral:   { emoji: '🙂', color: '#9a9a9a' },
    excited:   { emoji: '🤩', color: '#ffb347' },
    relaxed:   { emoji: '🌙', color: '#8f8fe0' },
}

export const DEFAULT_MOOD = { emoji: '🎧', color: '#dd4200' }

export const getMoodMeta = (mood) => MOOD_META[(mood || '').toLowerCase()] || DEFAULT_MOOD