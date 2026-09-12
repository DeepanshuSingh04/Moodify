# 🎵 Moodify

**Moodify** is a full-stack, mood-based music player that detects your facial expression in real time through your webcam and instantly recommends songs to match how you feel.

No searching, no scrolling — just look at the camera, and Moodify plays the vibe that fits your mood (Happy, Sad, Surprised, Neutral).

---

## ✨ Features

- 🎭 **Real-time facial expression detection** — uses **MediaPipe FaceLandmarker** (via `@mediapipe/tasks-vision`) directly in the browser to analyze facial blendshapes and classify mood.
- 🎶 **Mood-based playlist generation** — automatically fetches and plays songs matching the detected mood.
- ⬆️ **Song upload** — users can upload their own songs (with poster/cover art) tagged by mood.
- 🖼️ **Automatic metadata & cover-art extraction** — uses **node-id3** to pull title/cover art from uploaded audio files.
- ☁️ **Cloud storage** — songs and posters are stored via **ImageKit**.
- 🔐 **Secure authentication** — JWT-based auth with **bcrypt** password hashing.
- 🚪 **Safe logout** — uses **Redis**-backed token blacklisting so logged-out tokens can no longer be used.
- 🎧 **In-app music player** — play, pause, and seek through your mood playlist.

---

## 🏗️ Architecture

```
┌────────────────────┐        ┌──────────────────────┐
│   React Frontend    │──────▶│   Express Backend     │
│  (Webcam + MediaPipe │  API  │  (Auth + Song APIs)   │
│   Face Detection)    │◀──────│                       │
└────────────────────┘        └──────────┬────────────┘
                                          │
                       ┌──────────────────┼──────────────────┐
                       ▼                  ▼                  ▼
                 ┌───────────┐     ┌────────────┐     ┌────────────┐
                 │  MongoDB   │     │   Redis     │     │  ImageKit   │
                 │ (Users,    │     │ (Token      │     │ (Song files │
                 │  Songs)    │     │ Blacklist)  │     │ & Posters)  │
                 └───────────┘     └────────────┘     └────────────┘
```

The Express backend also serves the built React frontend as static files, so the whole app runs as a single deployable service.

---

## 🛠️ Tech Stack

**Frontend**
- React.js, React Router DOM
- Vite
- Sass (SCSS)
- Axios
- MediaPipe (`@mediapipe/tasks-vision`) — FaceLandmarker for real-time facial expression/blendshape detection

**Backend**
- Node.js, Express.js
- MongoDB with Mongoose
- Redis (`ioredis`) — JWT blacklisting on logout
- JWT (`jsonwebtoken`) + `bcryptjs` — authentication & password security
- Multer — handling audio file uploads
- `node-id3` — extracting ID3 metadata (title, cover art) from audio files
- ImageKit (`@imagekit/nodejs`) — cloud storage for songs & posters
- `cookie-parser`, `cors`

---

## 📂 Project Structure

```
Moodify/
├── Backend/
│   ├── src/
│   │   ├── app.js                  # Express app setup, routes, static serving
│   │   ├── config/                 # Redis / other config
│   │   ├── controllers/            # auth.controller.js, song.controller.js
│   │   ├── middlewares/            # auth.middleware.js, upload.middleware.js
│   │   ├── models/                 # user.model.js, song.model.js, blacklist.model.js
│   │   ├── routes/                 # auth.routes.js, song.routes.js
│   │   └── services/               # storage.service.js (ImageKit)
│   ├── public/                     # Built frontend (served as static files)
│   └── server.js
│
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/                # Login, Register, Protected routes, Auth context
        │   ├── Expression/          # Webcam + MediaPipe face expression detection
        │   └── home/                # Song player, mood playlist, upload modal
        ├── shared/
        ├── App.jsx
        ├── app.routes.jsx
        └── main.jsx
```

---

## ⚙️ How It Works

1. **Sign up / Log in** — user registers or logs in; the backend issues a JWT stored as an HTTP-only cookie.
2. **Detect expression** — on the home page, the webcam feed is passed to MediaPipe's **FaceLandmarker** model, which analyzes facial blendshapes and classifies the current mood.
3. **Fetch mood playlist** — the detected mood is sent to the backend (`GET /api/songs/mood/:mood`), which queries MongoDB for songs tagged with that mood.
4. **Play music** — the matched playlist loads into the in-app player, ready to play instantly.
5. **Upload a song (optional)** — users can upload their own tracks; `node-id3` extracts metadata/cover art automatically, and the file is stored via **ImageKit**.
6. **Logout** — the JWT is blacklisted in **Redis**, so it can't be reused even if intercepted.

---

## 🔌 API Endpoints

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT cookie |
| GET | `/api/auth/get-me` | Get the currently logged-in user (protected) |
| GET | `/api/auth/logout` | Log out and blacklist the current token |

**Songs**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/songs` | Upload a new song (with poster) |
| GET | `/api/songs` | Get all songs |
| GET | `/api/songs/mood/:mood` | Get songs filtered by mood |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance
- Redis instance
- ImageKit account (for song/poster storage)


---

## 🎯 Future Improvements
- Support for more mood categories
- Playlist sharing between users
- Mobile-responsive camera UI improvements

---

## 👤 Author

**Deepanshu Singh**
- GitHub: [@DeepanshuSingh04](https://github.com/DeepanshuSingh04)
- LinkedIn: [Deepanshu Singh](https://www.linkedin.com/in/deepanshu--singh/)

---

## 📄 License

This project is available for educational and portfolio purposes.
