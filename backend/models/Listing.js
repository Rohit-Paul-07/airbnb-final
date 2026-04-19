const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    location: String,
    price: { type: Number, required: true },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    guests: { type: Number, default: 2 },
    category: { type: String, default: "Villa" },
    amenities: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Listing", listingSchema);
