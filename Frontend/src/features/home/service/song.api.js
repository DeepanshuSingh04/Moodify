import axios from 'axios'


const api = axios.create({
    baseURL : "https://moodify-5r4l.onrender.com",
    withCredentials: true
})

export async function getSong({mood}) {
    const response = await api.get("/api/songs?mood=" + mood)
    console.log(response)
    return response.data
}

export async function getSongsByMood({mood}) {
    const response = await api.get("/api/songs/mood/" + mood)
    console.log(response)
    return response.data
}

export async function uploadSongApi(data) {
    if (data instanceof FormData) {
        const response = await api.post("/api/songs", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    } else {
        const response = await api.post("/api/songs", data)
        return response.data
    }
}