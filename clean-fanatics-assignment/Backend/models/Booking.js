const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customerName: String,
  serviceType: String,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  status: {
    type: String,
    enum: ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "FAILED"],
    default: "PENDING"
  },
  retryCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
