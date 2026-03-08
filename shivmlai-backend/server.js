const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://shivmlaiproject.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'ShivMLAI Backend Running' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════');
  console.log(`   ShivMLAI Backend is RUNNING`);
  console.log(`   Port : ${PORT}`);
  console.log(`   Mode : ${process.env.NODE_ENV}`);
  console.log('   ═══════════════════════════════════════');
  console.log('');
});