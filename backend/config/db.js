const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name   : ${conn.connection.name}`);
  } catch (error) {
    console.error('⚠️  MongoDB not connected - running in offline mode');
    console.log('💡 DB will connect when deployed to Render');
    // Don't exit - keep server running
  }
};

module.exports = connectDB;