import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getImageSrc } from "../utils/api.js";
import Swal from "sweetalert2";

export default function OwnerDashboard() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbackByListing, setFeedbackByListing] = useState({});
  const nav = useNavigate();

  const load = async () => {
    const [l, b] = await Promise.all([api.get("/listings/owner/mine"), api.get("/bookings/owner")]);
    setListings(l.data);
    setBookings(b.data);
    const fbMap = {};
    await Promise.all(l.data.map(async (lst) => {
      const r = await api.get(`/feedback/listing/${lst._id}`);
      fbMap[lst._id] = r.data;
    }));
    setFeedbackByListing(fbMap);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    const ok = await Swal.fire({ title: "Delete this listing?", icon: "warning", showCancelButton: true, confirmButtonColor: "#FF385C" });
    if (!ok.isConfirmed) return;
    await api.delete(`/listings/${id}`);
    Swal.fire({ icon: "success", title: "Deleted", timer: 1000, showConfirmButton: false });
    load();
  };

  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + (b.totalPrice || 0), 0);
  const activeBookings = bookings.filter(b => b.status === "booked").length;

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2>Owner Dashboard</h2>
      <div className="grid grid-3" style={{ margin: "16px 0 24px" }}>
        <div className="card" style={{ padding: 16 }}><div style={{ color: "#666" }}>Listings</div><h2>{listings.length}</h2></div>
        <div className="card" style={{ padding: 16 }}><div style={{ color: "#666" }}>Active Bookings</div><h2>{activeBookings}</h2></div>
        <div className="card" style={{ padding: 16 }}><div style={{ color: "#666" }}>Revenue</div><h2>₹{totalRevenue}</h2></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3>My Listings</h3>
        <Link to="/add-listing"><button className="btn">+ Add Listing</button></Link>
      </div>
      <div className="grid grid-3">
        {listings.map((l) => {
          const fbs = feedbackByListing[l._id] || [];
          const img = getImageSrc(l.images?.[0]);
          return (
            <div key={l._id} className="card">
              <img src={img} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} />
              <div style={{ padding: 14 }}>
                <strong>{l.title}</strong>
                <div style={{ color: "#666", fontSize: 13 }}>{l.location} · ₹{l.price}/night</div>
                <div style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>{l.bedrooms} bed · {l.bathrooms} bath</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="btn-outline" onClick={() => nav(`/edit-listing/${l._id}`)}>Edit</button>
                  <button className="btn" onClick={() => remove(l._id)}>Delete</button>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong style={{ fontSize: 13 }}>Reviews ({fbs.length})</strong>
                  {fbs.slice(0, 2).map(f => (
                    <div key={f._id} style={{ marginTop: 6, fontSize: 13, borderTop: "1px solid #eee", paddingTop: 6 }}>
                      <div>{"★".repeat(f.rating)} <span style={{ color: "#666" }}>by {f.guest?.name}</span></div>
                      <div style={{ color: "#444" }}>{f.comment}</div>
                      {f.image && <img src={getImageSrc(f.image)} alt="" style={{ width: 80, marginTop: 4, borderRadius: 4 }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {listings.length === 0 && <p>No listings yet. Add one!</p>}
      </div>
    </div>
  );
}
