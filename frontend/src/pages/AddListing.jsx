import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import Swal from "sweetalert2";

const CATEGORIES = ["Villa", "Apartment", "Cabin", "Beachfront", "Treehouse", "Tiny home", "Castle", "Lake", "Mountain", "Farm"];
const AMENITIES = ["Wifi", "Kitchen", "Air conditioning", "Heating", "TV", "Washer", "Pool", "Hot tub", "Free parking", "Gym", "BBQ grill", "Breakfast"];

export default function AddListing() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", location: "", price: "",
    bedrooms: 1, bathrooms: 1, guests: 2, category: "Villa",
  });
  const [amenities, setAmenities] = useState([]);
  const [files, setFiles] = useState([]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleAmenity = (a) => setAmenities(amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    amenities.forEach(a => fd.append("amenities", a));
    files.forEach(f => fd.append("images", f));
    try {
      await api.post("/listings", fd, { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire({ icon: "success", title: "Listing added!", timer: 1200, showConfirmButton: false });
      nav("/dashboard");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message });
    }
  };
  return (
    <div className="container" style={{ maxWidth: 700, paddingTop: 30 }}>
      <h2>Add a Listing</h2>
      <form onSubmit={submit}>
        <label className="label">Title</label><input className="input" required value={form.title} onChange={set("title")} />
        <label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={set("description")} />
        <label className="label">Location</label><input className="input" required value={form.location} onChange={set("location")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label className="label">Price/night ₹</label><input className="input" type="number" required value={form.price} onChange={set("price")} /></div>
          <div><label className="label">Category</label>
            <select className="input" value={form.category} onChange={set("category")}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div><label className="label">Bedrooms</label><input className="input" type="number" min="1" value={form.bedrooms} onChange={set("bedrooms")} /></div>
          <div><label className="label">Bathrooms</label><input className="input" type="number" min="1" value={form.bathrooms} onChange={set("bathrooms")} /></div>
          <div><label className="label">Guests</label><input className="input" type="number" min="1" value={form.guests} onChange={set("guests")} /></div>
        </div>
        <label className="label">Amenities</label>
        <div>
          {AMENITIES.map(a => (
            <button type="button" key={a} onClick={() => toggleAmenity(a)}
              style={{ margin: 4, padding: "6px 12px", borderRadius: 20, border: "1px solid #ddd",
                       background: amenities.includes(a) ? "#222" : "#fff",
                       color: amenities.includes(a) ? "#fff" : "#222" }}>
              {a}
            </button>
          ))}
        </div>
        <label className="label">Images</label>
        <input className="input" type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} />
        <button className="btn" style={{ marginTop: 20 }} type="submit">Create Listing</button>
      </form>
    </div>
  );
}
