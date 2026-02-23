import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";
import { emitToUser } from "../lib/socket.js";

const SOCKET_EVENTS = {
  NEW_MESSAGE: "newMessage",
};

const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("[Message] getUserForSidebar error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("[Message] getMessages error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageURL;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || undefined,
      image: imageURL,
    });
    await newMessage.save();

    // Real-time: emit to all receiver's tabs; receiverId may be string from params
    const receiverIdStr = String(receiverId);
    emitToUser(receiverIdStr, SOCKET_EVENTS.NEW_MESSAGE, newMessage);

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("[Message] sendMessage error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUserForSidebar, getMessages, sendMessage };
