import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getImageSrc } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [listing, setListing] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const load = async () => {
    const { data } = await api.get(`/listings/${id}`);
    setListing(data);
    const a = await api.get(`/bookings/listing/${id}/active`);
    setIsBooked(a.data.isBooked);
    const fb = await api.get(`/feedback/listing/${id}`);
    setFeedback(fb.data);
  };
  useEffect(() => { load(); }, [id]);

  const book = async () => {
    if (!user) return nav("/login");
    if (user.role !== "guest") return Swal.fire({ icon: "info", title: "Only guests can book." });
    if (!checkIn || !checkOut) return Swal.fire({ icon: "warning", title: "Choose dates" });
    try {
      await api.post("/bookings", { listingId: id, checkIn, checkOut });
      Swal.fire({ icon: "success", title: "Booked!", text: "View it under My Bookings.", timer: 1500, showConfirmButton: false });
      nav("/my-bookings");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Booking failed", text: e.response?.data?.message || e.message });
    }
  };

  if (!listing) return <div className="container" style={{ paddingTop: 40 }}>Loading...</div>;
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h1>{listing.title}</h1>
      <p style={{ color: "#666", marginBottom: 4 }}>{listing.location} · {listing.category}</p>
      <p style={{ color: "#444", marginBottom: 16, fontSize: 15 }}>
        🏠 Hosted by <strong>{listing.owner?.name || "Unknown"}</strong>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8, marginBottom: 20 }}>
        {(listing.images || []).map((img, i) => (
          <img key={i} src={getImageSrc(img)} alt="" style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 8 }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div>
          <h3>About</h3>
          <p style={{ color: "#444", margin: "8px 0 16px" }}>{listing.description}</p>
          <p>{listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms · {listing.guests} guests</p>
          <h3 style={{ marginTop: 20 }}>Amenities</h3>
          <div>{(listing.amenities || []).map((a, i) => <span key={i} className="amenity-chip">{a}</span>)}</div>

          <h3 style={{ marginTop: 24 }}>Reviews ({feedback.length})</h3>
          {feedback.length === 0 && <p style={{ color: "#666" }}>No reviews yet.</p>}
          {feedback.map((f) => (
            <div key={f._id} className="feedback-item">
              <strong>{f.guest?.name}</strong> · {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
              <p style={{ margin: "6px 0" }}>{f.comment}</p>
              {f.image && <img src={getImageSrc(f.image)} alt="" style={{ maxWidth: 200, borderRadius: 8 }} />}
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 18, height: "fit-content" }}>
          <h3>₹{listing.price} / night</h3>
          {isBooked ? (
            <p style={{ color: "#FF385C", marginTop: 12 }}><strong>Currently Booked</strong></p>
          ) : (
            <>
              <label className="label">Check-in</label>
              <input className="input" type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              <label className="label">Check-out</label>
              <input className="input" type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              <button className="btn" style={{ marginTop: 14, width: "100%" }} onClick={book}>Book Now</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
