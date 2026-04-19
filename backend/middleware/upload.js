const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary using env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memoryStorage so files are held in buffer (not saved to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * uploadToCloudinary(buffer, folder)
 * Streams a buffer into Cloudinary and returns the upload result.
 */
const uploadToCloudinary = (buffer, folder = "airbnb-listings") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary };
