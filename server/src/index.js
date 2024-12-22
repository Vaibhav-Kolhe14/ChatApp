require("dotenv").config()
const { app } = require("./app.js")
const connectDB = require("./db/connectDB.js")

const PORT = process.env.PORT || 8080

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log("Mongo DB Connection Failed...! :: ", error)
})