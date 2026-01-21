const express = require("express");
const Booking = require("../models/Booking");
const BookingLog = require("../models/BookingLog");

const router = express.Router();

// Override booking state
router.patch("/bookings/:id/override", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  const prev = booking.status;

  booking.status = req.body.status;
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: prev,
    newStatus: req.body.status,
    actionBy: "admin"
  });

  res.json(booking);
});

module.exports = router;
