import express from "express";
import authRoutes from './routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/auth',authRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);

})
