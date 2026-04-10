const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('🔍 Connecting to MongoDB...');
  console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name   : ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
