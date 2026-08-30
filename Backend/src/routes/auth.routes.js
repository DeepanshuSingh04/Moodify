const {Router} = require("express");
const authController =  require("../controllers/auth.controller")


const router = Router();


router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)


module.exports = router;