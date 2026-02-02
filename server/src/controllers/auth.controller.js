import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt, { hash } from "bcryptjs"


const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    console.log(req.body);


    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        else if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters long" })
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json(`email alrady exist, try another one`);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword

        });

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
            });
        } else res.status(400).json({ message: "Invalid user data" });

    } catch (error) {
        console.log(`encountered error : ${error}`);

    }
};

const signin = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "invalid Credintils" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'invalid credentials' })

        generateToken(user._id, res);
        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log(`Error Encountered : ${error.message}`);
        res.status(500).json({ message: "internal server error" });
    }
};

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userid = req.user._id;

        if (!profilePic) return res.status(400).json({ message: "profile pic is required" });
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updateuser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export { login, signup, logout, updateProfile, checkAuth };