import axios from 'axios'

const api = axios.create({
    baseURL: "https://moodify-5r4l.onrender.com",
    withCredentials: true
})

export async function register({email, password, username}) {
    const response = await api.post("/api/auth/register", {
        email, password, username
    })

    return response.data
}

export async function login({email, password, username}) {
    const response = await api.post("/api/auth/login", {
        email, password, username
    })

    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")

    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")

    return response.data
}