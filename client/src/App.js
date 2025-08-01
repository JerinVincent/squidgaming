import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ Use your deployed backend URL
  const BASE_URL = "https://squidgaming-1b7k.onrender.com";

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/slots`);
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      alert("Unable to load slots. Please try again later.");
    }
  };

  const handleBook = async (slotId) => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number");
      return;
    }

    try {
      const res = await axios.patch(`${BASE_URL}/api/slots/${slotId}/book`, {
        name,
        phone
      });

      alert("Slot booked successfully!\nPlease pay via UPI to confirm.");
      fetchSlots(); // refresh slots
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1 className="title">🎮 PS5 Slot Booking</h1>

      <div className="form-section">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="upi-section">
        <h3>📲 Pay via Google Pay</h3>
        {/* ✅ Make sure this image exists in public/ as upi-qr.png.jpg */}
        <img src="/upi-qr.png.jpg" alt="UPI QR" className="qr" />
        <p>UPI ID: <strong>jerinvicent05-1@okicici</strong></p>
        <p>⚠️ Payment should be done immediately after booking.</p>
      </div>

      <ul className="slot-list">
        {slots.length === 0 ? (
          <p>Loading slots...</p>
        ) : (
          slots.map((slot) => (
            <li key={slot._id} className={`slot-item ${slot.isBooked ? "booked" : ""}`}>
              <div>
                <strong>{slot.time}</strong> — ₹{slot.price}
              </div>
              {slot.isBooked ? (
                <span className="booked-label">Booked</span>
              ) : (
                <button onClick={() => handleBook(slot._id)}>Book & Pay</button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
