const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  time: String,
  price: Number,
  isBooked: {
    type: Boolean,
    default: false
  },
  
  bookedBy: {
    name: String,
    phone: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
