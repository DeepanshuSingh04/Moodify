const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authUser(req,res,next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    
    const isTokenBlacklsted = await blacklistModel.findOne({
        token
    })

    if(isTokenBlacklsted) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }


    try {        //verify kr rhe hain jwt token ko secret key se agr valid ho to uski info reqq.user me storre karo 
        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        )

        req.user = decoded

        next()

    } catch (err) {
        return res.status(401).json({

        })
    }
    
}

module.exports = {authUser}