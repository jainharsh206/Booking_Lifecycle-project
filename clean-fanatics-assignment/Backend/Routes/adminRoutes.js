const express = require("express");
const Booking = require("../models/Booking");
const BookingLog = require("../models/BookingLog");

const router = express.Router();

/**
 * GET: Fetch all bookings (Admin / Ops view)
 */
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/**
 * PATCH: Admin override booking status
 */
router.patch("/bookings/:id/override", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const previousStatus = booking.status;

    booking.status = status;
    await booking.save();

    // Log admin override
    await BookingLog.create({
      bookingId: booking._id,
      previousStatus,
      newStatus: status,
      actionBy: "admin",
    });

    res.json({
      message: "Booking status overridden by admin",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Admin override failed" });
  }
});

/**
 * GET: Booking history / observability
 */
router.get("/bookings/:id/logs", async (req, res) => {
  try {
    const logs = await BookingLog.find({
      bookingId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(logs);
  } catch {
    res.status(500).json({ message: "Failed to fetch booking logs" });
  }
});

module.exports = router;
