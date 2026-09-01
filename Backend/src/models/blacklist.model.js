const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required for blacklosting."],
    }
}, {
    timestamps: true
})

const blacklistModel = mongoose.model('blacklist', blacklistSchema)

module.exports = blacklistModel