const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: String,
    image: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Feedback", feedbackSchema);
