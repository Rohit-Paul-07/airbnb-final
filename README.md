# Airbnb Clone (MERN + Vite)

## Setup

### Backend
```bash
cd backend
npm install
```

**Configure `.env`** — open `backend/.env` and fill in your Cloudinary credentials:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Get these from https://cloudinary.com/console (free account works fine).

```bash
npm run dev   # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

## Features
- Guest / Owner registration (Aadhar, PAN, age ≥ 18)
- Owner: add/edit/delete listings with images, amenities, bathrooms
- **Cloudinary image upload** — images are uploaded to Cloudinary CDN; `secure_url` stored in DB
- **Listing detail shows owner name** (Hosted by ...)
- Search & filter by location, price, bedrooms, guests, category
- Booking with date picker (past dates disabled)
- "BOOKED" badge overlay on occupied listings
- Guest cancel / checkout; feedback modal opens automatically after checkout
- Reviews shown on listing detail and owner dashboard
- Owner dashboard with revenue & booking stats

## Architecture: Image Upload Flow
1. Owner selects images on Add/Edit Listing form
2. Frontend sends multipart/form-data to `/api/listings`
3. Backend receives files via Multer (memoryStorage — no disk writes)
4. Each file buffer is streamed to Cloudinary via `cloudinary.uploader.upload_stream`
5. Cloudinary returns `secure_url` (e.g. `https://res.cloudinary.com/...`)
6. URLs are stored in MongoDB `images[]` array
7. Frontend renders images directly from Cloudinary CDN
