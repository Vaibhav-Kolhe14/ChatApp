const User = require('../models/userModel.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = asyncHandler( async(req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body
        if(!fullName || !username || !password || !confirmPassword || !gender) {
            throw new ApiError(400, "All fields are required")
        }

        if(password !== confirmPassword) {
            throw new ApiError(400, "Password does not match !")
        }

        const user = await User.findOne({username})
        if(user) {
            throw new ApiError(400, "Username already exist")
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        })

        res.status(200).json(new ApiResponse(200, {}, "User Registered Successfully !"))
    } catch (error) {
        console.log(error)
        throw new ApiError(400, "Error in register user !")
    }
})


const loginUser = asyncHandler( async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new ApiError(400, "All fields are required")
        };

        const user = await User.findOne({ username });

        if (!user) {
            throw new ApiError(400, "Incorrect username or password")
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new ApiError(400, "Incorrect username or password")
        };

        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json(
            new ApiResponse(200, 
                {_id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto}, 
                "User Logged In !")
        );

    } catch (error) {
        console.log(error);
        throw new ApiError(400, "Error in login user")
    }
})

const logoutUser = asyncHandler( async(req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json(
            new ApiResponse(200, {}, "logged out successfully.")
        )
    } catch (error) {
        console.log(error);
        throw new ApiError(400, "Error in logout User")
    }
})

const getOtherUsers = asyncHandler( async(req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(new ApiResponse(200, otherUsers, "Other Users Getted !"));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, "Error in getOtherusers")
    }
})


module.exports = { registerUser,
    loginUser,
    logoutUser,
    getOtherUsers
 }