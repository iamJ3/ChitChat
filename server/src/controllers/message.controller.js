import User from "../models/user.model"
import Message from "../models/messages.model"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const getUserForSidebar = async (req, res) => {
    try {

        const loogedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loogedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log(`Error in Getusersidebar : ${error.message}`);
        res.status(500).json({ message: "internal Errror" })

    }
}

const getMessages = async (req, res) => {

    try {
        const { id: userTochatId } = req.params;;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userTochatId },
                { senderId: userTochatId, receiverId: myId }
            ]
        });
        res.status(200).json(messages);

    } catch (error) {
        console.log(`eroor :${error.message}`);
        res.status(500).json({ message: "internal Error" })
    }
}

const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageURL;
        if (!image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadedResponse.secure_url;
        };

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL
        });
        await newMessage.save();

        const recciverSocketId = getReceiverSocketId(receiverId);
        if (recciverSocketId) {
            io.to(recciverSocketId).emit("newMessage", newMessage);
        }
        res.status(200).json(newMessage);



    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export { getUserForSidebar, getMessages, sendMessage }