import express from "express";
import authRoutes from './routes/auth.route.js';
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoutes from "./routes/messages.route.js";
import { io, server,app } from "./lib/socket.js";

const allowedOrigins = [
  "http://localhost:5173",
 process.env.CLIENT_URL,
];
dotenv.config()

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman, mobile apps, server-to-server (no origin)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")   // allow preview deployments
    ) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);


const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

server.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
    connectDb().catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
    
})
