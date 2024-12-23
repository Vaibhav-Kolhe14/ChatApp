const User = require('../models/userModel.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const jwt = require("jsonwebtoken")


const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            throw new ApiError(400, "User not authenticated.")
        };

        const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!decode){
            throw new ApiError(400, "Invalid token")
        };

        req.id = decode.userId;
        
        next();
      } catch (error) {
        console.log(error);
        throw new ApiError(400, error?.message || "Invalid Access Token :: authMiddleware")
      }
})


module.exports = verifyJWT