import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt, { hash } from "bcryptjs"


const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    console.log(req.body);
    

    try {
        if (!fullName || !email || !password ) {
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

const login = (req, res) => {
    res.send("login")
}
const logout = (req, res) => {
    res.send("logout")
}


export { login, signup, logout };