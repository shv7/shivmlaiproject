const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('🔍 Connecting to MongoDB...');
  console.log('🔍 MONGO_URI exists:', !!process.env.MONGO_URI);
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name   : ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## ✅ Fix 2 — Check Railway Root Directory

Go to Railway → Service → **Settings** tab → find **"Root Directory"**

Make sure it says:
```
backend