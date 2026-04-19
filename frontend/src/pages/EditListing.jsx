import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.js";
import Swal from "sweetalert2";

export default function EditListing() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    api.get(`/listings/${id}`).then(({ data }) => {
      setForm(data);
      setAmenities(data.amenities || []);
    });
  }, [id]);
  if (!form) return <div className="container" style={{ paddingTop: 30 }}>Loading...</div>;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    ["title", "description", "location", "price", "bedrooms", "bathrooms", "guests", "category"].forEach(k => fd.append(k, form[k]));
    amenities.forEach(a => fd.append("amenities", a));
    files.forEach(f => fd.append("images", f));
    try {
      await api.put(`/listings/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
      nav("/dashboard");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error", text: e.response?.data?.message || e.message });
    }
  };
  return (
    <div className="container" style={{ maxWidth: 700, paddingTop: 30 }}>
      <h2>Edit Listing</h2>
      <form onSubmit={submit}>
        <label className="label">Title</label><input className="input" value={form.title} onChange={set("title")} />
        <label className="label">Description</label><textarea className="input" rows={3} value={form.description || ""} onChange={set("description")} />
        <label className="label">Location</label><input className="input" value={form.location} onChange={set("location")} />
        <label className="label">Price</label><input className="input" type="number" value={form.price} onChange={set("price")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div><label className="label">Bedrooms</label><input className="input" type="number" value={form.bedrooms} onChange={set("bedrooms")} /></div>
          <div><label className="label">Bathrooms</label><input className="input" type="number" value={form.bathrooms} onChange={set("bathrooms")} /></div>
          <div><label className="label">Guests</label><input className="input" type="number" value={form.guests} onChange={set("guests")} /></div>
        </div>
        <label className="label">Amenities (comma separated)</label>
        <input className="input" value={amenities.join(", ")} onChange={(e) => setAmenities(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
        <label className="label">Add more images</label>
        <input className="input" type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} />
        <button className="btn" style={{ marginTop: 20 }} type="submit">Save Changes</button>
      </form>
    </div>
  );
}
