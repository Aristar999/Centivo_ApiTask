const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize application
const app = express();
app.use(express.json());

// Try connecting to different hosts
const connectDB = async () => {
  try {
    // Try connecting with different host formats
    const uri = process.env.MONGODB_URI.replace('localhost', '127.0.0.1');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit so server can still run
    console.log('Server will continue running, but database functionality will be limited');
  }
};

// Connect to MongoDB
connectDB();

// Define User schema
const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: String,
  age: Number
});

// Create User model
const User = mongoose.model('User', userSchema, 'users');

// Check endpoint health
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Implement GET endpoint
app.get('/users/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    console.log(`Received request for user ID: ${idParam}`);

    // First try to use it as a numeric userId
    const numericId = parseInt(idParam);
    let user = null;

    if (!isNaN(numericId)) {
      // If it's a valid number, query by userId
      console.log(`Looking up by numeric userId: ${numericId}`);
      user = await User.findOne({ 
        _id: numericId,
        age: { $gt: 21 }
      });
    } else if (mongoose.Types.ObjectId.isValid(idParam)) {
      // If it's a valid ObjectId, query by _id
      console.log(`Looking up by ObjectId: ${idParam}`);
      user = await User.findOne({ 
        _id: idParam,
        age: { $gt: 21 }
      });
    } else {
      console.log(`Invalid ID format: ${idParam}`);
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Return 404 if user is not found
    if (!user) {
      return res.status(404).json({ error: 'User not found or age requirement not met' });
    }

    // Return user data
    return res.json(user);
    
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message
    });
  }
});

// Start the server on all interfaces
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access via: http://localhost:${PORT} or http://127.0.0.1:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});