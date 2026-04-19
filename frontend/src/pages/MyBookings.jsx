import { useEffect, useState } from "react";
import api, { getImageSrc } from "../utils/api.js";
import Swal from "sweetalert2";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [fbModal, setFbModal] = useState(null);
  const [fbForm, setFbForm] = useState({ rating: 5, comment: "", image: null });

  const load = async () => {
    const { data } = await api.get("/bookings/mine");
    setBookings(data);
  };
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    const ok = await Swal.fire({ title: "Cancel booking?", icon: "warning", showCancelButton: true });
    if (!ok.isConfirmed) return;
    await api.put(`/bookings/${id}/cancel`);
    load();
  };

  const checkout = async (b) => {
    await api.put(`/bookings/${b._id}/checkout`);
    Swal.fire({ icon: "success", title: "Checked out", timer: 1000, showConfirmButton: false });
    setFbModal(b);
    setFbForm({ rating: 5, comment: "", image: null });
    load();
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("listingId", fbModal.listing._id);
    fd.append("bookingId", fbModal._id);
    fd.append("rating", fbForm.rating);
    fd.append("comment", fbForm.comment);
    if (fbForm.image) fd.append("image", fbForm.image);
    await api.post("/feedback", fd, { headers: { "Content-Type": "multipart/form-data" } });
    Swal.fire({ icon: "success", title: "Thanks for your feedback!", timer: 1200, showConfirmButton: false });
    setFbModal(null);
  };

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2>My Bookings</h2>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {bookings.map((b) => {
          const img = getImageSrc(b.listing?.images?.[0]);
          return (
            <div key={b._id} className="card">
              <img src={img} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} />
              <div style={{ padding: 14 }}>
                <strong>{b.listing?.title}</strong>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                </div>
                <div style={{ margin: "6px 0" }}>₹{b.totalPrice} · <span className="badge-gray">{b.status}</span></div>
                {b.status === "booked" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" onClick={() => cancel(b._id)}>Cancel</button>
                    <button className="btn" onClick={() => checkout(b)}>Checkout</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {bookings.length === 0 && <p>No bookings yet.</p>}
      </div>

      {fbModal && (
        <div className="modal-overlay" onClick={() => setFbModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave Feedback for {fbModal.listing?.title}</h3>
            <form onSubmit={submitFeedback}>
              <label className="label">Rating</label>
              <select className="input" value={fbForm.rating} onChange={(e) => setFbForm({ ...fbForm, rating: e.target.value })}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
              </select>
              <label className="label">Comment</label>
              <textarea className="input" rows={3} value={fbForm.comment} onChange={(e) => setFbForm({ ...fbForm, comment: e.target.value })} />
              <label className="label">Upload Image</label>
              <input className="input" type="file" accept="image/*" onChange={(e) => setFbForm({ ...fbForm, image: e.target.files[0] })} />
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button type="button" className="btn-outline" onClick={() => setFbModal(null)}>Skip</button>
                <button type="submit" className="btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
