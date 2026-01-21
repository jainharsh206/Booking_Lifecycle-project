const express = require("express");
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");
const BookingLog = require("../models/BookingLog");

const router = express.Router();

// View assigned bookings
router.get("/:providerId/bookings", async (req, res) => {
  const bookings = await Booking.find({ providerId: req.params.providerId });
  res.json(bookings);
});

// Accept booking
router.post("/bookings/:id/accept", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  const prev = booking.status;

  booking.status = "IN_PROGRESS";
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: prev,
    newStatus: "IN_PROGRESS",
    actionBy: "provider"
  });

  res.json({ message: "Booking accepted" });
});

// Reject / no-show
router.post("/bookings/:id/reject", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  const prev = booking.status;

  booking.status = "FAILED";
  booking.retryCount += 1;
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: prev,
    newStatus: "FAILED",
    actionBy: "provider"
  });

  res.json({ message: "Booking rejected / no-show" });
});

router.get("/:providerId/bookings", async (req, res) => {
  const bookings = await Booking.find({
    providerId: req.params.providerId
  });

  console.log("Provider:", req.params.providerId);
  console.log("Bookings found:", bookings.length);

  res.json(bookings);
});

module.exports = router;
