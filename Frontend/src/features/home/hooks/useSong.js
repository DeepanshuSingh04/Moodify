import { getSong, getSongsByMood } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";


export const useSong = () => {
    const context = useContext(SongContext)

    const { loading, setLoading, song, setSong, songs, setSongs, isPlaying, setIsPlaying } = context

    async function handleGetSong({ mood }) {
        if (!mood) return
        setLoading(true)
        try {
            const [singleData, playlistData] = await Promise.all([
                getSong({ mood }),
                getSongsByMood({ mood })
            ])
            
            if (singleData?.song) {
                setSong(singleData.song)
            } else if (playlistData?.songs && playlistData.songs.length > 0) {
                setSong(playlistData.songs[0])
            }

            if (playlistData?.songs) {
                setSongs(playlistData.songs)
            }
        } catch (err) {
            console.error("Error fetching song/playlist:", err)
        } finally {
            setLoading(false)
        }
    }

    function selectSong(selectedSong) {
        setSong(selectedSong)
        setIsPlaying(true)
    }

    return { 
        loading, 
        song, 
        setSong, 
        songs, 
        setSongs, 
        isPlaying, 
        setIsPlaying, 
        handleGetSong, 
        selectSong 
    }
}