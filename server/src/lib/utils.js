import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const generateToken = (userId,res)=>{
const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'7d',
});

  // For cross-origin deployments (frontend and backend on different domains)
  // browsers require SameSite='none' and Secure=true to accept cookies.
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks
    sameSite: isProd ? "none" : "lax", // none for cross-site in production
    secure: isProd, // must be true in prod for SameSite='none'
    // path and domain left default; set `domain` only if you need cross-subdomain cookies
  });
}

export {generateToken};