import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { getImageSrc } from "../utils/api.js";

export default function ListingCard({ listing }) {
  const [isBooked, setIsBooked] = useState(false);
  useEffect(() => {
    api.get(`/bookings/listing/${listing._id}/active`).then((r) => setIsBooked(r.data.isBooked)).catch(() => {});
  }, [listing._id]);
  const img = getImageSrc(listing.images?.[0]);
  return (
    <Link to={`/listing/${listing._id}`}>
      <div className="card" style={{ position: "relative" }}>
        {isBooked && <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }} className="badge">BOOKED</div>}
        <img src={img} alt={listing.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
        <div style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{listing.title}</strong>
            <span className="badge-gray">{listing.category}</span>
          </div>
          <div style={{ color: "#666", fontSize: 14, margin: "6px 0" }}>{listing.location}</div>
          <div style={{ fontSize: 13, color: "#666" }}>{listing.bedrooms} bed · {listing.bathrooms} bath · {listing.guests} guests</div>
          <div style={{ marginTop: 8 }}><strong>₹{listing.price}</strong> / night</div>
        </div>
      </div>
    </Link>
  );
}
