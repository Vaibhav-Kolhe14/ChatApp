const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')

const helloWorld = asyncHandler( async(req, res) => {
    console.log("Hello")
    res.status(200).send("Hello world")
})

module.exports = { helloWorld }