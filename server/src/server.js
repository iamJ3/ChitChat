import express from "express";
import authRoutes from './routes/auth.route.js';
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";

const app = express();
dotenv.config()
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
    connectDb()
})
