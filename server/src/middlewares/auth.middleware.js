import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized, no token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized, no token provided" });

        const user = await User.findById(decoded.userid).select("-password");
        if (!user) return res.status(401).json({ message: "Unauthorized, user not found" });
        req.user = user;
        next();

    } catch (error) {
        console.log(`internal error ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// console.log("hello");
// process.stdout.write('hello 2 ');