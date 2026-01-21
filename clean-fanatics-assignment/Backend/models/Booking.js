const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    customerName: String,
    serviceType: String,

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "FAILED",
      ],
      default: "PENDING",
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    // 🔹 Booking lifecycle history (Observability)
    history: [
      {
        previousStatus: String,
        newStatus: String,
        actionBy: {
          type: String,
          enum: ["customer", "provider", "admin", "system"],
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/**
 * Helper method to log status changes
 */
BookingSchema.methods.addHistory = function (
  previousStatus,
  newStatus,
  actionBy
) {
  this.history.push({
    previousStatus,
    newStatus,
    actionBy,
  });
};

module.exports = mongoose.model("Booking", BookingSchema);
