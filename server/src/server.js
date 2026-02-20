import express from "express";
import authRoutes from './routes/auth.route.js';
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import messageRoutes from "./routes/message.route.js";

const app = express();

dotenv.config()
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
    connectDb().catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
    
})
