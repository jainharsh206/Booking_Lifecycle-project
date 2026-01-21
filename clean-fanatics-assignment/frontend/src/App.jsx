import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [bookingId, setBookingId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error

  // ---------- Notification helper ----------
  const showMessage = (msg, msgType = "success") => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => {
      setMessage("");
      setType("");
    }, 3000);
  };

  // ---------- Customer actions ----------
  const createBooking = async () => {
    try {
      const res = await axios.post("http://localhost:5000/bookings", {
        customerName: "Harsh",
        serviceType: "Cleaning"
      });
      setBookingId(res.data._id);
      showMessage("Booking created successfully ✅");
    } catch {
      showMessage("Failed to create booking ❌", "error");
    }
  };

  const assignProvider = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/bookings/${bookingId}/assign`
      );

      if (res.data.message) {
        showMessage(res.data.message, "error");
        return;
      }

      // auto-fill providerId returned from backend
      setProviderId(res.data.providerId);
      showMessage("Provider assigned successfully ✅");
    } catch {
      showMessage("Assign provider failed ❌", "error");
    }
  };

  const startBooking = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/bookings/${bookingId}/status`,
        { status: "IN_PROGRESS" }
      );
      showMessage("Booking started 🚀");
    } catch (err) {
      showMessage(err.response?.data?.message || "Start failed ❌", "error");
    }
  };

  const completeBooking = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/bookings/${bookingId}/status`,
        { status: "COMPLETED" }
      );
      showMessage("Booking completed 🎉");
    } catch (err) {
      showMessage(err.response?.data?.message || "Complete failed ❌", "error");
    }
  };

  const cancelBooking = async () => {
    try {
      await axios.post(
        `http://localhost:5000/bookings/${bookingId}/cancel`
      );
      showMessage("Booking cancelled ⚠️");
    } catch {
      showMessage("Cancel failed ❌", "error");
    }
  };

  // ---------- Provider workflow ----------
  const viewAssignedBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/providers/${providerId}/bookings`
      );
      setAssignedBookings(res.data);
      showMessage("Assigned bookings loaded ✅");
    } catch {
      showMessage("Failed to fetch assigned bookings ❌", "error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Clean Fanatics</h1>
        <p className="subtitle">Booking Lifecycle Demo</p>

        {/* Notification */}
        {message && (
          <div className={`notification ${type}`}>{message}</div>
        )}

        {/* ================= CUSTOMER SECTION ================= */}
        <h3>Customer Actions</h3>

        <button className="primary" onClick={createBooking}>
          Create Booking
        </button>

        <input
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />

        <div className="actions">
          <button onClick={assignProvider}>Assign Provider</button>
          <button onClick={startBooking}>Start Booking</button>
          <button onClick={completeBooking}>Complete Booking</button>
          <button className="danger" onClick={cancelBooking}>
            Cancel Booking
          </button>
        </div>

        {/* ================= PROVIDER SECTION ================= */}
        <h3>Provider Dashboard</h3>

        <input
          placeholder="Provider ID"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
        />

        <button onClick={viewAssignedBookings}>
          View Assigned Bookings
        </button>

        {/* Assigned bookings list */}
        <h3>Assigned Bookings</h3>

        {assignedBookings.length === 0 ? (
          <p style={{ color: "#666", fontSize: "14px" }}>
            No bookings assigned to this provider.
          </p>
        ) : (
          <div className="list">
            {assignedBookings.map((b) => (
              <div key={b._id} className="list-item">
                <strong>Booking ID:</strong> {b._id}
                <br />
                <strong>Customer:</strong> {b.customerName}
                <br />
                <strong>Service:</strong> {b.serviceType}
                <br />
                <strong>Status:</strong> {b.status}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
