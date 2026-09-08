const songModel = require("../models/song.model")
const id3 = require("node-id3")
const storageService = require("../services/storage.service")


async function uploadSong(req, res) {
    try {
        const { mood, title: bodyTitle, url: bodyUrl, posterUrl: bodyPosterUrl } = req.body

        if (!mood) {
            return res.status(400).json({ message: "Mood is required." })
        }

        let songUrl = bodyUrl
        let posterUrl = bodyPosterUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"
        let songTitle = bodyTitle

        // Case 1: Audio file uploaded via multipart form
        if (req.file) {
            const songBuffer = req.file.buffer
            let tags = null
            try {
                tags = id3.read(songBuffer)
            } catch (err) {
                console.warn("Could not parse ID3 tags from audio file:", err)
            }

            if (!songTitle) {
                songTitle = tags?.title || req.file.originalname.replace(/\.[^/.]+$/, "") || "Untitled Song"
            }

            const uploads = [
                storageService.uploadFile({
                    buffer: songBuffer,
                    filename: (songTitle || "song") + ".mp3",
                    folder: "/cohort-2/moodify/songs"
                })
            ]

            const hasEmbeddedImage = tags?.image?.imageBuffer
            if (hasEmbeddedImage) {
                uploads.push(
                    storageService.uploadFile({
                        buffer: tags.image.imageBuffer,
                        filename: (songTitle || "poster") + ".jpeg",
                        folder: "/cohort-2/moodify/posters"
                    })
                )
            }

            const results = await Promise.all(uploads)
            songUrl = results[0].url
            if (hasEmbeddedImage && results[1]) {
                posterUrl = results[1].url
            }
        }

        if (!songUrl) {
            return res.status(400).json({ message: "Audio file or song URL is required." })
        }

        if (!songTitle) {
            songTitle = "Untitled Song"
        }

        const song = await songModel.create({
            title: songTitle,
            url: songUrl,
            posterUrl: posterUrl,
            mood: mood.toLowerCase().trim()
        })

        res.status(201).json({
            message: "song created successfully",
            song
        })
    } catch (error) {
        console.error("Error creating song:", error)
        res.status(500).json({
            message: "Failed to create song",
            error: error.message
        })
    }
}


async function getSong(req, res) {
    const { mood } = req.query

    const song = await songModel.findOne({
        mood: { $regex: new RegExp(`^${mood}$`, 'i') }
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })
}

async function getSongsByMood(req, res) {
    try {
        const { mood } = req.params

        const songs = await songModel.find({
            mood: { $regex: new RegExp(`^${mood}$`, 'i') }
        })

        res.status(200).json({
            message: "songs fetched successfully.",
            songs,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch songs by mood",
            error: error.message
        })
    }
}


module.exports = { uploadSong, getSong, getSongsByMood }