// index.js
import express from 'express';
import connectToMongoDB from './lib/database.js';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoute.js";
import cors from 'cors';
import codeComponentRoutes from './routes/codeComponentRoute.js'
import webTemplateRoute from './routes/webTemplateRoute.js'
import bookMarkRoute from './routes/bookMarkRoute.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToMongoDB();

// Enable CORS
app.use(cors());

// ******************************** Define DevNexus routes and middleware here ******************************** //

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
        <h1>Welcome to my DevNexus Server</h1>
      </div>
    `);
});

// users routes
app.use('/api/users', userRoutes);

// Code-Comp routes
app.use('/api/code-components', codeComponentRoutes);

// Bookmark Code-Comp routes
app.use('/api/bookmark', bookMarkRoute);

// Template routes
app.use('/api/web-templates', webTemplateRoute);

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
