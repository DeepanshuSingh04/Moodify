import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const initialSong = {
        "url": 'https://ik.imagekit.io/f8khymiop/cohort-2/moodify/songs/Baliye_Re__320_Kbps__-_www.DownloadMing4.Com_8d3AIamXj.mp3',
        "posterUrl": 'https://ik.imagekit.io/f8khymiop/cohort-2/moodify/posters/Baliye_Re__320_Kbps__-_www.DownloadMing4.Com_VO8Vl7HBg.jpeg',
        "title": 'Baliye Re (320 Kbps) - www.DownloadMing4.Com',
        "mood": 'happy',
    }

    const [ song, setSong ] = useState(initialSong)
    const [ songs, setSongs ] = useState([initialSong])
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    return (
        <SongContext.Provider
            value={{ loading, setLoading, song, setSong, songs, setSongs, isPlaying, setIsPlaying }}
        >
            {children}
        </SongContext.Provider>
    )

}

