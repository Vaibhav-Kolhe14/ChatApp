const { Router } = require('express')
const { registerUser, 
    loginUser, 
    logoutUser, 
    getOtherUsers } = require("../controllers/userController.js")
const verifyJWT = require("../middlewares/authMiddleware.js")

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/').get(verifyJWT, getOtherUsers)

module.exports = router