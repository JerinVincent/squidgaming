import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/slots')
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, []);

  const cancelBooking = async (id) => {
await axios.post(`http://localhost:5000/api/slots/cancel/${slotId}`);

    const updated = await axios.get('http://localhost:5000/api/slots');
    setSlots(updated.data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel - Slot Overview</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Time</th>
            <th>Status</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot._id}>
              <td>{slot.time}</td>
              <td>{slot.isBooked ? 'Booked' : 'Available'}</td>
              <td>{slot.bookedBy?.name || '-'}</td>
              <td>{slot.bookedBy?.phone || '-'}</td>
              <td>
                {slot.isBooked && (
                  <button onClick={() => cancelBooking(slot._id)}>Cancel Booking</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
