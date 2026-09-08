import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import PlaylistSidebar from '../components/PlaylistSidebar'
import { useSong } from '../hooks/useSong'
import './home.scss'

const Home = () => {
    const { handleGetSong } = useSong()

    return (
        <div className="home-layout">
            <main className="home-main">
                <header className="home-header">
                    <h1 className="home-title">Moodify</h1>
                    <p className="home-subtitle">Mood-Based Music Recommendations</p>
                </header>
                <div className="home-expression-container">
                    <FaceExpression
                        onClick={(expression) => { handleGetSong({ mood: expression }) }}
                    />
                </div>
            </main>
            <PlaylistSidebar />
            <Player />
        </div>
    )
}

export default Home