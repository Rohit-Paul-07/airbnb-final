const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    age: { type: Number, required: true },
    aadhar: { type: String, required: true },
    pan: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["guest", "owner"], default: "guest" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
