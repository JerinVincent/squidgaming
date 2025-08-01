const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// GET all slots
router.get('/', async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
});

// GET single slot
router.get('/:id', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new slot
router.post('/', async (req, res) => {
  const { time, price } = req.body;
  const slot = new Slot({ time, price });
  await slot.save();
  res.status(201).json(slot);
});

// Add this to create default slots
router.post("/create-default-slots", async (req, res) => {
  try {
    const slots = [];
    const times = [
      "9 AM - 10 AM",
      "10 AM - 11 AM",
      "11 AM - 12 PM",
      "12 PM - 1 PM",
      "1 PM - 2 PM",
      "2 PM - 3 PM",
      "3 PM - 4 PM",
      "4 PM - 5 PM",
      "5 PM - 6 PM",
      "6 PM - 7 PM",
      "7 PM - 8 PM",
      "8 PM - 9 PM"
    ];

    for (const time of times) {
      slots.push({ time, price: 100 });
    }

    const result = await Slot.insertMany(slots);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating slots" });
  }
});

// PUT to book a slot with user info
router.put('/:id/book', async (req, res) => {
  const { name, phone } = req.body;
  const slot = await Slot.findByIdAndUpdate(
    req.params.id,
    {
      isBooked: true,
      bookedBy: { name, phone }
    },
    { new: true }
  );
  res.json(slot);
});

// PATCH to book a slot without user info
router.patch('/:id/book', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Save user details from frontend
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    slot.isBooked = true;
    slot.bookedBy = { name, phone }; // save to the slot
    await slot.save();

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE a slot
router.delete('/:id', async (req, res) => {
  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a booking
router.post('/cancel/:id', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    slot.isBooked = false;
    slot.bookedBy = { name: "", phone: "" };
    await slot.save();

    res.json({ message: 'Booking cancelled', slot });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
