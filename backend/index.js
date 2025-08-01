const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const slotRoutes = require('./routes/slotRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Root Route for homepage
app.get('/', (req, res) => {
  res.send('🕹️ PS5 Slot Booking Backend is Running!');
});

// API Routes
app.use('/api/slots', slotRoutes);

// Server Listener
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
