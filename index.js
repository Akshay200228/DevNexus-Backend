// index.js
import express from 'express';
import connectToMongoDB from './lib/database.js';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToMongoDB();

// Define your routes and middleware here
// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use('/users', userRoutes);

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
