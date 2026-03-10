const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://master-ledger-1w.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send("Master Ledger Backend Running");
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Connected to Master Ledger DB"))
.catch(err => console.error("❌ DB Error:", err));

// IMPORTANT: Export the app for Vercel
module.exports = app;

// Run locally only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}