const router = require("express").Router();
const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");
const { upload, uploadToCloudinary } = require("../middleware/upload");

router.post("/", auth, upload.single("image"), async (req, res) => {
  const { listingId, bookingId, rating, comment } = req.body;

  // Upload feedback image to Cloudinary if provided
  let imageUrl;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "airbnb-feedback");
    imageUrl = result.secure_url;
  }

  const fb = await Feedback.create({
    listing: listingId,
    booking: bookingId,
    guest: req.user.id,
    rating: Number(rating) || 5,
    comment,
    image: imageUrl,
  });
  res.json(fb);
});

router.get("/listing/:id", async (req, res) => {
  const items = await Feedback.find({ listing: req.params.id })
    .populate("guest", "name")
    .sort({ createdAt: -1 });
  res.json(items);
});

module.exports = router;
