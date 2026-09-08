const express = require("express")
const upload = require("../middlewares/upload.middleware")
const songController = require("../controllers/song.controller")


const router = express.Router()

/**
 * POST /api/songs/
 */
router.post("/", upload.single("song"), songController.uploadSong)

router.get('/', songController.getSong)
router.get('/mood/:mood', songController.getSongsByMood)


module.exports = router