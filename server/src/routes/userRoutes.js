const { Router } = require('express')
const { registerUser } = require("../controllers/userController.js")

const router = Router()

router.route('/router').post(registerUser)

module.exports = router