const { Router } = require('express')
const { helloWorld } = require("../controllers/userController.js")

const router = Router()

router.route('').get(helloWorld)

module.exports = router