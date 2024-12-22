const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

//Route Import 
const userRouter = require("./routes/userRoutes.js")

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

//Routes
app.use('/api/v1', userRouter)

module.exports = { app }