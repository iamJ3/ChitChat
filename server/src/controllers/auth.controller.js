import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt, { hash } from "bcryptjs"
import cloudinary from "../lib/Cloudinary.js"

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
        if (user) return res.status(400).json({ message: "Email already exists. Please try to login" });

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

const login = async (req, res) => {

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
            profilePic: user.profilePic,// todo fix this
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

        // Validate base64 image exists
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        // Validate base64 format
        if (!profilePic.startsWith('data:image/')) {
            return res.status(400).json({ message: "Invalid image format" });
        }

        // Extract image type from base64 string
        const imageTypeMatch = profilePic.match(/^data:image\/(\w+);base64,/);
        const imageType = imageTypeMatch ? imageTypeMatch[1] : 'jpeg';
        
        // Validate image type
        const allowedTypes = ['jpeg', 'jpg', 'png'];
        if (!allowedTypes.includes(imageType.toLowerCase())) {
            return res.status(400).json({ 
                message: "Invalid image type. Only JPEG, JPG, and PNG are allowed" 
            });
        }

        // Upload to Cloudinary with optimized settings
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
            allowed_formats: ["jpg", "jpeg", "png"],
            transformation: [
                { width: 500, height: 500, crop: "fill" },
                { quality: "auto:good" }
            ],
            resource_type: "image"
        });

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in update profile:", error.message);
        
        // Handle Cloudinary specific errors
        if (error.message.includes('Invalid image file')) {
            return res.status(400).json({ message: "Invalid image file provided" });
        }
        
        if (error.message.includes('File size too large')) {
            return res.status(413).json({ message: "Image file is too large" });
        }
        
        res.status(500).json({ message: "Internal server error: " + error.message });
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