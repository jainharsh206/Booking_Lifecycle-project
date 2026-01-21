// AdminPanel.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/bookings")
      .then(res => setBookings(res.data));
  }, []);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/admin/booking/${id}/status`, { status })
      .then(() => window.location.reload());
  };

  return (
    <div>
      <h2>Admin / Ops Panel</h2>

      {bookings.map(b => (
        <div key={b._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><b>Customer:</b> {b.customerName}</p>
          <p><b>Status:</b> {b.status}</p>

          <select onChange={(e) => updateStatus(b._id, e.target.value)}>
            <option>Change Status</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
