// lib/database.js
import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo DB connection is successful!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);m 
    throw new Error('Error connecting to MongoDB.');
  }
};

export default connectToMongoDB;
