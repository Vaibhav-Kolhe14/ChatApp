const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const Message = require('../models/messageModel.js')
const Conversation = require("../models/conversationModel.js")


const sendMessage = asyncHandler( async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(new ApiResponse(201, newMessage, "message sent"))
    } catch (error) {
        console.log(error);
        throw new ApiError(400, "Error in sending message")
    }
})


const getMessage = asyncHandler( async(req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 

        res.status(200).json(new ApiResponse(200, conversation?.messages, "Messages retrieved successfully"));
    } catch (error) {
        console.log(error);
        throw new ApiError(400, "Error in getMessage")
    }
})


module.exports = {
    sendMessage,
    getMessage
}