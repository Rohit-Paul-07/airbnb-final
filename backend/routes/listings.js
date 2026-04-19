const router = require("express").Router();
const Listing = require("../models/Listing");
const auth = require("../middleware/auth");
const { upload, uploadToCloudinary } = require("../middleware/upload");

// Helper: upload all files in req.files to Cloudinary, return array of secure_urls
const uploadImages = async (files) => {
  if (!files || files.length === 0) return [];
  const results = await Promise.all(
    files.map((f) => uploadToCloudinary(f.buffer, "airbnb-listings"))
  );
  return results.map((r) => r.secure_url);
};

// GET all listings (with filters)
router.get("/", async (req, res) => {
  const { location, minPrice, maxPrice, bedrooms, guests, category } = req.query;
  const q = {};
  if (location) q.location = { $regex: location, $options: "i" };
  if (category && category !== "All") q.category = category;
  if (bedrooms) q.bedrooms = { $gte: Number(bedrooms) };
  if (guests) q.guests = { $gte: Number(guests) };
  if (minPrice || maxPrice) {
    q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
  }
  const listings = await Listing.find(q).populate("owner", "name email");
  res.json(listings);
});

// GET owner's own listings
router.get("/owner/mine", auth, async (req, res) => {
  const listings = await Listing.find({ owner: req.user.id });
  res.json(listings);
});

// GET single listing (with owner name)
router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner", "name email");
  if (!listing) return res.status(404).json({ message: "Not found" });
  res.json(listing);
});

// POST create listing — images go to Cloudinary
router.post("/", auth, upload.array("images", 6), async (req, res) => {
  if (req.user.role !== "owner")
    return res.status(403).json({ message: "Only owners can add listings" });

  const { title, description, location, price, bedrooms, bathrooms, guests, category, amenities } = req.body;

  // Upload images to Cloudinary
  const images = await uploadImages(req.files);

  const parsedAmenities = amenities
    ? Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const listing = await Listing.create({
    owner: req.user.id,
    title, description, location,
    price: Number(price),
    bedrooms: Number(bedrooms) || 1,
    bathrooms: Number(bathrooms) || 1,
    guests: Number(guests) || 2,
    category: category || "Villa",
    amenities: parsedAmenities,
    images, // Cloudinary secure_urls
  });
  res.json(listing);
});

// PUT update listing — new images appended via Cloudinary
router.put("/:id", auth, upload.array("images", 6), async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Not found" });
  if (String(listing.owner) !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  const { title, description, location, price, bedrooms, bathrooms, guests, category, amenities } = req.body;
  if (title) listing.title = title;
  if (description !== undefined) listing.description = description;
  if (location) listing.location = location;
  if (price) listing.price = Number(price);
  if (bedrooms) listing.bedrooms = Number(bedrooms);
  if (bathrooms) listing.bathrooms = Number(bathrooms);
  if (guests) listing.guests = Number(guests);
  if (category) listing.category = category;
  if (amenities)
    listing.amenities = Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((s) => s.trim()).filter(Boolean);

  // Upload new images to Cloudinary and append
  if (req.files && req.files.length) {
    const newUrls = await uploadImages(req.files);
    listing.images = [...listing.images, ...newUrls];
  }

  await listing.save();
  res.json(listing);
});

// DELETE listing
router.delete("/:id", auth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Not found" });
  if (String(listing.owner) !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  await listing.deleteOne();
  res.json({ message: "Deleted" });
});

module.exports = router;
