const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try connecting with different host formats
    const uri = process.env.MONGODB_URI.replace('localhost', '127.0.0.1');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for setup');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
};

// Define User schema
const userSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    age: Number
});

// Create User model
const User = mongoose.model('User', userSchema, 'users');

// Test users
const testUsers = [
    { _id: 1, name: 'Inmon John', email: 'inmon.j.213515@gmail.com', age: 35 },
    { _id: 2, name: 'John Smith', email: 'jane@gmail.com', age: 25 },
    { _id: 3, name: 'Smith Gupta', email: 'bob@gmail.com', age: 19 },
    { _id: 4, name: 'Gupta Garena', email: 'alice@gmail.com', age: 22 }
];

async function setupDatabase() {
  const connected = await connectDB();
  if (!connected) {
    console.log('Could not connect to MongoDB. Setup failed.');
    process.exit(1);
  }
  
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Insert test users
    const result = await User.insertMany(testUsers);
    
    console.log(`Added ${result.length} users to the database`);
    console.log('User IDs for testing:');
    result.forEach(user => {
      console.log(`${user.name} (age: ${user.age}):`);
      console.log(`- userId: ${user._id}`);
      console.log(`- _id: ${user._id}`);
    });
    
    console.log('\nTest commands:');
    console.log(`curl http://localhost:3000/users/1  # Should return John (age > 21)`);
    console.log(`curl http://localhost:3000/users/3  # Should return 404 (age < 21)`);
    
    await mongoose.disconnect();
    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

setupDatabase();