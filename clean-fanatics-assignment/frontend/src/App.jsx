import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("app"); // app | admin

  const [bookingId, setBookingId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [adminStatus, setAdminStatus] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  /* ---------- Notification ---------- */
  const showMessage = (msg, msgType = "success") => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => {
      setMessage("");
      setType("");
    }, 3000);
  };

  /* ================= CUSTOMER ================= */

  const createBooking = async () => {
    try {
      const res = await axios.post("http://localhost:5000/bookings", {
        customerName: "Harsh",
        serviceType: "Cleaning",
      });
      setBookingId(res.data._id);
      showMessage("Booking created successfully");
    } catch {
      showMessage("Failed to create booking", "error");
    }
  };

  const assignProvider = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/bookings/${bookingId}/assign`
      );
      setProviderId(res.data.providerId);
      showMessage("Provider assigned");
    } catch {
      showMessage("Assign provider failed", "error");
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.patch(
        `http://localhost:5000/bookings/${bookingId}/status`,
        { status }
      );
      showMessage(`Booking ${status.toLowerCase()}`);
    } catch {
      showMessage("Status update failed", "error");
    }
  };

  const cancelBooking = async () => {
    try {
      await axios.post(
        `http://localhost:5000/bookings/${bookingId}/cancel`
      );
      showMessage("Booking cancelled");
    } catch {
      showMessage("Cancel failed", "error");
    }
  };

  /* ================= PROVIDER ================= */

  const viewAssignedBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/providers/${providerId}/bookings`
      );
      setAssignedBookings(res.data);
      showMessage("Assigned bookings loaded");
    } catch {
      showMessage("Fetch failed", "error");
    }
  };

  /* ================= ADMIN ================= */

  const loadAllBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/bookings");
      setAllBookings(res.data);
    } catch {
      showMessage("Failed to load bookings", "error");
    }
  };

  const adminOverride = async (id) => {
    if (!adminStatus) {
      showMessage("Select a status", "error");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/admin/bookings/${id}/override`,
        { status: adminStatus }
      );
      showMessage("Admin override successful");
      loadAllBookings();
    } catch {
      showMessage("Override failed", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "admin") loadAllBookings();
  }, [activeTab]);

  return (
    <div className="container">
      <div className="card">
        <h1>Clean Fanatics</h1>

        {/* ---------- Tabs ---------- */}
        <div className="tabs">
          <button
            className={activeTab === "app" ? "active" : ""}
            onClick={() => setActiveTab("app")}
          >
            Booking App
          </button>

          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => setActiveTab("admin")}
          >
            Admin / Ops Panel
          </button>
        </div>

        {message && <div className={`notification ${type}`}>{message}</div>}

        {/* ================= MAIN APP TAB ================= */}
        {activeTab === "app" && (
          <>
            <h3>Customer Actions</h3>

            <button onClick={createBooking}>Create Booking</button>

            <input
              placeholder="Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />

            <div className="actions">
              <button onClick={assignProvider}>Assign Provider</button>
              <button onClick={() => updateStatus("IN_PROGRESS")}>
                Start
              </button>
              <button onClick={() => updateStatus("COMPLETED")}>
                Complete
              </button>
              <button className="danger" onClick={cancelBooking}>
                Cancel
              </button>
            </div>

            <h3>Provider Dashboard</h3>

            <input
              placeholder="Provider ID"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
            />

            <button onClick={viewAssignedBookings}>
              View Assigned Bookings
            </button>

            {assignedBookings.map((b) => (
              <div key={b._id} className="list-item">
                <b>ID:</b> {b._id} <br />
                <b>Status:</b> {b.status}
              </div>
            ))}
          </>
        )}

        {/* ================= ADMIN TAB ================= */}
        {activeTab === "admin" && (
          <>
            <h3>Admin / Ops Panel</h3>

            {allBookings.map((b) => (
              <div key={b._id} className="list-item admin">
                <b>ID:</b> {b._id} <br />
                <b>Customer:</b> {b.customerName} <br />
                <b>Status:</b> {b.status}

                <div className="admin-actions">
                  <select onChange={(e) => setAdminStatus(e.target.value)}>
                    <option value="">Change Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <button onClick={() => adminOverride(b._id)}>
                    Override
                  </button>
                </div>

                {b.history?.length > 0 && (
                  <ul className="history">
                    {b.history.map((h, i) => (
                      <li key={i}>
                        {h.previousStatus} → {h.newStatus} ({h.actionBy})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
