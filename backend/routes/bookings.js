const router = require("express").Router();
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { listingId, checkIn, checkOut } = req.body;
  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  const active = await Booking.findOne({ listing: listingId, status: "booked" });
  if (active) return res.status(400).json({ message: "This listing is already booked" });
  const ci = new Date(checkIn), co = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((co - ci) / (1000 * 60 * 60 * 24)));
  const booking = await Booking.create({
    listing: listingId, guest: req.user.id,
    checkIn: ci, checkOut: co,
    totalPrice: nights * listing.price, status: "booked",
  });
  res.json(booking);
});

router.get("/mine", auth, async (req, res) => {
  const bookings = await Booking.find({ guest: req.user.id }).populate("listing");
  res.json(bookings);
});

router.get("/owner", auth, async (req, res) => {
  const listings = await Listing.find({ owner: req.user.id }).select("_id");
  const ids = listings.map((l) => l._id);
  const bookings = await Booking.find({ listing: { $in: ids } }).populate("listing").populate("guest", "name email");
  res.json(bookings);
});

router.get("/listing/:id/active", async (req, res) => {
  const active = await Booking.findOne({ listing: req.params.id, status: "booked" });
  res.json({ isBooked: !!active });
});

router.put("/:id/cancel", auth, async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Not found" });
  if (String(b.guest) !== req.user.id) return res.status(403).json({ message: "Forbidden" });
  b.status = "cancelled";
  await b.save();
  res.json(b);
});

router.put("/:id/checkout", auth, async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Not found" });
  if (String(b.guest) !== req.user.id) return res.status(403).json({ message: "Forbidden" });
  b.status = "completed";
  await b.save();
  res.json(b);
});

module.exports = router;
