const User = require('../models/userModel.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const bcrypt = require("bcryptjs")

const registerUser = asyncHandler( async(req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body
        if(!fullName || !username || !password || !confirmPassword || !gender) {
            throw new ApiError(400, "All fields are required")
        }

        if(password === confirmPassword) {
            throw new ApiError(400, "Password does not match !")
        }

        const user = await User.findOne({username})
        if(user) {
            throw new ApiError(400, "Username already exist")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === male? maleProfilePhoto : femaleProfilePhoto,
            gender
        })
    } catch (error) {
        console.log(error)
        throw new ApiError(400, "Error in register user !")
    }
})

module.exports = { registerUser }