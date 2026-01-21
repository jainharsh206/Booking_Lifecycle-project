const mongoose = require("mongoose");

const BookingLogSchema = new mongoose.Schema({
  bookingId: mongoose.Schema.Types.ObjectId,
  previousStatus: String,
  newStatus: String,
  actionBy: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BookingLog", BookingLogSchema);
