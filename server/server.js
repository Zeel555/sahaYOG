require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const app = express();
const mongoURI = process.env.MONGO_URI;
console.log("🔗 Connecting to:", mongoURI);
if (!mongoURI) {
  throw new Error('❌ MONGO_URI not found in .env!');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// MongoDB connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));
