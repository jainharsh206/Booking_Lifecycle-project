const express = require("express");
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");
const BookingLog = require("../models/BookingLog");

const router = express.Router();

// Create Booking
router.post("/", async (req, res) => {
  const booking = await Booking.create(req.body);
  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: null,
    newStatus: "PENDING",
    actionBy: "customer"
  });
  res.json(booking);
});

// Provider rejects booking / no-show
router.post("/:id/reject", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const prev = booking.status;

  booking.status = "FAILED";
  booking.retryCount = (booking.retryCount || 0) + 1;
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: prev,
    newStatus: "FAILED",
    actionBy: "provider"
  });

  //  THIS IS WHERE YOU CALL IT
  await retryAssignment(booking);

  res.json({
    message: "Booking rejected. Retry attempted if provider available."
  });
});


// Assign Provider
router.post("/:id/assign", async (req, res) => {
  const provider = await Provider.findOne({ isAvailable: true });
  if (!provider) {
    return res.status(400).json({ message: "No provider available" });
  }

  const booking = await Booking.findById(req.params.id);
  booking.providerId = provider._id;
  booking.status = "ASSIGNED";
  await booking.save();

  provider.isAvailable = false;
  await provider.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: "PENDING",
    newStatus: "ASSIGNED",
    actionBy: "system"
  });

  // 🔥 RETURN providerId
  res.json({
    booking,
    providerId: provider._id
  });
});


// Update Status
router.patch("/:id/status", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const validTransitions = {
    ASSIGNED: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"]
  };

  const current = booking.status;
  const next = req.body.status;

  if (!validTransitions[current]?.includes(next)) {
    return res.status(400).json({
      message: `Invalid transition from ${current} to ${next}`
    });
  }

  booking.status = next;
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: current,
    newStatus: next,
    actionBy: "provider"
  });

  res.json(booking);
});


// Cancel Booking
router.post("/:id/cancel", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const prev = booking.status;

  booking.status = "CANCELLED";
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: prev,
    newStatus: "CANCELLED",
    actionBy: "customer"
  });

  res.json(booking);
});


// View Logs
router.get("/:id/logs", async (req, res) => {
  const logs = await BookingLog.find({ bookingId: req.params.id });
  res.json(logs);
});

router.patch("/:id/status", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const validTransitions = {
    ASSIGNED: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"]
  };

  const current = booking.status;
  const next = req.body.status;

  if (!validTransitions[current]?.includes(next)) {
    return res.status(400).json({
      message: `Invalid transition from ${current} to ${next}`
    });
  }

  booking.status = next;
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: current,
    newStatus: next,
    actionBy: "provider"
  });

  res.json(booking);
});
async function retryAssignment(booking) {
  if (booking.retryCount >= 3) return;

  const provider = await Provider.findOne({ isAvailable: true });
  if (!provider) return;

  booking.providerId = provider._id;
  booking.status = "ASSIGNED";
  await booking.save();

  await BookingLog.create({
    bookingId: booking._id,
    previousStatus: "FAILED",
    newStatus: "ASSIGNED",
    actionBy: "system-retry"
  });
}



module.exports = router;
