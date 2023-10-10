// index.js
import express from 'express';
import connectToMongoDB from './lib/database.js';
import dotenv from 'dotenv'; 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToMongoDB();

// Define your routes and middleware here

app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
