const { Router } = require('express')
const { sendMessage, getMessage } = require("../controllers/messageController.js")
const verifyJWT = require("../middlewares/authMiddleware.js")

const router = Router()

router.route("/send/:id").post(verifyJWT, sendMessage);
router.route("/:id").get(verifyJWT, getMessage);

module.exports = router