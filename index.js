// index.js
import express from 'express';
import connectToMongoDB from './lib/database.js';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoute.js";
import cors from 'cors';
import codeComponentRoutes from './routes/codeComponentRoute.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToMongoDB();

// Enable CORS
app.use(cors());

// Define your routes and middleware here
// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/code-components', codeComponentRoutes);

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
