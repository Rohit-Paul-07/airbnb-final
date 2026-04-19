const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
    status: { type: String, enum: ["booked", "cancelled", "completed"], default: "booked" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", bookingSchema);
